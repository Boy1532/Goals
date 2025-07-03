// App State
let goals = JSON.parse(localStorage.getItem('goals') || '[]');
let archivedGoals = JSON.parse(localStorage.getItem('archivedGoals') || '[]');
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentDate = new Date();
let selectedDate = new Date();
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentLanguage = localStorage.getItem('language') || 'uk';
let notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';

// Tab state
let currentTab = 'goals';

// Drag and drop state
let draggedElement = null;
let draggedIndex = -1;

// Offline status
let isOnline = navigator.onLine;
let offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');

// DOM Elements - will be initialized later
let appTitle, goalsList, emptyState, addGoalBtn, settingsBtn;
let addGoalModal, goalDetailModal, settingsModal, archiveModal, editGoalModal;

// Localization
const translations = {
    uk: {
        'My Goals': 'Мої цілі',
        'Add Goal': 'Додати ціль',
        'Edit Goal': 'Редагувати ціль',
        'Settings': 'Налаштування',
        'Archive': 'Архів',
        'Archived Goals': 'Архівні цілі',
        'Cancel': 'Скасувати',
        'Save': 'Зберегти',
        'Done': 'Готово',
        'Edit': 'Редагувати',
        'Delete': 'Видалити',
        'Archive Goal': 'Перенести в архів',
        'Completed Steps': 'Виконані кроки',
        'Goal Title': 'Назва цілі',
        'Enter goal title': 'Введіть назву цілі',
        'Description (Optional)': 'Опис (необов\'язково)',
        'Enter description': 'Введіть опис',
        'Number of Progress Bars': 'Кількість смужок прогресу',
        'Steps for bars (Optional)': 'Кроки для смужок (необов\'язково)',
        'Add Step': 'Додати крок',
        'Enter step description': 'Введіть опис кроку',
        'No Goals Yet': 'Поки що немає цілей',
        'Tap the + button to add your first goal': 'Натисніть кнопку + щоб додати першу ціль',
        'Archive is Empty': 'Архів порожній',
        'Completed goals will be stored here': 'Тут будуть зберігатися завершені цілі',
        'Progress': 'Прогрес',
        'Daily Progress Bars': 'Щоденні смужки прогресу',
        'Click on bar to change status': 'Клікніть на смужку для зміни статусу',
        'Long press for description': 'Утримайте для опису',
        'Description': 'Опис',
        'Goal': 'Ціль',
        'Step': 'Крок',
        'Archived': 'Архівовано',
        'Language': 'Мова',
        'Notifications': 'Сповіщення',
        'Enable Notifications': 'Увімкнути сповіщення',
        'Reminder 1': 'Нагадування 1',
        'Reminder 2': 'Нагадування 2',
        'Reminder 3': 'Нагадування 3',
        'Time to check your goals progress!': 'Час перевірити прогрес цілей!',
        'Don\'t forget to update your goals!': 'Не забудьте оновити цілі!',
        'Evening goals review time!': 'Час вечірнього огляду цілей!',
        'Lunch Reminder (12:00)': 'Нагадування про обід (12:00)',
        'Evening Reminder (19:00)': 'Вечірнє нагадування (19:00)',
        'App Information': 'Інформація про додаток',
        'Version': 'Версія',
        'Developer': 'Розробник'
    },
    en: {
        'My Goals': 'My Goals',
        'Add Goal': 'Add Goal',
        'Edit Goal': 'Edit Goal',
        'Settings': 'Settings',
        'Archive': 'Archive',
        'Archived Goals': 'Archived Goals',
        'Cancel': 'Cancel',
        'Save': 'Save',
        'Done': 'Done',
        'Edit': 'Edit',
        'Delete': 'Delete',
        'Archive Goal': 'Archive Goal',
        'Completed Steps': 'Completed Steps',
        'Goal Title': 'Goal Title',
        'Enter goal title': 'Enter goal title',
        'Description (Optional)': 'Description (Optional)',
        'Enter description': 'Enter description',
        'Number of Progress Bars': 'Number of Progress Bars',
        'Steps for bars (Optional)': 'Steps for bars (Optional)',
        'Add Step': 'Add Step',
        'Enter step description': 'Enter step description',
        'No Goals Yet': 'No Goals Yet',
        'Tap the + button to add your first goal': 'Tap the + button to add your first goal',
        'Archive is Empty': 'Archive is Empty',
        'Completed goals will be stored here': 'Completed goals will be stored here',
        'Progress': 'Progress',
        'Daily Progress Bars': 'Daily Progress Bars',
        'Click on bar to change status': 'Click on bar to change status',
        'Long press for description': 'Long press for description',
        'Description': 'Description',
        'Goal': 'Goal',
        'Step': 'Step',
        'Archived': 'Archived',
        'Language': 'Language',
        'Notifications': 'Notifications',
        'Enable Notifications': 'Enable Notifications',
        'Reminder 1': 'Reminder 1',
        'Reminder 2': 'Reminder 2',
        'Reminder 3': 'Reminder 3',
        'Time to check your goals progress!': 'Time to check your goals progress!',
        'Don\'t forget to update your goals!': "Don't forget to update your goals!",
        'Evening goals review time!': 'Evening goals review time!',
        'Lunch Reminder (12:00)': 'Lunch Reminder (12:00)',
        'Evening Reminder (19:00)': 'Evening Reminder (19:00)',
        'App Information': 'App Information',
        'Version': 'Version',
        'Developer': 'Developer'
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
    
    initializeDOMElements();
    loadAppData(); // Load data from IndexedDB first
    setupEventListeners();
    initializeApp();
    updateUI();
    renderGoals();
    renderArchivedGoals();
    renderTasks();
    updateOfflineIndicator(); // Show offline status
    
    console.log('App initialized successfully');
});

function initializeDOMElements() {
    // Initialize DOM elements
    appTitle = document.getElementById('app-title');
    goalsList = document.getElementById('goals-list');
    emptyState = document.getElementById('empty-state');
    addGoalBtn = document.getElementById('add-goal-btn');
    settingsBtn = document.getElementById('settings-btn');
    
    // Initialize tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tasksList = document.getElementById('tasks-list');
    
    // Initialize modals
    addGoalModal = document.getElementById('add-goal-modal');
    goalDetailModal = document.getElementById('goal-detail-modal');
    settingsModal = document.getElementById('settings-modal');
    archiveModal = document.getElementById('archive-modal');
    editGoalModal = document.getElementById('edit-goal-modal');
    
    console.log('DOM elements initialized:', {
        appTitle, goalsList, emptyState, addGoalBtn, settingsBtn,
        addGoalModal, goalDetailModal, settingsModal, archiveModal, editGoalModal
    });
}

function initializeApp() {
    // Set language
    document.documentElement.lang = currentLanguage;
    updateLanguageUI();
    
    // Set notification settings
    const notificationsToggle = document.getElementById('notifications-toggle');
    if (notificationsToggle) {
        notificationsToggle.checked = notificationsEnabled;
    }
}

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });

    // Add goal button
    addGoalBtn.addEventListener('click', showAddGoalModal);
    
    // Settings button
    settingsBtn.addEventListener('click', showSettingsModal);
    
    // Archive button
    document.getElementById('archive-btn').addEventListener('click', showArchiveModal);
    
    // Modal close buttons
    document.getElementById('close-modal').addEventListener('click', hideAddGoalModal);
    document.getElementById('close-detail-modal').addEventListener('click', hideGoalDetailModal);
    document.getElementById('close-settings-modal').addEventListener('click', hideSettingsModal);
    document.getElementById('close-archive-modal').addEventListener('click', hideArchiveModal);
    document.getElementById('close-edit-modal').addEventListener('click', hideEditGoalModal);
    
    // Form submissions
    document.getElementById('add-goal-form').addEventListener('submit', handleAddGoal);
    document.getElementById('edit-goal-form').addEventListener('submit', handleEditGoal);
    document.getElementById('add-task-form').addEventListener('submit', handleAddTask);
    
    // Cancel buttons
    document.getElementById('cancel-add').addEventListener('click', hideAddGoalModal);
    document.getElementById('cancel-edit').addEventListener('click', hideEditGoalModal);
    document.getElementById('cancel-task').addEventListener('click', hideAddTaskModal);
    
    // Task modal close button
    document.getElementById('close-task-modal').addEventListener('click', hideAddTaskModal);
    
    // Priority selection
    document.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // Stepper buttons for add goal
    document.getElementById('decrease-bars').addEventListener('click', decreaseBars);
    document.getElementById('increase-bars').addEventListener('click', increaseBars);
    
    // Stepper buttons for edit goal
    document.getElementById('edit-decrease-bars').addEventListener('click', editDecreaseBars);
    document.getElementById('edit-increase-bars').addEventListener('click', editIncreaseBars);
    
    // Settings
    document.getElementById('notifications-toggle').addEventListener('change', toggleNotifications);
    document.getElementById('time-1').addEventListener('change', updateNotificationTime1);
    document.getElementById('time-2').addEventListener('change', updateNotificationTime2);
    document.getElementById('time-3').addEventListener('change', updateNotificationTime3);
    
    // Language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            changeLanguage(lang);
        });
    });
    
    // Backup actions
    document.getElementById('export-data').addEventListener('click', exportAppData);
    document.getElementById('import-data').addEventListener('click', importAppData);
    document.getElementById('clear-data').addEventListener('click', clearAllData);
    
    // Online/offline status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideAllModals();
        }
    });
    
    // Modal backdrop clicks
    addGoalModal.addEventListener('click', (e) => {
        if (e.target === addGoalModal) hideAddGoalModal();
    });
    
    goalDetailModal.addEventListener('click', (e) => {
        if (e.target === goalDetailModal) hideGoalDetailModal();
    });
    
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) hideSettingsModal();
    });
    
    archiveModal.addEventListener('click', (e) => {
        if (e.target === archiveModal) hideArchiveModal();
    });
    
    editGoalModal.addEventListener('click', (e) => {
        if (e.target === editGoalModal) hideEditGoalModal();
    });
    
    // Task modal backdrop click
    const taskModal = document.getElementById('add-task-modal');
    if (taskModal) {
        taskModal.addEventListener('click', (e) => {
            if (e.target === taskModal) hideAddTaskModal();
        });
    }
    
    // Monthly calendar modal backdrop click
    const monthlyCalendarModal = document.getElementById('monthly-calendar-modal');
    if (monthlyCalendarModal) {
        monthlyCalendarModal.addEventListener('click', (e) => {
            if (e.target === monthlyCalendarModal) hideMonthlyCalendar();
        });
    }
    
    // Calendar buttons
    document.getElementById('add-task-btn').addEventListener('click', showAddTaskModal);
    document.getElementById('calendar-view-btn').addEventListener('click', showMonthlyCalendar);
    document.getElementById('close-monthly-calendar-modal').addEventListener('click', hideMonthlyCalendar);
    document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
}

function updateUI() {
    // Update app title based on current tab
    if (currentTab === 'goals') {
        appTitle.textContent = 'Way to Freedom';
        addGoalBtn.onclick = showAddGoalModal;
    } else if (currentTab === 'tasks') {
        appTitle.textContent = 'Way to Freedom';
        addGoalBtn.onclick = showAddTaskModal;
    }
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === currentTab);
    });
    
    // Update content visibility
    const goalsList = document.getElementById('goals-list');
    const tasksList = document.getElementById('tasks-list');
    
    if (currentTab === 'goals') {
        goalsList.style.display = 'block';
        tasksList.style.display = 'none';
        renderGoals();
    } else if (currentTab === 'tasks') {
        goalsList.style.display = 'none';
        tasksList.style.display = 'block';
        renderTasks();
    }
    
    updateEmptyState();
}

function updateLanguageUI() {
    // Update language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.dataset.translate;
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Update specific elements
    const addGoalModalTitle = document.querySelector('#add-goal-modal h2');
    if (addGoalModalTitle) {
        addGoalModalTitle.textContent = translations[currentLanguage]['Add Goal'];
    }
    
    const editGoalModalTitle = document.querySelector('#edit-goal-modal h2');
    if (editGoalModalTitle) {
        editGoalModalTitle.textContent = translations[currentLanguage]['Edit Goal'];
    }
    
    const settingsModalTitle = document.querySelector('#settings-modal h2');
    if (settingsModalTitle) {
        settingsModalTitle.textContent = translations[currentLanguage]['Settings'];
    }
    
    const archiveModalTitle = document.querySelector('#archive-modal h2');
    if (archiveModalTitle) {
        archiveModalTitle.textContent = translations[currentLanguage]['Archived Goals'];
    }
    
    // Update placeholders
    const stepInputs = document.querySelectorAll('#steps-container input, #edit-steps-container input');
    stepInputs.forEach(input => {
        input.placeholder = translations[currentLanguage]['Enter step description'];
    });
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    updateLanguageUI();
    updateUI();
}

// Goal Management
function addGoal(title, description, numberOfBars, steps = []) {
    const totalBars = numberOfBars * 2 + 1; // +1 for center white bar
    const centerIndex = Math.floor(totalBars / 2);
    
    const goal = {
        id: Date.now().toString(),
        title: title,
        description: description,
        progressBars: Array(totalBars).fill().map(() => ({ status: 'neutral' })),
        steps: steps,
        originalBarCount: numberOfBars,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    goals.push(goal);
    saveGoals();
    renderGoals();
}

function archiveGoal(goalId) {
    const goalIndex = goals.findIndex(goal => goal.id === goalId);
    if (goalIndex !== -1) {
        const goal = goals[goalIndex];
        goal.archivedAt = new Date().toISOString();
        archivedGoals.push(goal);
        goals.splice(goalIndex, 1);
        saveGoals();
        saveArchivedGoals();
        renderGoals();
    }
}

function deleteGoal(goalId) {
    goals = goals.filter(goal => goal.id !== goalId);
    saveGoals();
    renderGoals();
}

function updateProgressBar(goalId, barIndex, status) {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
        goal.progressBars[barIndex].status = status;
        goal.updatedAt = new Date().toISOString();
        saveGoals();
    }
}

function calculateProgress(progressBars) {
    const totalBars = progressBars.length;
    const centerIndex = Math.floor(totalBars / 2);
    let greenBars = 0;
    let redBars = 0;
    let totalRightBars = 0;
    
    progressBars.forEach((bar, index) => {
        if (index < centerIndex && bar.status === 'left') {
            redBars += 1;
        } else if (index > centerIndex && bar.status === 'right') {
            greenBars += 1;
        }
        if (index > centerIndex) totalRightBars++;
    });
    if (totalRightBars === 0) return 0;
    // Відсоток може бути від -100 до 100
    const progress = Math.round(((greenBars - redBars) / totalRightBars) * 100);
    return progress;
}

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
    // Backup to IndexedDB for larger storage
    saveToIndexedDB('goals', goals);
}

function saveArchivedGoals() {
    localStorage.setItem('archivedGoals', JSON.stringify(archivedGoals));
    // Backup to IndexedDB for larger storage
    saveToIndexedDB('archivedGoals', archivedGoals);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Backup to IndexedDB for larger storage
    saveToIndexedDB('tasks', tasks);
}

function addTask(title, description, time, notifications = []) {
    const task = {
        id: generateId(),
        title,
        description,
        date: formatDate(selectedDate), // автоматично прив'язуємо до обраного дня
        time,
        completed: false,
        notifications: notifications
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    scheduleTaskNotification(task);
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
        saveTasks();
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderWeekCalendar();
    renderDayTasks(selectedDate);
}

function renderWeekCalendar() {
    const weekDaysContainer = document.getElementById('week-days');
    if (!weekDaysContainer) return;
    const baseDate = selectedDate ? new Date(selectedDate) : new Date();
    const dayOfWeek = baseDate.getDay();
    const sundayOfWeek = new Date(baseDate);
    sundayOfWeek.setDate(baseDate.getDate() - dayOfWeek);
    const startDate = new Date(sundayOfWeek);
    const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const monthNames = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];
    weekDaysContainer.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dayElement = document.createElement('div');
        dayElement.className = 'week-day';
        dayElement.dataset.date = formatDate(date);
        const dateStr = formatDate(date);
        const dayTasks = tasks.filter(task => task.date === dateStr);
        if (dayTasks.length > 0) {
            dayElement.classList.add('has-tasks');
        }
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }
        const completedTasks = tasks.filter(task => {
            // Виправлено: порівнюємо дати як рядки у форматі YYYY-MM-DD
            return task.date === formatDate(date) && task.completed;
        });
        if (completedTasks.length > 0) {
            dayElement.classList.add('has-completed-tasks');
        }
        dayElement.innerHTML = `
            <div class="week-day-name">${dayNames[date.getDay()]}</div>
            <div class="week-day-number">${date.getDate()}</div>
            <div class="week-day-month">${monthNames[date.getMonth()]}</div>
        `;
        dayElement.addEventListener('click', () => {
            selectedDate = date;
            updateCurrentDayInfo();
            renderDayTasks(date);
            updateDayTasksTitle(date);
            renderWeekCalendar();
            document.getElementById('monthly-calendar-modal').classList.remove('show');
        });
        weekDaysContainer.appendChild(dayElement);
    }
    if (selectedDate) {
        updateDayTasksTitle(selectedDate);
    }
}

function renderDayTasks(date) {
    const dayTasksContainer = document.getElementById('day-tasks-list');
    if (!dayTasksContainer) return;
    if (!date) return;
    const dateStr = formatDate(date);
    const dayTasks = tasks.filter(task => task.date === dateStr);
    if (dayTasks.length === 0) {
        dayTasksContainer.innerHTML = '<p class="empty-state">Немає завдань на цей день</p>';
        return;
    }
    dayTasksContainer.innerHTML = dayTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-complete ${task.completed ? 'checked' : ''}" onclick="toggleTaskComplete('${task.id}')"></div>
                <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-time">${task.time}</div>
                </div>
            <div class="task-description">${task.description}</div>
                <div class="task-actions">
                <button class="btn btn-secondary" onclick="editTask('${task.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
    `).join('');
}

// IndexedDB for larger storage
function saveToIndexedDB(key, data) {
    if ('indexedDB' in window) {
        const request = indexedDB.open('GoalsTrackerDB', 1);
        
        request.onerror = () => console.log('IndexedDB error');
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('goalsData')) {
                db.createObjectStore('goalsData', { keyPath: 'key' });
            }
        };
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['goalsData'], 'readwrite');
            const store = transaction.objectStore('goalsData');
            store.put({ key: key, data: data, timestamp: Date.now() });
        };
    }
}

function loadFromIndexedDB(key) {
    return new Promise((resolve) => {
        if ('indexedDB' in window) {
            const request = indexedDB.open('GoalsTrackerDB', 1);
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['goalsData'], 'readonly');
                const store = transaction.objectStore('goalsData');
                const getRequest = store.get(key);
                
                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        resolve(getRequest.result.data);
                    } else {
                        resolve(null);
                    }
                };
            };
        } else {
            resolve(null);
        }
    });
}

function renderGoals() {
    goalsList.innerHTML = '';
    
    if (goals.length === 0) {
        goalsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    goalsList.style.display = 'block';
    emptyState.style.display = 'none';
    
    goals.forEach((goal, idx) => {
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.dataset.goalId = goal.id;
        goalElement.draggable = true;
        
        const progress = calculateProgress(goal.progressBars);
        let progressClass = 'neutral';
        if (progress > 0) progressClass = 'positive';
        if (progress < 0) progressClass = 'negative';
        goalElement.innerHTML = `
            <div class="goal-drag-handle" title="Перетягнути">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="goal-header">
                <h3 class="goal-title">${goal.title}</h3>
                <span class="goal-progress ${progressClass}">${progress}%</span>
            </div>
            ${goal.description ? `<p class="goal-description">${goal.description}</p>` : ''}
            <div class="goal-progress-bar">
                <div class="goal-progress-fill ${progress < 0 ? 'negative' : ''}" style="width: ${Math.abs(progress)}%"></div>
            </div>
        `;
        
        goalElement.addEventListener('click', () => showGoalDetail(goal.id));
        
        // Drag and drop
        goalElement.addEventListener('dragstart', (e) => {
            draggedElement = goalElement;
            draggedIndex = idx;
            goalElement.classList.add('dragging');
        });
        
        goalElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (goalElement !== draggedElement) {
                goalElement.classList.add('drag-over');
            }
        });
        
        goalElement.addEventListener('dragleave', () => {
            goalElement.classList.remove('drag-over');
        });
        
        goalElement.addEventListener('drop', (e) => {
            e.preventDefault();
            goalElement.classList.remove('drag-over');
            if (draggedElement && draggedElement !== goalElement) {
                const dropIndex = idx;
                if (dropIndex !== draggedIndex) {
                    const [movedGoal] = goals.splice(draggedIndex, 1);
                    goals.splice(dropIndex, 0, movedGoal);
                    saveGoals();
                    renderGoals();
                }
            }
        });
        
        goalElement.addEventListener('dragend', () => {
            goalElement.classList.remove('dragging');
            document.querySelectorAll('.goal-item').forEach(item => item.classList.remove('drag-over'));
            draggedElement = null;
            draggedIndex = -1;
        });
        
        goalsList.appendChild(goalElement);
    });
}

// Modal Management
function showAddGoalModal() {
    addGoalModal.style.display = 'block';
    addGoalModal.classList.add('show');
    document.getElementById('goal-title').focus();
}

function hideAddGoalModal() {
    addGoalModal.style.display = 'none';
    addGoalModal.classList.remove('show');
    document.getElementById('add-goal-form').reset();
    document.getElementById('bars-count').textContent = '5';
    document.getElementById('steps-container').innerHTML = '';
    updateStepsContainer();
}

function showGoalDetail(goalId) {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    document.getElementById('detail-goal-title').textContent = goal.title;
    document.getElementById('detail-goal-title').dataset.goalId = goalId;
    if (goal.description) {
        document.getElementById('goal-description-section').style.display = 'block';
        document.getElementById('detail-goal-description').textContent = goal.description;
    } else {
        document.getElementById('goal-description-section').style.display = 'none';
    }
    const progress = calculateProgress(goal.progressBars);
    let progressClass = 'neutral';
    if (progress > 0) progressClass = 'positive';
    if (progress < 0) progressClass = 'negative';
    const progressSpan = document.getElementById('progress-percentage');
    progressSpan.textContent = `${progress}%`;
    progressSpan.className = `goal-progress ${progressClass}`;
    document.getElementById('progress-fill').style.width = `${Math.abs(progress)}%`;
    document.getElementById('progress-fill').className = `progress-fill ${progress < 0 ? 'negative' : ''}`;
    renderProgressBars(goal);
    goalDetailModal.style.display = 'block';
    goalDetailModal.classList.add('show');
    
    // Кнопка архівувати
    const archiveGoalBtn = document.getElementById('archive-goal-btn');
    if (progress >= 100) {
        archiveGoalBtn.style.display = 'block';
    } else {
        archiveGoalBtn.style.display = 'none';
    }
    
    // Додаємо обробники для кнопок
    const editGoalBtn = document.getElementById('edit-goal-btn');
    const deleteGoalBtn = document.getElementById('delete-goal-btn');
    
    // Видаляємо старі обробники
    editGoalBtn.replaceWith(editGoalBtn.cloneNode(true));
    archiveGoalBtn.replaceWith(archiveGoalBtn.cloneNode(true));
    deleteGoalBtn.replaceWith(deleteGoalBtn.cloneNode(true));
    
    // Отримуємо нові посилання
    const newEditGoalBtn = document.getElementById('edit-goal-btn');
    const newArchiveGoalBtn = document.getElementById('archive-goal-btn');
    const newDeleteGoalBtn = document.getElementById('delete-goal-btn');
    
    // Додаємо нові обробники
    newEditGoalBtn.addEventListener('click', () => {
        hideGoalDetailModal();
        showEditGoalModal(goalId);
    });
    
    newArchiveGoalBtn.addEventListener('click', () => {
        if (confirm('Перенести ціль в архів?')) {
            archiveGoal(goalId);
            hideGoalDetailModal();
        }
    });
    
    newDeleteGoalBtn.addEventListener('click', () => {
        if (confirm('Видалити ціль назавжди?')) {
            deleteGoal(goalId);
            hideGoalDetailModal();
        }
    });
}

function hideGoalDetailModal() {
    goalDetailModal.style.display = 'none';
    goalDetailModal.classList.remove('show');
}

function showSettingsModal() {
    settingsModal.style.display = 'block';
    settingsModal.classList.add('show');
}

function hideSettingsModal() {
    settingsModal.style.display = 'none';
    settingsModal.classList.remove('show');
}

// Form Handling
function handleAddGoal(e) {
    e.preventDefault();
    const title = document.getElementById('goal-title').value.trim();
    const description = document.getElementById('goal-description').value.trim();
    const numberOfBars = parseInt(document.getElementById('bars-count').textContent);
    const steps = getStepsFromForm();
    
    if (!title) {
        alert('Будь ласка, введіть назву цілі');
        return;
    }
    
    addGoal(title, description, numberOfBars, steps);
    hideAddGoalModal();
}

function handleEditGoal(e) {
    e.preventDefault();
    const goalId = document.getElementById('edit-goal-form').dataset.goalId;
    const title = document.getElementById('edit-goal-title').value.trim();
    const description = document.getElementById('edit-goal-description').value.trim();
    const numberOfBars = parseInt(document.getElementById('edit-bars-count').textContent);
    const steps = getEditStepsFromForm();
    
    if (!title) {
        alert('Будь ласка, введіть назву цілі');
        return;
    }
    
    updateGoal(goalId, title, description, numberOfBars, steps);
    hideEditGoalModal();
}

function decreaseBars() {
    const barsCount = document.getElementById('bars-count');
    const currentCount = parseInt(barsCount.textContent);
    if (currentCount > 1) {
        barsCount.textContent = currentCount - 1;
        updateStepsContainer();
    }
}

function increaseBars() {
    const barsCount = document.getElementById('bars-count');
    const currentCount = parseInt(barsCount.textContent);
    if (currentCount < 20) {
        barsCount.textContent = currentCount + 1;
        updateStepsContainer();
    }
}

function updateStepsContainer() {
    const container = document.getElementById('steps-container');
    const barsCount = parseInt(document.getElementById('bars-count').textContent);
    const currentSteps = getStepsFromForm();
    
    container.innerHTML = '';
    
    for (let i = 0; i < barsCount; i++) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';
        stepDiv.innerHTML = `
            <input type="text" 
                   placeholder="Введіть опис кроку ${i + 1}" 
                   value="${currentSteps[i] || ''}"
                   maxlength="100">
        `;
        container.appendChild(stepDiv);
    }
}

// Progress Bars Rendering
function renderProgressBars(goal) {
    const progressBarsGrid = document.getElementById('progress-bars-grid');
    progressBarsGrid.innerHTML = '';
    
    const totalBars = goal.progressBars.length;
    const centerIndex = Math.floor(totalBars / 2);
    
    goal.progressBars.forEach((bar, index) => {
        const barElement = document.createElement('div');
        barElement.className = 'progress-bar-item';
        
        // Опис кроку тільки для зелених смужок (після білої)
        let stepDescription = '';
        let showInfoIcon = false;
        
        if (index > centerIndex && goal.steps && goal.steps[index - centerIndex - 1] && goal.steps[index - centerIndex - 1].trim()) {
            stepDescription = goal.steps[index - centerIndex - 1].trim();
            showInfoIcon = true;
        }
        
        barElement.innerHTML = `
            ${showInfoIcon ? `
                <div class="progress-bar-info-icon" title="${stepDescription}">
                    <i class="fas fa-info"></i>
                </div>
                <div class="progress-bar-info">${stepDescription}</div>
            ` : ''}
            <div class="progress-bar-visual ${bar.status}" onclick="toggleProgressBar('${goal.id}', ${index})">
                <div class="progress-bar-number">${index + 1}</div>
            </div>
        `;
        
        // Add click event for info icon only if it exists
        if (showInfoIcon) {
            const infoIcon = barElement.querySelector('.progress-bar-info-icon');
            const infoTooltip = barElement.querySelector('.progress-bar-info');
            
            if (infoIcon && infoTooltip) {
                infoIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    infoTooltip.classList.toggle('show');
                });
                
                // Hide tooltip when clicking outside
                document.addEventListener('click', (e) => {
                    if (!barElement.contains(e.target)) {
                        infoTooltip.classList.remove('show');
                    }
                });
            }
        }
        
        progressBarsGrid.appendChild(barElement);
    });
}

function toggleProgressBar(goalId, barIndex) {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const bar = goal.progressBars[barIndex];
    const totalBars = goal.progressBars.length;
    const centerIndex = Math.floor(totalBars / 2);
    
    // Determine bar position relative to center
    if (barIndex === centerIndex) {
        // Center bar - cycle through: neutral -> center -> neutral
        if (bar.status === 'neutral') {
            bar.status = 'center';
        } else {
            bar.status = 'neutral';
        }
    } else if (barIndex < centerIndex) {
        // Left side - cycle through: neutral -> left -> neutral
        if (bar.status === 'neutral') {
            bar.status = 'left';
        } else {
            bar.status = 'neutral';
        }
    } else {
        // Right side - cycle through: neutral -> right -> neutral
        if (bar.status === 'neutral') {
            bar.status = 'right';
        } else {
            bar.status = 'neutral';
        }
    }
    
    goal.updatedAt = new Date().toISOString();
    saveGoals();
    renderGoals();
    
    // Update detail modal if open
    if (goalDetailModal.style.display === 'block') {
        const progress = calculateProgress(goal.progressBars);
        let progressClass = 'neutral';
        if (progress > 0) progressClass = 'positive';
        if (progress < 0) progressClass = 'negative';
        const progressSpan = document.getElementById('progress-percentage');
        progressSpan.textContent = `${progress}%`;
        progressSpan.className = `goal-progress ${progressClass}`;
        document.getElementById('progress-fill').style.width = `${Math.abs(progress)}%`;
        document.getElementById('progress-fill').className = `progress-fill ${progress < 0 ? 'negative' : ''}`;
        
        // Update the specific bar color immediately
        const barElements = document.querySelectorAll('.progress-bar-item');
        if (barElements[barIndex]) {
            const barVisual = barElements[barIndex].querySelector('.progress-bar-visual');
            if (barVisual) {
                barVisual.className = `progress-bar-visual ${bar.status}`;
            }
        }
        
        // Update archive button visibility
        const archiveGoalBtn = document.getElementById('archive-goal-btn');
        if (progress >= 100) {
            archiveGoalBtn.style.display = 'block';
        } else {
            archiveGoalBtn.style.display = 'none';
        }
    }
}

// Notification Management
function toggleNotifications() {
    notificationsEnabled = document.getElementById('notifications-toggle').checked;
    localStorage.setItem('notificationsEnabled', notificationsEnabled);
    if (notificationsEnabled) {
        requestNotificationPermission();
    }
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        });
    }
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
    }
}

// Simulate notifications (for demo purposes)
function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: body });
    } else {
        // Fallback to alert for demo
        alert(`${title}\n${body}`);
    }
}

// Demo notifications (for testing)
setInterval(() => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    if (notificationsEnabled) {
        if (currentTime === notification1Time && notification1Enabled) {
            showNotification(
                translations[currentLanguage]['Reminder 1'] || 'Reminder 1',
                translations[currentLanguage]['Time to check your goals progress!'] || 'Time to check your goals progress!'
            );
        }
        
        if (currentTime === notification2Time && notification2Enabled) {
            showNotification(
                translations[currentLanguage]['Reminder 2'] || 'Reminder 2',
                translations[currentLanguage]['Don\'t forget to update your goals!'] || 'Don\'t forget to update your goals!'
            );
        }
        
        if (currentTime === notification3Time && notification3Enabled) {
            showNotification(
                translations[currentLanguage]['Reminder 3'] || 'Reminder 3',
                translations[currentLanguage]['Evening goals review time!'] || 'Evening goals review time!'
            );
        }
    }
}, 60000); // Check every minute

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideAllModals();
    }
    
    if (e.key === '+' && addGoalModal.style.display !== 'block') {
        showAddGoalModal();
    }
});

// Steps Management
function getStepsFromForm() {
    const stepInputs = document.querySelectorAll('#steps-container input');
    return Array.from(stepInputs).map(input => input.value.trim()).filter(value => value !== '');
}

function getEditStepsFromForm() {
    const stepInputs = document.querySelectorAll('#edit-steps-container input');
    return Array.from(stepInputs).map(input => input.value.trim()).filter(value => value !== '');
}

function updateGoal(goalId, title, description, numberOfBars, steps) {
    const goalIndex = goals.findIndex(g => g.id === goalId);
    if (goalIndex === -1) return;
    
    const totalBars = numberOfBars * 2 + 1; // +1 for center white bar
    const centerIndex = Math.floor(totalBars / 2);
    
    const goal = goals[goalIndex];
    goal.title = title;
    goal.description = description;
    goal.originalBarCount = numberOfBars;
    goal.steps = steps;
    goal.updatedAt = new Date().toISOString();
    
    // Update progress bars if count changed
    if (goal.progressBars.length !== totalBars) {
        goal.progressBars = Array(totalBars).fill().map((_, index) => ({ 
            status: 'neutral',
            step: steps[index] || null
        }));
    } else {
        // Update steps for existing bars
        goal.progressBars.forEach((bar, index) => {
            bar.step = steps[index] || null;
        });
    }
    
    saveGoals();
    renderGoals();
    hideEditGoalModal();
}

// Archive and Edit Functions
function showArchiveModal() {
    archiveModal.style.display = 'block';
    archiveModal.classList.add('show');
    renderArchivedGoals();
}

function hideArchiveModal() {
    archiveModal.style.display = 'none';
    archiveModal.classList.remove('show');
}

function renderArchivedGoals() {
    const container = document.getElementById('archived-goals-list');
    const emptyState = document.getElementById('empty-archive');
    if (archivedGoals.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    container.style.display = 'block';
    emptyState.style.display = 'none';
    // Нові цілі зверху
    const sorted = [...archivedGoals].sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt));
    container.innerHTML = sorted.map(goal => {
        const totalBars = goal.progressBars.length;
        const centerIndex = Math.floor(totalBars / 2);
        
        // Знаходимо виконані кроки (зелені смужки після центру)
        const completedSteps = [];
        if (goal.steps && goal.progressBars) {
            goal.progressBars.forEach((bar, index) => {
                if (index > centerIndex && bar.status === 'right' && goal.steps[index - centerIndex - 1]) {
                    completedSteps.push(goal.steps[index - centerIndex - 1]);
                }
            });
        }
        
        return `
            <div class="goal-item archived">
                <div class="goal-header">
                    <h3 class="goal-title">${goal.title}</h3>
                    <div class="archived-actions">
                        <span class="goal-archived-date">Архівовано: ${goal.archivedAt ? new Date(goal.archivedAt).toLocaleDateString() : ''}</span>
                        <button class="btn btn-danger btn-sm" onclick="deleteArchivedGoal('${goal.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${goal.description ? `<p class="goal-description">${goal.description}</p>` : ''}
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: 100%; background-color: #00ff88;"></div>
                </div>
                ${completedSteps.length > 0 ? `
                    <div class="completed-steps">
                        <h4>Виконані кроки:</h4>
                        <ul>
                            ${completedSteps.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function showEditGoalModal(goalId) {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    document.getElementById('edit-goal-title').value = goal.title;
    document.getElementById('edit-goal-description').value = goal.description || '';
    document.getElementById('edit-bars-count').textContent = goal.originalBarCount;
    document.getElementById('edit-goal-form').dataset.goalId = goalId;
    
    // Populate steps
    updateEditStepsContainer();
    const stepInputs = document.querySelectorAll('#edit-steps-container input');
    if (goal.steps) {
        goal.steps.forEach((step, index) => {
            if (stepInputs[index]) {
                stepInputs[index].value = step;
            }
        });
    }
    
    editGoalModal.style.display = 'block';
    editGoalModal.classList.add('show');
}

function hideEditGoalModal() {
    editGoalModal.style.display = 'none';
    editGoalModal.classList.remove('show');
    document.getElementById('edit-goal-form').reset();
    document.getElementById('edit-bars-count').textContent = '5';
    document.getElementById('edit-steps-container').innerHTML = '';
}

function updateEditStepsContainer() {
    const container = document.getElementById('edit-steps-container');
    const barsCount = parseInt(document.getElementById('edit-bars-count').textContent);
    const goalId = document.getElementById('edit-goal-form').dataset.goalId;
    const goal = goals.find(g => g.id === goalId);
    
    container.innerHTML = '';
    
    for (let i = 0; i < barsCount; i++) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';
        const stepValue = goal && goal.steps && goal.steps[i] ? goal.steps[i] : '';
        stepDiv.innerHTML = `
            <input type="text" 
                   placeholder="Введіть опис кроку ${i + 1}" 
                   value="${stepValue}"
                   maxlength="100">
        `;
        container.appendChild(stepDiv);
    }
}

function deleteArchivedGoal(goalId) {
    archivedGoals = archivedGoals.filter(goal => goal.id !== goalId);
    saveArchivedGoals();
    renderArchivedGoals();
}

// Time inputs
function updateNotificationTime1() {
    notification1Time = document.getElementById('time-1').value;
    localStorage.setItem('notification1Time', notification1Time);
}

function updateNotificationTime2() {
    notification2Time = document.getElementById('time-2').value;
    localStorage.setItem('notification2Time', notification2Time);
}

function updateNotificationTime3() {
    notification3Time = document.getElementById('time-3').value;
    localStorage.setItem('notification3Time', notification3Time);
}

function editDecreaseBars() {
    const currentCount = parseInt(document.getElementById('edit-bars-count').textContent);
    if (currentCount > 1) {
        document.getElementById('edit-bars-count').textContent = currentCount - 1;
        updateEditStepsContainer();
    }
}

function editIncreaseBars() {
    const currentCount = parseInt(document.getElementById('edit-bars-count').textContent);
    if (currentCount < 20) {
        document.getElementById('edit-bars-count').textContent = currentCount + 1;
        updateEditStepsContainer();
    }
}

function centerScrollPosition(container, centerIndex) {
    const barWidth = 60; // Width of each bar
    const containerWidth = container.clientWidth;
    const scrollPosition = (centerIndex * barWidth) - (containerWidth / 2) + (barWidth / 2);
    container.scrollLeft = Math.max(0, scrollPosition);
}

function updateScrollIndicators(container) {
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    const leftIndicator = container.querySelector('.scroll-left');
    const rightIndicator = container.querySelector('.scroll-right');
    
    if (leftIndicator) {
        leftIndicator.style.display = scrollLeft > 0 ? 'block' : 'none';
    }
    
    if (rightIndicator) {
        rightIndicator.style.display = scrollLeft < scrollWidth - clientWidth - 1 ? 'block' : 'none';
    }
}

// Offline functionality
function handleOnlineStatus() {
    isOnline = navigator.onLine;
    updateOfflineIndicator();
    
    if (isOnline) {
        // Sync offline data when coming back online
        syncOfflineData();
    }
}

function updateOfflineIndicator() {
    const offlineIndicator = document.getElementById('offline-indicator');
    if (offlineIndicator) {
        if (isOnline) {
            offlineIndicator.style.display = 'none';
        } else {
            offlineIndicator.style.display = 'block';
        }
    }
}

function syncOfflineData() {
    if (offlineData.length > 0) {
        // Process any offline changes
        offlineData.forEach(change => {
            // Apply offline changes
            console.log('Syncing offline change:', change);
        });
        offlineData = [];
        localStorage.setItem('offlineData', JSON.stringify(offlineData));
    }
}

// Enhanced data persistence
function saveAppData() {
    const appData = {
        goals: goals,
        archivedGoals: archivedGoals,
        tasks: tasks,
        settings: {
            language: currentLanguage,
            notificationsEnabled: notificationsEnabled,
            notification1Enabled: notification1Enabled,
            notification2Enabled: notification2Enabled,
            notification3Enabled: notification3Enabled,
            notification1Time: notification1Time,
            notification2Time: notification2Time,
            notification3Time: notification3Time
        },
        timestamp: Date.now()
    };
    
    // Save to localStorage
    localStorage.setItem('appData', JSON.stringify(appData));
    
    // Save to IndexedDB for backup
    saveToIndexedDB('appData', appData);
    
    // Note: saveToFile is only called manually via export button
}

function loadAppData() {
    // Try to load from IndexedDB first
    loadFromIndexedDB('appData').then(data => {
        if (data) {
            goals = data.goals || [];
            archivedGoals = data.archivedGoals || [];
            tasks = data.tasks || [];
            currentLanguage = data.settings?.language || 'uk';
            notificationsEnabled = data.settings?.notificationsEnabled || false;
            notification1Enabled = data.settings?.notification1Enabled || false;
            notification2Enabled = data.settings?.notification2Enabled || false;
            notification3Enabled = data.settings?.notification3Enabled || false;
            notification1Time = data.settings?.notification1Time || '09:00';
            notification2Time = data.settings?.notification2Time || '14:00';
            notification3Time = data.settings?.notification3Time || '19:00';
        }
    });
}

// File system access (for advanced users)
async function saveToFile(data) {
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: 'goals-backup.json',
            types: [{
                description: 'JSON File',
                accept: { 'application/json': ['.json'] },
            }],
        });
        
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
        
        console.log('Data saved to file');
    } catch (error) {
        console.log('File save cancelled or failed');
    }
}

async function loadFromFile() {
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: 'JSON File',
                accept: { 'application/json': ['.json'] },
            }],
        });
        
        const file = await fileHandle.getFile();
        const contents = await file.text();
        const data = JSON.parse(contents);
        
        // Apply loaded data
        goals = data.goals || goals;
        archivedGoals = data.archivedGoals || archivedGoals;
        tasks = data.tasks || tasks;
        currentLanguage = data.settings?.language || currentLanguage;
        
        saveAppData();
        renderGoals();
        renderArchivedGoals();
        updateUI();
        
        console.log('Data loaded from file');
    } catch (error) {
        console.log('File load cancelled or failed');
    }
}

// Backup actions
function exportAppData() {
    const appData = {
        goals: goals,
        archivedGoals: archivedGoals,
        tasks: tasks,
        settings: {
            language: currentLanguage,
            notificationsEnabled: notificationsEnabled,
            notification1Enabled: notification1Enabled,
            notification2Enabled: notification2Enabled,
            notification3Enabled: notification3Enabled,
            notification1Time: notification1Time,
            notification2Time: notification2Time,
            notification3Time: notification3Time
        },
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
    
    // Create download link
    const dataStr = JSON.stringify(appData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `goals-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('Експорт завершено', 'Дані збережено у файл');
}

function importAppData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (data.goals && data.archivedGoals && data.tasks && data.settings) {
                        goals = data.goals || [];
                        archivedGoals = data.archivedGoals || [];
                        tasks = data.tasks || [];
                        currentLanguage = data.settings.language || 'uk';
                        notificationsEnabled = data.settings.notificationsEnabled || false;
                        notification1Enabled = data.settings.notification1Enabled || false;
                        notification2Enabled = data.settings.notification2Enabled || false;
                        notification3Enabled = data.settings.notification3Enabled || false;
                        notification1Time = data.settings.notification1Time || '09:00';
                        notification2Time = data.settings.notification2Time || '14:00';
                        notification3Time = data.settings.notification3Time || '19:00';
                        
                        saveAppData();
                        renderGoals();
                        renderArchivedGoals();
                        updateUI();
                        initializeApp();
                        
                        showNotification('Імпорт завершено', 'Дані успішно завантажено');
                    } else {
                        showNotification('Помилка імпорту', 'Неправильний формат файлу');
                    }
                } catch (error) {
                    showNotification('Помилка імпорту', 'Не вдалося прочитати файл');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function clearAllData() {
    if (confirm('Ви впевнені, що хочете видалити всі дані? Це дію неможливо скасувати.')) {
        goals = [];
        archivedGoals = [];
        tasks = [];
        currentLanguage = 'uk';
        notificationsEnabled = false;
        notification1Enabled = false;
        notification2Enabled = false;
        notification3Enabled = false;
        notification1Time = '09:00';
        notification2Time = '14:00';
        notification3Time = '19:00';
        
        // Clear all storage
        localStorage.clear();
        
        // Clear IndexedDB
        if ('indexedDB' in window) {
            const request = indexedDB.deleteDatabase('GoalsTrackerDB');
        }
        
        renderGoals();
        renderArchivedGoals();
        renderTasks();
        updateUI();
        initializeApp();
        
        showNotification('Дані очищено', 'Всі дані були видалені');
    }
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    const goalsList = document.getElementById('goals-list');
    const tasksList = document.getElementById('tasks-list');
    const emptyState = document.getElementById('empty-state');
    if (tab === 'goals') {
        goalsList.style.display = 'block';
        tasksList.style.display = 'none';
        renderGoals();
        updateEmptyState();
    } else if (tab === 'tasks') {
        goalsList.style.display = 'none';
        tasksList.style.display = 'block';
        renderTasks();
        setupTaskButtons();
        updateEmptyState();
    }
}

function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    if (!tasksList) return;
    if (currentTab === 'tasks') {
        tasksList.style.display = 'block';
        if (!selectedDate) {
            selectedDate = new Date();
        }
        updateCurrentDayInfo();
        renderWeekCalendar();
        renderDayTasks(selectedDate);
        updateDayTasksTitle(selectedDate);
    } else {
        tasksList.style.display = 'none';
    }
}

function renderWeekCalendar() {
    const weekDaysContainer = document.getElementById('week-days');
    if (!weekDaysContainer) return;
    const baseDate = selectedDate ? new Date(selectedDate) : new Date();
    const dayOfWeek = baseDate.getDay();
    const sundayOfWeek = new Date(baseDate);
    sundayOfWeek.setDate(baseDate.getDate() - dayOfWeek);
    const startDate = new Date(sundayOfWeek);
    const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const monthNames = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];
    weekDaysContainer.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dayElement = document.createElement('div');
        dayElement.className = 'week-day';
        dayElement.dataset.date = formatDate(date);
        const dateStr = formatDate(date);
        const dayTasks = tasks.filter(task => task.date === dateStr);
        if (dayTasks.length > 0) {
            dayElement.classList.add('has-tasks');
        }
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }
        const completedTasks = tasks.filter(task => {
            // Виправлено: порівнюємо дати як рядки у форматі YYYY-MM-DD
            return task.date === formatDate(date) && task.completed;
        });
        if (completedTasks.length > 0) {
            dayElement.classList.add('has-completed-tasks');
        }
        dayElement.innerHTML = `
            <div class="week-day-name">${dayNames[date.getDay()]}</div>
            <div class="week-day-number">${date.getDate()}</div>
            <div class="week-day-month">${monthNames[date.getMonth()]}</div>
        `;
        dayElement.addEventListener('click', () => {
            selectedDate = date;
            updateCurrentDayInfo();
            renderDayTasks(date);
            updateDayTasksTitle(date);
            renderWeekCalendar();
            document.getElementById('monthly-calendar-modal').classList.remove('show');
        });
        weekDaysContainer.appendChild(dayElement);
    }
    if (selectedDate) {
        updateDayTasksTitle(selectedDate);
    }
}

function renderDayTasks(date) {
    const dayTasksContainer = document.getElementById('day-tasks-list');
    if (!dayTasksContainer) return;
    if (!date) return;
    const dateStr = formatDate(date);
    const dayTasks = tasks.filter(task => task.date === dateStr);
    if (dayTasks.length === 0) {
        dayTasksContainer.innerHTML = '<p class="empty-state">Немає завдань на цей день</p>';
        return;
    }
    dayTasksContainer.innerHTML = dayTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-complete ${task.completed ? 'checked' : ''}" onclick="toggleTaskComplete('${task.id}')"></div>
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-time">${task.time}</div>
            </div>
            <div class="task-description">${task.description}</div>
            <div class="task-actions">
                <button class="btn btn-secondary" onclick="editTask('${task.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteTask('${task.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateDayTasksTitle(date) {
    const dayTasksTitle = document.getElementById('day-tasks-title');
    if (!dayTasksTitle) return;
    if (!date) return;
    const dayNames = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const monthNames = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let title = '';
    if (date.toDateString() === today.toDateString()) {
        title = 'Завдання на сьогодні';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        title = 'Завдання на завтра';
    } else {
        title = `Завдання на ${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]}`;
    }
    dayTasksTitle.textContent = title;
}

function showAddTaskModal() {
    const modal = document.getElementById('add-task-modal');
    if (modal) {
        modal.classList.add('show');
        const taskDateInput = document.getElementById('task-date');
        if (taskDateInput && selectedDate) {
            taskDateInput.value = formatDate(selectedDate);
        }
        const titleInput = document.getElementById('task-title');
        if (titleInput) {
            titleInput.focus();
        }
        // Повертаємо текст кнопки на "Додати"
        let submitBtn = modal.querySelector('.btn.btn-primary');
        if (submitBtn) submitBtn.textContent = 'Додати';
        // Повертаємо заголовок
        let modalTitle = modal.querySelector('.modal-header h2');
        if (modalTitle) modalTitle.textContent = 'Додати завдання';
    }
}

function hideAddTaskModal() {
    const modal = document.getElementById('add-task-modal');
    if (modal) {
        modal.classList.remove('show');
        // Сброс editTaskId при любом закрытии модалки
        delete modal.dataset.editTaskId;
    }
}

function handleAddTask(e) {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-description').value.trim();
    const time = document.getElementById('task-time').value;
    const notifications = [];
    const notif1 = document.getElementById('notification-1');
    const notif1Time = document.getElementById('notification-time-1');
    if (notif1 && notif1.checked && notif1Time) {
        notifications.push(Number(notif1Time.value));
    }
    const notif2 = document.getElementById('notification-2');
    const notif2Time = document.getElementById('notification-time-2');
    if (notif2 && notif2.checked && notif2Time) {
        notifications.push(Number(notif2Time.value));
    }
    if (!title) {
        alert('Будь ласка, введіть назву завдання');
        return;
    }
    const modal = document.getElementById('add-task-modal');
    const editId = modal ? modal.dataset.editTaskId : null;
    console.log('handleAddTask: editId =', editId);
    if (editId) {
        // Найдём исходную дату задачи
        const oldTask = tasks.find(t => t.id === editId);
        const oldDate = oldTask ? oldTask.date : formatDate(selectedDate);
        updateTask(editId, title, description, time, notifications, oldDate);
        delete modal.dataset.editTaskId;
    } else {
        addTask(title, description, time, notifications);
    }
    hideAddTaskModal();
    renderTasks();
}

function showMonthlyCalendar() {
    const modal = document.getElementById('monthly-calendar-modal');
    if (modal) {
        modal.classList.add('show');
        renderMonthlyCalendar();
    }
}

function hideMonthlyCalendar() {
    const modal = document.getElementById('monthly-calendar-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderMonthlyCalendar();
}

function renderMonthlyCalendar() {
    const grid = document.getElementById('monthly-calendar-grid');
    // const title = document.getElementById('monthly-calendar-title'); // Удалено, такого элемента нет
    const currentMonthYear = document.getElementById('current-month-year');
    
    const monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 
                       'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
    const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    // if (title) title.textContent = `${monthNames[currentMonth]} ${currentYear}`; // Удалено
    if (currentMonthYear) currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    grid.innerHTML = '';
    
    // Add day headers
    dayNames.forEach(dayName => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day header';
        dayHeader.textContent = dayName;
        dayHeader.style.fontWeight = '600';
        dayHeader.style.backgroundColor = '#f8f9fa';
        grid.appendChild(dayHeader);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        grid.appendChild(emptyDay);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = formatDate(date);
        const dayTasks = tasks.filter(task => task.date === dateStr);
        const completedTasks = dayTasks.filter(task => task.completed);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        if (formatDate(date) === formatDate(selectedDate)) {
            dayElement.classList.add('selected');
        }
        if (dayTasks.length > 0) {
            dayElement.classList.add('has-tasks');
        }
        if (completedTasks.length > 0) {
            dayElement.classList.add('has-completed-tasks');
        }
        dayElement.innerHTML = `<div class="calendar-day-number">${day}</div>`;
        dayElement.addEventListener('click', () => {
            selectedDate = date;
            updateCurrentDayInfo();
            renderDayTasks(date);
            updateDayTasksTitle(date);
            renderWeekCalendar();
            document.getElementById('monthly-calendar-modal').classList.remove('show');
        });
        grid.appendChild(dayElement);
    }
    
    // Add empty cells for days after month ends
    const totalCells = 42; // 6 rows * 7 days
    const filledCells = startDay + daysInMonth;
    for (let i = filledCells; i < totalCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        grid.appendChild(emptyDay);
    }
}

function updateCurrentDayInfo() {
    const dayNames = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const monthNames = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    const currentDayName = document.getElementById('current-day-name');
    const currentDayDate = document.getElementById('current-day-date');
    const currentDayMonth = document.getElementById('current-day-month');
    if (currentDayName && selectedDate) {
        currentDayName.textContent = dayNames[selectedDate.getDay()];
    }
    if (currentDayDate && selectedDate) {
        currentDayDate.textContent = selectedDate.getDate();
    }
    if (currentDayMonth && selectedDate) {
        currentDayMonth.textContent = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    }
}

function updateEmptyState() {
    const emptyState = document.getElementById('empty-state');
    const goalsList = document.getElementById('goals-list');
    const tasksList = document.getElementById('tasks-list');
    
    if (currentTab === 'goals') {
        if (goals.length === 0) {
            goalsList.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <i class="fas fa-bullseye empty-icon"></i>
                <h2>Поки що немає цілей</h2>
                <p>Натисніть кнопку + щоб додати першу ціль</p>
            `;
        } else {
            goalsList.style.display = 'block';
            emptyState.style.display = 'none';
        }
    } else if (currentTab === 'tasks') {
        if (tasks.length === 0) {
            tasksList.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <i class="fas fa-tasks empty-icon"></i>
                <h2>Поки що немає завдань</h2>
                <p>Натисніть кнопку + щоб додати перше завдання</p>
            `;
        } else {
            tasksList.style.display = 'block';
            emptyState.style.display = 'none';
        }
    }
}

function setupTaskButtons() {
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
        const newAddTaskBtn = addTaskBtn.cloneNode(true);
        addTaskBtn.parentNode.replaceChild(newAddTaskBtn, addTaskBtn);
        newAddTaskBtn.addEventListener('click', showAddTaskModal);
    }
    const calendarViewBtn = document.getElementById('calendar-view-btn');
    if (calendarViewBtn) {
        const newCalendarViewBtn = calendarViewBtn.cloneNode(true);
        calendarViewBtn.parentNode.replaceChild(newCalendarViewBtn, calendarViewBtn);
        newCalendarViewBtn.addEventListener('click', showMonthlyCalendar);
    }
    const todayBtn = document.getElementById('today-btn');
    if (todayBtn) {
        const newTodayBtn = todayBtn.cloneNode(true);
        todayBtn.parentNode.replaceChild(newTodayBtn, todayBtn);
        newTodayBtn.addEventListener('click', () => {
            selectedDate = new Date();
            weekOffset = 0;
            updateCurrentDayInfo();
            renderWeekCalendar();
            renderDayTasks(selectedDate);
            updateDayTasksTitle(selectedDate);
        });
    }
    const closeTaskModal = document.getElementById('close-task-modal');
    if (closeTaskModal) {
        const newCloseTaskModal = closeTaskModal.cloneNode(true);
        closeTaskModal.parentNode.replaceChild(newCloseTaskModal, closeTaskModal);
        newCloseTaskModal.addEventListener('click', hideAddTaskModal);
    }
    const cancelTask = document.getElementById('cancel-task');
    if (cancelTask) {
        const newCancelTask = cancelTask.cloneNode(true);
        cancelTask.parentNode.replaceChild(newCancelTask, cancelTask);
        newCancelTask.addEventListener('click', hideAddTaskModal);
    }
    const closeMonthlyCalendar = document.getElementById('close-monthly-calendar');
    const prevMonth = document.getElementById('prev-month');
    const nextMonth = document.getElementById('next-month');
    if (closeMonthlyCalendar) {
        const newCloseMonthlyCalendar = closeMonthlyCalendar.cloneNode(true);
        closeMonthlyCalendar.parentNode.replaceChild(newCloseMonthlyCalendar, closeMonthlyCalendar);
        newCloseMonthlyCalendar.addEventListener('click', hideMonthlyCalendar);
    }
    if (prevMonth) {
        const newPrevMonth = prevMonth.cloneNode(true);
        prevMonth.parentNode.replaceChild(newPrevMonth, prevMonth);
        newPrevMonth.addEventListener('click', () => changeMonth(-1));
    }
    if (nextMonth) {
        const newNextMonth = nextMonth.cloneNode(true);
        nextMonth.parentNode.replaceChild(newNextMonth, nextMonth);
        newNextMonth.addEventListener('click', () => changeMonth(1));
    }
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    if (prevWeekBtn) {
        const newPrevWeekBtn = prevWeekBtn.cloneNode(true);
        prevWeekBtn.parentNode.replaceChild(newPrevWeekBtn, prevWeekBtn);
        newPrevWeekBtn.addEventListener('click', goToPreviousWeek);
    }
    if (nextWeekBtn) {
        const newNextWeekBtn = nextWeekBtn.cloneNode(true);
        nextWeekBtn.parentNode.replaceChild(newNextWeekBtn, nextWeekBtn);
        newNextWeekBtn.addEventListener('click', goToNextWeek);
    }
}

function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        showEditTaskModal(task);
    }
}

function showEditTaskModal(task) {
    const modal = document.getElementById('add-task-modal');
    if (modal) {
        modal.classList.add('show');
        modal.dataset.editTaskId = task.id;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-time').value = task.time;
        for (let i = 1; i <= 3; i++) {
            document.getElementById(`notification-${i}`).checked = false;
        }
        if (task.notifications) {
            task.notifications.forEach((notif, idx) => {
                if (document.getElementById(`notification-${idx+1}`)) {
                    document.getElementById(`notification-${idx+1}`).checked = true;
                    document.getElementById(`notification-time-${idx+1}`).value = notif.time;
                }
            });
        }
        // Змінюємо текст кнопки на "Зберегти"
        const submitBtn = modal.querySelector('.btn.btn-primary');
        if (submitBtn) submitBtn.textContent = 'Зберегти';
        // Змінюємо заголовок
        const modalTitle = modal.querySelector('.modal-header h2');
        if (modalTitle) modalTitle.textContent = 'Редагувати завдання';
    }
}

function goToPreviousWeek() {
    weekOffset--;
    renderWeekCalendar();
    renderDayTasks(selectedDate);
    updateDayTasksTitle(selectedDate);
}

function goToNextWeek() {
    weekOffset++;
    renderWeekCalendar();
    renderDayTasks(selectedDate);
    updateDayTasksTitle(selectedDate);
}

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// --- КОНЕЦ: Функции для вкладки 'Мої завдання' из web-app 2 ---

function updateTask(taskId, title, description, time, notifications = [], dateOverride = null) {
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
        tasks[idx] = {
            ...tasks[idx],
            title: title,
            description: description,
            time: time,
            notifications: notifications,
            date: dateOverride || tasks[idx].date,
            updatedAt: new Date().toISOString()
        };
        saveTasks();
        renderTasks();
        scheduleTaskNotification(tasks[idx]);
    }
}

// --- Swipe for week calendar ---
(function setupSwipeForWeek() {
    const weekDays = document.getElementById('week-days');
    if (!weekDays) return;
    let touchStartX = null;
    let touchEndX = null;
    weekDays.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    weekDays.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    // Для десктопів — підтримка drag/swipe мишкою
    let mouseDown = false;
    let mouseStartX = null;
    weekDays.addEventListener('mousedown', (e) => {
        mouseDown = true;
        mouseStartX = e.screenX;
    });
    weekDays.addEventListener('mouseup', (e) => {
        if (!mouseDown) return;
        mouseDown = false;
        touchStartX = mouseStartX;
        touchEndX = e.screenX;
        handleSwipe();
    });
    function handleSwipe() {
        if (touchStartX === null || touchEndX === null) return;
        const dx = touchEndX - touchStartX;
        if (Math.abs(dx) < 50) return; // мінімальна відстань свайпу
        // Обмеження: не більше 2 тижнів вперед/назад від поточного тижня
        const today = new Date();
        const baseSunday = new Date(today);
        baseSunday.setDate(today.getDate() - today.getDay());
        let newDate = selectedDate ? new Date(selectedDate) : new Date();
        if (dx < 0) { // свайп вліво — вперед
            newDate.setDate(newDate.getDate() + 7);
        } else { // свайп вправо — назад
            newDate.setDate(newDate.getDate() - 7);
        }
        // Перевірка меж (±3 тижні від поточного)
        const diffWeeks = Math.round((newDate - baseSunday) / (7 * 24 * 60 * 60 * 1000));
        if (diffWeeks < -3 || diffWeeks > 3) return;
        selectedDate = newDate;
        updateCurrentDayInfo();
        renderDayTasks(selectedDate);
        updateDayTasksTitle(selectedDate);
        renderWeekCalendar();
    }
})();

// --- Синхронізація сповіщень із завданнями ---
function scheduleTaskNotification(task) {
    if (!notificationsEnabled) return;
    if (!task.time || !task.notifications || !task.notifications.length) return;
    // Для кожного нагадування (наприклад, [5, 15])
    task.notifications.forEach(minutesBefore => {
        const taskDateTime = new Date(task.date + 'T' + task.time);
        const notifyTime = new Date(taskDateTime.getTime() - minutesBefore * 60000);
        const now = new Date();
        const timeout = notifyTime.getTime() - now.getTime();
        if (timeout > 0) {
            setTimeout(() => {
                showNotification('Нагадування', `Завдання: ${task.title} через ${minutesBefore} хвилин`);
            }, timeout);
        }
    });
}

// Генерація унікального id для завдань
function generateId() {
    return 'task-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
}

window.addEventListener('DOMContentLoaded', () => {
    renderWeekCalendar();
    if (typeof setupSwipeForWeek === 'function') {
        setupSwipeForWeek();
    }
});
