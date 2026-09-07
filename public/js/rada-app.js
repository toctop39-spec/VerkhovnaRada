// Official Verkhovna Rada Voting System - Frontend Application
const socket = io();

// Official translations for Verkhovna Rada system
const translations = {
    uk: {
        systemTitle: 'СИСТЕМА ГОЛОСУВАННЯ',
        systemSubtitle: 'Офіційна електронна система голосування Верховної Ради України',
        createSession: 'Створити Сесію',
        joinSession: 'Приєднатися до Сесії',
        sessionName: 'Назва сесії:',
        sessionPassword: 'Пароль (необов\'язково):',
        deputyName: 'Прізвище депутата:',
        create: 'Створити',
        join: 'Приєднатися',
        back: 'Назад',
        sessionCode: 'Код сесії:',
        leaveSession: 'Покинути сесію',
        deputiesList: 'Список депутатів',
        newVoting: 'Нове голосування',
        votingQuestion: 'Питання для голосування:',
        votingDuration: 'Час на голосування (секунди):',
        requiredVotes: 'Необхідна кількість голосів "ЗА" для прийняття:',
        startVoting: 'Почати голосування',
        timeRemaining: 'Час залишилося:',
        seconds: 'сек.',
        voteFor: 'ЗА',
        voteAgainst: 'ПРОТИ',
        voteAbstain: 'УТРИМАВСЯ',
        votedDeputies: 'Проголосувало депутатів:',
        votingResults: 'Результати голосування',
        notVoted: 'НЕ ПРОГОЛОСУВАЛО',
        showDetails: 'Показати деталі голосування',
        deputy: 'Депутат',
        vote: 'Голос',
        error: 'Помилка',
        close: 'Закрити',
        decisionAccepted: 'РІШЕННЯ ПРИЙНЯТО',
        decisionRejected: 'РІШЕННЯ НЕ ПРИЙНЯТО',
        sessionCreated: 'Сесію створено! Код сесії:',
        sessionJoined: 'Ви приєдналися до сесії',
        votingStarted: 'Голосування розпочато',
        youVoted: 'Ви проголосували',
        allVoted: 'Всі депутати проголосували',
        timeUp: 'Час вийшов!',
        roomNotFound: 'Сесію не знайдено',
        incorrectPassword: 'Невірний пароль',
        usernameTaken: 'Таке прізвище вже зайнято',
        voteForShort: 'ЗА',
        voteAgainstShort: 'ПРОТИ',
        voteAbstainShort: 'УТРИМ.',
        voteNoneShort: 'НЕ ГОЛОС.'
    },
    ru: {
        systemTitle: 'СИСТЕМА ГОЛОСОВАНИЯ',
        systemSubtitle: 'Официальная электронная система голосования Верховной Рады Украины',
        createSession: 'Создать Сессию',
        joinSession: 'Присоединиться к Сессии',
        sessionName: 'Название сессии:',
        sessionPassword: 'Пароль (необязательно):',
        deputyName: 'Фамилия депутата:',
        create: 'Создать',
        join: 'Присоединиться',
        back: 'Назад',
        sessionCode: 'Код сессии:',
        leaveSession: 'Покинуть сессию',
        deputiesList: 'Список депутатов',
        newVoting: 'Новое голосование',
        votingQuestion: 'Вопрос для голосования:',
        votingDuration: 'Время на голосование (секунды):',
        requiredVotes: 'Необходимое количество голосов "ЗА" для принятия:',
        startVoting: 'Начать голосование',
        timeRemaining: 'Время осталось:',
        seconds: 'сек.',
        voteFor: 'ЗА',
        voteAgainst: 'ПРОТИВ',
        voteAbstain: 'ВОЗДЕРЖАЛСЯ',
        votedDeputies: 'Проголосовало депутатов:',
        votingResults: 'Результаты голосования',
        notVoted: 'НЕ ПРОГОЛОСОВАЛО',
        showDetails: 'Показать детали голосования',
        deputy: 'Депутат',
        vote: 'Голос',
        error: 'Ошибка',
        close: 'Закрыть',
        decisionAccepted: 'РЕШЕНИЕ ПРИНЯТО',
        decisionRejected: 'РЕШЕНИЕ НЕ ПРИНЯТО',
        sessionCreated: 'Сессия создана! Код сессии:',
        sessionJoined: 'Вы присоединились к сессии',
        votingStarted: 'Голосование начато',
        youVoted: 'Вы проголосовали',
        allVoted: 'Все депутаты проголосовали',
        timeUp: 'Время вышло!',
        roomNotFound: 'Сессия не найдена',
        incorrectPassword: 'Неверный пароль',
        usernameTaken: 'Такая фамилия уже занята',
        voteForShort: 'ЗА',
        voteAgainstShort: 'ПРОТИ',
        voteAbstainShort: 'ВОЗДЕРЖ.',
        voteNoneShort: 'НЕ ГОЛОС.'
    },
    en: {
        systemTitle: 'VOTING SYSTEM',
        systemSubtitle: 'Official electronic voting system of the Verkhovna Rada of Ukraine',
        createSession: 'Create Session',
        joinSession: 'Join Session',
        sessionName: 'Session name:',
        sessionPassword: 'Password (optional):',
        deputyName: 'Deputy surname:',
        create: 'Create',
        join: 'Join',
        back: 'Back',
        sessionCode: 'Session code:',
        leaveSession: 'Leave session',
        deputiesList: 'Deputies list',
        newVoting: 'New voting',
        votingQuestion: 'Voting question:',
        votingDuration: 'Voting time (seconds):',
        requiredVotes: 'Required "FOR" votes for acceptance:',
        startVoting: 'Start voting',
        timeRemaining: 'Time remaining:',
        seconds: 'sec.',
        voteFor: 'FOR',
        voteAgainst: 'AGAINST',
        voteAbstain: 'ABSTAINED',
        votedDeputies: 'Deputies voted:',
        votingResults: 'Voting results',
        notVoted: 'NOT VOTED',
        showDetails: 'Show voting details',
        deputy: 'Deputy',
        vote: 'Vote',
        error: 'Error',
        close: 'Close',
        decisionAccepted: 'DECISION ACCEPTED',
        decisionRejected: 'DECISION REJECTED',
        sessionCreated: 'Session created! Session code:',
        sessionJoined: 'You joined the session',
        votingStarted: 'Voting started',
        youVoted: 'You voted',
        allVoted: 'All deputies voted',
        timeUp: 'Time is up!',
        roomNotFound: 'Session not found',
        incorrectPassword: 'Incorrect password',
        usernameTaken: 'This surname is already taken',
        voteForShort: 'FOR',
        voteAgainstShort: 'AGAINST',
        voteAbstainShort: 'ABST.',
        voteNoneShort: 'NO VOTE'
    }
};

// Application state
let currentLanguage = 'uk';
let currentSessionId = null;
let isSpeaker = false; // Host is called "Speaker" in Rada context
let hasVoted = false;
let timerInterval = null;

// DOM elements
const screens = {
    mainMenu: document.getElementById('mainMenu'),
    createSession: document.getElementById('createRoomScreen'),
    joinSession: document.getElementById('joinRoomScreen'),
    session: document.getElementById('roomScreen')
};

const languageSelect = document.getElementById('languageSelect');

// Initialize application
function init() {
    setupEventListeners();
    updateLanguage('uk');
}

function setupEventListeners() {
    // Language selection
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateLanguage(currentLanguage);
        if (currentSessionId) {
            socket.emit('changeLanguage', { sessionId: currentSessionId, language: currentLanguage });
        }
    });

    // Navigation
    document.getElementById('createRoomBtn').addEventListener('click', () => showScreen('createSession'));
    document.getElementById('joinRoomBtn').addEventListener('click', () => showScreen('joinSession'));
    document.getElementById('backFromCreate').addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('backFromJoin').addEventListener('click', () => showScreen('mainMenu'));
    document.getElementById('leaveRoomBtn').addEventListener('click', leaveSession);

    // Forms
    document.getElementById('createRoomForm').addEventListener('submit', createSession);
    document.getElementById('joinRoomForm').addEventListener('submit', joinSession);
    document.getElementById('startVotingForm').addEventListener('submit', startVoting);

    // Voting buttons
    document.querySelectorAll('.vote-button').forEach(btn => {
        btn.addEventListener('click', () => castVote(btn.dataset.vote));
    });

    // Results details
    document.getElementById('showDetailsBtn').addEventListener('click', () => {
        document.getElementById('voteDetails').classList.toggle('hidden');
    });

    // Error modal
    document.getElementById('closeError').addEventListener('click', () => {
        document.getElementById('errorModal').classList.add('hidden');
    });
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

function updateLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

function createSession(e) {
    e.preventDefault();
    const sessionName = document.getElementById('newRoomName').value;
    const password = document.getElementById('newRoomPassword').value;
    const deputyName = document.getElementById('creatorName').value;

    socket.emit('createRoom', { 
        roomName: sessionName, 
        password: password, 
        userName: deputyName, 
        language: currentLanguage 
    });
}

function joinSession(e) {
    e.preventDefault();
    const sessionId = document.getElementById('joinRoomId').value.toUpperCase();
    const password = document.getElementById('joinRoomPassword').value;
    const deputyName = document.getElementById('joinerName').value;

    socket.emit('joinRoom', { 
        roomId: sessionId, 
        password: password, 
        userName: deputyName, 
        language: currentLanguage 
    });
}

function leaveSession() {
    if (currentSessionId) {
        socket.emit('leaveRoom', { roomId: currentSessionId });
    }
    currentSessionId = null;
    isSpeaker = false;
    hasVoted = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    showScreen('mainMenu');
    resetSessionUI();
}

function resetSessionUI() {
    document.getElementById('usersList').innerHTML = '';
    document.getElementById('hostControls').classList.add('hidden');
    document.getElementById('votingArea').classList.add('hidden');
    document.getElementById('resultsArea').classList.add('hidden');
    document.querySelectorAll('.vote-button').forEach(btn => btn.disabled = false);
}

function startVoting(e) {
    e.preventDefault();
    const question = document.getElementById('votingQuestion').value;
    const duration = parseInt(document.getElementById('votingDuration').value);
    const requiredVotes = parseInt(document.getElementById('requiredVotes').value);

    socket.emit('startVoting', { 
        roomId: currentSessionId, 
        question, 
        duration, 
        requiredVotes 
    });
    
    // Reset form
    document.getElementById('votingQuestion').value = '';
}

function castVote(vote) {
    if (!currentSessionId || hasVoted) return;
    
    socket.emit('castVote', { 
        roomId: currentSessionId, 
        votingId: Date.now(), 
        vote 
    });
    hasVoted = true;
    document.querySelectorAll('.vote-button').forEach(btn => btn.disabled = true);
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.remove('hidden');
}

function updateDeputiesList(deputies) {
    const deputiesList = document.getElementById('usersList');
    deputiesList.innerHTML = deputies.map(deputy => {
        const initial = deputy.name.charAt(0).toUpperCase();
        const statusClass = deputy.hasVoted ? 'status-voted' : 'status-not-voted';
        
        let statusText;
        if (deputy.hasVoted && deputy.vote) {
            switch(deputy.vote) {
                case 'for':
                    statusText = translations[currentLanguage].voteForShort;
                    break;
                case 'against':
                    statusText = translations[currentLanguage].voteAgainstShort;
                    break;
                case 'abstain':
                    statusText = translations[currentLanguage].voteAbstainShort;
                    break;
                default:
                    statusText = translations[currentLanguage].youVoted;
            }
        } else {
            statusText = translations[currentLanguage].notVoted;
        }
        
        return `
            <li class="deputy-item">
                <div class="deputy-avatar">${initial}</div>
                <span class="deputy-name">${deputy.name}</span>
                <span class="deputy-status ${statusClass}">${statusText}</span>
            </li>
        `;
    }).join('');
}

function startTimer(duration) {
    let timeLeft = duration;
    document.getElementById('timerDisplay').textContent = timeLeft;
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timerDisplay').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }, 1000);
}

function displayResults(results) {
    document.getElementById('votingArea').classList.add('hidden');
    document.getElementById('resultsArea').classList.remove('hidden');
    
    document.getElementById('resultFor').textContent = results.forVotes;
    document.getElementById('resultAgainst').textContent = results.againstVotes;
    document.getElementById('resultAbstain').textContent = results.abstainedVotes;
    document.getElementById('resultNotVoted').textContent = results.notVoted;
    
    const decisionElement = document.getElementById('decision');
    decisionElement.textContent = results.decision === 'accepted' 
        ? translations[currentLanguage].decisionAccepted 
        : translations[currentLanguage].decisionRejected;
    decisionElement.className = 'decision-banner ' + (results.decision === 'accepted' ? 'decision-accepted' : 'decision-rejected');
    
    // Vote details table
    const voteDetailsBody = document.getElementById('voteDetailsBody');
    voteDetailsBody.innerHTML = results.voteDetails.map(detail => {
        let voteText;
        switch(detail.vote) {
            case 'for':
                voteText = translations[currentLanguage].voteForShort;
                break;
            case 'against':
                voteText = translations[currentLanguage].voteAgainstShort;
                break;
            case 'abstain':
                voteText = translations[currentLanguage].voteAbstainShort;
                break;
            default:
                voteText = translations[currentLanguage].voteNoneShort;
        }
        
        return `
            <tr>
                <td>${detail.name}</td>
                <td>${voteText}</td>
            </tr>
        `;
    }).join('');
    
    // Reset voting state
    hasVoted = false;
    document.querySelectorAll('.vote-button').forEach(btn => btn.disabled = false);
}

// Socket event listeners
socket.on('roomCreated', ({ sessionId, roomName, isHost: host }) => {
    currentSessionId = sessionId;
    isSpeaker = host;
    
    document.getElementById('roomTitle').textContent = `${translations[currentLanguage].sessionCreated} ${sessionId}`;
    document.getElementById('roomCode').textContent = `${translations[currentLanguage].sessionCode} ${sessionId}`;
    
    // Initialize total users count for the host (starts with 1)
    document.getElementById('totalUsers').textContent = '1';
    
    showScreen('session');
    
    if (isSpeaker) {
        document.getElementById('hostControls').classList.remove('hidden');
    }
});

socket.on('roomJoined', ({ roomId, roomName, isHost: host, deputies, currentVoting, language }) => {
    currentSessionId = roomId;
    isSpeaker = host;
    
    if (language) {
        currentLanguage = language;
        languageSelect.value = language;
        updateLanguage(language);
    }
    
    document.getElementById('roomTitle').textContent = `${translations[currentLanguage].sessionJoined} ${roomName}`;
    document.getElementById('roomCode').textContent = `${translations[currentLanguage].sessionCode} ${roomId}`;
    
    updateDeputiesList(deputies);
    
    // Initialize total users count
    document.getElementById('totalUsers').textContent = deputies.length;
    
    if (isSpeaker) {
        document.getElementById('hostControls').classList.remove('hidden');
    }
    
    if (currentVoting) {
        document.getElementById('currentQuestion').textContent = currentVoting.question;
        document.getElementById('votingArea').classList.remove('hidden');
        startTimer(currentVoting.duration);
    }
    
    showScreen('session');
});

socket.on('userJoined', ({ userName, deputies }) => {
    updateDeputiesList(deputies);
    document.getElementById('totalUsers').textContent = deputies.length;
});

socket.on('userLeft', ({ userName, deputies }) => {
    updateDeputiesList(deputies);
    document.getElementById('totalUsers').textContent = deputies.length;
});

socket.on('deputiesUpdated', ({ deputies }) => {
    updateDeputiesList(deputies);
    document.getElementById('totalUsers').textContent = deputies.length;
});

socket.on('hostChanged', ({ newSpeaker }) => {
    isSpeaker = socket.id === sessions[currentSessionId]?.speaker;
    if (isSpeaker) {
        document.getElementById('hostControls').classList.remove('hidden');
    }
});

socket.on('votingStarted', ({ votingId, question, duration, requiredVotes, totalDeputies }) => {
    document.getElementById('currentQuestion').textContent = question;
    document.getElementById('votingArea').classList.remove('hidden');
    document.getElementById('resultsArea').classList.add('hidden');
    
    // Reset voting counter and set total
    document.getElementById('votedCount').textContent = '0';
    if (totalDeputies) {
        document.getElementById('totalUsers').textContent = totalDeputies;
    }
    
    hasVoted = false;
    document.querySelectorAll('.vote-button').forEach(btn => btn.disabled = false);
    
    startTimer(duration);
});

socket.on('voteCast', ({ userName, vote, votedCount, totalDeputies }) => {
    document.getElementById('votedCount').textContent = votedCount;
    document.getElementById('totalUsers').textContent = totalDeputies;
});

socket.on('votingEnded', (results) => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    displayResults(results);
});

socket.on('error', ({ message }) => {
    showError(message);
});

socket.on('languageChanged', ({ userName, language }) => {
    // Update UI if needed
});

// Start the application
init();
