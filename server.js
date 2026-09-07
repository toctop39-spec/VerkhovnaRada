const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Main route - serve the Rada voting system
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rada-voting.html'));
});

// Store sessions (rooms) data
const sessions = {};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Deputy connected:', socket.id);

    // Create session (room)
    socket.on('createRoom', ({ roomName, password, userName, language }) => {
        const sessionId = generateSessionId();
        sessions[sessionId] = {
            name: roomName,
            password: password,
            speaker: socket.id, // Host is called "Speaker" in Rada context
            deputies: [{ id: socket.id, name: userName, language: language, hasVoted: false }],
            currentVoting: null,
            votingHistory: [],
            language: language,
            createdAt: Date.now()
        };
        
        socket.join(sessionId);
        socket.emit('roomCreated', { 
            sessionId, 
            roomName, 
            isHost: true 
        });
        io.to(sessionId).emit('userJoined', { 
            userName, 
            deputies: sessions[sessionId].deputies 
        });
        
        console.log(`Session created: ${sessionId} by ${userName}`);
    });

    // Join session
    socket.on('joinRoom', ({ roomId, password, userName, language }) => {
        const session = sessions[roomId];
        
        if (!session) {
            socket.emit('error', { message: getTranslation(language, 'roomNotFound') });
            return;
        }
        
        if (session.password && session.password !== password) {
            socket.emit('error', { message: getTranslation(language, 'incorrectPassword') });
            return;
        }
        
        // Check if deputy already exists
        const existingDeputy = session.deputies.find(d => d.name === userName);
        if (existingDeputy) {
            socket.emit('error', { message: getTranslation(language, 'usernameTaken') });
            return;
        }
        
        socket.join(roomId);
        session.deputies.push({ 
            id: socket.id, 
            name: userName, 
            language: language, 
            hasVoted: false 
        });
        
        socket.emit('roomJoined', { 
            roomId, 
            roomName: session.name, 
            isHost: session.speaker === socket.id,
            deputies: session.deputies,
            currentVoting: session.currentVoting,
            language: session.language
        });
        
        io.to(roomId).emit('userJoined', { 
            userName, 
            deputies: session.deputies 
        });
        
        console.log(`Deputy ${userName} joined session ${roomId}`);
    });

    // Start voting
    socket.on('startVoting', ({ roomId, question, duration, requiredVotes }) => {
        const session = sessions[roomId];
        
        if (!session || session.speaker !== socket.id) {
            socket.emit('error', { message: 'Not authorized' });
            return;
        }
        
        const votingId = Date.now();
        session.currentVoting = {
            id: votingId,
            question,
            duration,
            requiredVotes,
            endTime: Date.now() + duration * 1000,
            votes: {},
            status: 'active'
        };
        
        // Reset deputy votes
        session.deputies.forEach(deputy => {
            deputy.hasVoted = false;
            deputy.vote = null;
        });
        
        io.to(roomId).emit('votingStarted', { 
            votingId, 
            question, 
            duration, 
            requiredVotes 
        });
        
        // Set timer
        setTimeout(() => {
            endVoting(roomId);
        }, duration * 1000);
        
        console.log(`Voting started in session ${roomId}: ${question}`);
    });

    // Cast vote
    socket.on('castVote', ({ roomId, votingId, vote }) => {
        const session = sessions[roomId];
        
        if (!session || !session.currentVoting || session.currentVoting.id !== votingId) {
            return;
        }
        
        if (session.currentVoting.status !== 'active') {
            return;
        }
        
        const deputy = session.deputies.find(d => d.id === socket.id);
        if (!deputy || deputy.hasVoted) {
            return;
        }
        
        session.currentVoting.votes[socket.id] = vote;
        deputy.hasVoted = true;
        deputy.vote = vote;
        
        io.to(roomId).emit('voteCast', { 
            userName: deputy.name, 
            vote,
            votedCount: Object.keys(session.currentVoting.votes).length,
            totalDeputies: session.deputies.length
        });
        
        // Check if all deputies voted
        if (Object.keys(session.currentVoting.votes).length === session.deputies.length) {
            endVoting(roomId);
        }
        
        console.log(`Deputy ${deputy.name} voted ${vote} in session ${roomId}`);
    });

    // Get voting results
    socket.on('getVotingResults', ({ roomId }) => {
        const session = sessions[roomId];
        if (!session || !session.currentVoting) {
            return;
        }
        
        const results = calculateResults(session);
        socket.emit('votingResults', results);
    });

    // Change language
    socket.on('changeLanguage', ({ roomId, language }) => {
        const session = sessions[roomId];
        if (!session) return;
        
        const deputy = session.deputies.find(d => d.id === socket.id);
        if (deputy) {
            deputy.language = language;
        }
        
        io.to(roomId).emit('languageChanged', { 
            userName: deputy.name, 
            language 
        });
    });

    // Leave room
    socket.on('leaveRoom', ({ roomId }) => {
        const session = sessions[roomId];
        if (!session) return;
        
        handleDeputyDisconnect(socket.id, roomId);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('Deputy disconnected:', socket.id);
        
        // Remove deputy from all sessions
        for (const sessionId in sessions) {
            const session = sessions[sessionId];
            const deputyIndex = session.deputies.findIndex(d => d.id === socket.id);
            
            if (deputyIndex !== -1) {
                handleDeputyDisconnect(socket.id, sessionId);
                break;
            }
        }
    });
});

function handleDeputyDisconnect(socketId, sessionId) {
    const session = sessions[sessionId];
    if (!session) return;
    
    const deputyIndex = session.deputies.findIndex(d => d.id === socketId);
    
    if (deputyIndex !== -1) {
        const deputyName = session.deputies[deputyIndex].name;
        session.deputies.splice(deputyIndex, 1);
        
        // If speaker disconnected, assign new speaker or close session
        if (session.speaker === socketId) {
            if (session.deputies.length > 0) {
                session.speaker = session.deputies[0].id;
                io.to(sessionId).emit('hostChanged', { 
                    newSpeaker: session.deputies[0].name 
                });
            } else {
                delete sessions[sessionId];
                console.log(`Session ${sessionId} closed (no deputies)`);
                return;
            }
        }
        
        io.to(sessionId).emit('userLeft', { 
            userName: deputyName, 
            deputies: session.deputies 
        });
    }
}

function endVoting(sessionId) {
    const session = sessions[sessionId];
    if (!session || !session.currentVoting) return;
    
    session.currentVoting.status = 'ended';
    const results = calculateResults(session);
    
    // Save to history
    session.votingHistory.push({
        ...session.currentVoting,
        results,
        timestamp: Date.now()
    });
    
    io.to(sessionId).emit('votingEnded', results);
    
    // Clear current voting after a delay
    setTimeout(() => {
        if (sessions[sessionId]) {
            sessions[sessionId].currentVoting = null;
        }
    }, 30000);
    
    console.log(`Voting ended in session ${sessionId}`);
}

function calculateResults(session) {
    const voting = session.currentVoting;
    const votes = voting.votes;
    
    let forVotes = 0;
    let againstVotes = 0;
    let abstainedVotes = 0;
    const voteDetails = [];
    
    session.deputies.forEach(deputy => {
        const vote = votes[deputy.id];
        if (vote === 'for') {
            forVotes++;
            voteDetails.push({ name: deputy.name, vote: 'for' });
        } else if (vote === 'against') {
            againstVotes++;
            voteDetails.push({ name: deputy.name, vote: 'against' });
        } else if (vote === 'abstain') {
            abstainedVotes++;
            voteDetails.push({ name: deputy.name, vote: 'abstain' });
        } else {
            voteDetails.push({ name: deputy.name, vote: 'none' });
        }
    });
    
    const notVoted = session.deputies.length - Object.keys(votes).length;
    const totalDeputies = session.deputies.length;
    const halfDeputies = Math.ceil(totalDeputies / 2);
    
    let decision = 'rejected';
    if (forVotes > halfDeputies || forVotes >= voting.requiredVotes) {
        decision = 'accepted';
    }
    
    return {
        question: voting.question,
        forVotes,
        againstVotes,
        abstainedVotes,
        notVoted,
        totalDeputies,
        decision,
        voteDetails,
        requiredVotes: voting.requiredVotes
    };
}

function generateSessionId() {
    // Generate 6-character uppercase session ID
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getTranslation(language, key) {
    const translations = {
        uk: {
            roomNotFound: 'Сесію не знайдено',
            incorrectPassword: 'Невірний пароль',
            usernameTaken: 'Таке прізвище вже зайнято'
        },
        ru: {
            roomNotFound: 'Сессия не найдена',
            incorrectPassword: 'Неверный пароль',
            usernameTaken: 'Такая фамилия уже занята'
        },
        en: {
            roomNotFound: 'Session not found',
            incorrectPassword: 'Incorrect password',
            usernameTaken: 'This surname is already taken'
        }
    };
    
    return translations[language]?.[key] || translations['en'][key] || key;
}

// Clean up old sessions periodically (older than 24 hours)
setInterval(() => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    for (const sessionId in sessions) {
        if (now - sessions[sessionId].createdAt > dayInMs) {
            console.log(`Cleaning up old session: ${sessionId}`);
            delete sessions[sessionId];
        }
    }
}, 60 * 60 * 1000); // Check every hour

server.listen(PORT, () => {
    console.log(`Verkhovna Rada Voting System running on port ${PORT}`);
    console.log(`Access the system at: http://localhost:${PORT}`);
});
