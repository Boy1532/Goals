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
let notification1Enabled = localStorage.getItem('notification1Enabled') === 'true';
let notification2Enabled = localStorage.getItem('notification2Enabled') === 'true';
let notification3Enabled = localStorage.getItem('notification3Enabled') === 'true';
let notification1Time = localStorage.getItem('notification1Time') || '09:00';
let notification2Time = localStorage.getItem('notification2Time') || '14:00';
let notification3Time = localStorage.getItem('notification3Time') || '19:00';

// Calendar state
let calendarViewMonth = new Date().getMonth();
let calendarViewYear = new Date().getFullYear();
let selectedCalendarDate = new Date();

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

// Додаю змінну для тижневої навігації
let weekOffset = 0;
let isFullWeekView = false;

// Додаю змінні для свайпу
let touchStartX = 0;
let touchEndX = 0;

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
    
    // Initialize today button
    const todayBtn = document.getElementById('today-btn');
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            selectedDate = new Date();
            weekOffset = 0; // Reset week offset to current week
            updateCurrentDayInfo();
            renderWeekCalendar();
            renderDayTasks(selectedDate);
            updateDayTasksTitle(selectedDate);
        });
    }
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
    
    // Check if all required elements exist
    const requiredElements = {
        appTitle,
        goalsList,
        emptyState,
        addGoalBtn,
        settingsBtn,
        addGoalModal,
        goalDetailModal,
        settingsModal,
        archiveModal,
        editGoalModal
    };
    
    const missingElements = Object.entries(requiredElements)
        .filter(([name, element]) => !element)
        .map(([name]) => name);
    
    if (missingElements.length > 0) {
        console.error('Missing DOM elements:', missingElements);
    }
    
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
    
    const notification1 = document.getElementById('notification1');
    if (notification1) {
        notification1.checked = notification1Enabled;
    }
    
    const notification2 = document.getElementById('notification2');
    if (notification2) {
        notification2.checked = notification2Enabled;
    }
    
    const notification3 = document.getElementById('notification3');
    if (notification3) {
        notification3.checked = notification3Enabled;
    }
    
    const time1 = document.getElementById('time-1');
    if (time1) {
        time1.value = notification1Time;
    }
    
    const time2 = document.getElementById('time-2');
    if (time2) {
        time2.value = notification2Time;
    }
    
    const time3 = document.getElementById('time-3');
    if (time3) {
        time3.value = notification3Time;
    }
    
    // Initialize steps container
    updateStepsContainer();
    
    // Render initial content
    renderGoals();
    renderArchivedGoals();
    renderTasks();
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
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', showAddGoalModal);
    }
    
    // Settings button
    if (settingsBtn) {
        settingsBtn.addEventListener('click', showSettingsModal);
    }
    
    // Archive button
    const archiveBtn = document.getElementById('archive-btn');
    if (archiveBtn) {
        archiveBtn.addEventListener('click', showArchiveModal);
    }
    
    // Modal close buttons
    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', hideAddGoalModal);
    }
    
    const closeDetailModal = document.getElementById('close-detail-modal');
    if (closeDetailModal) {
        closeDetailModal.addEventListener('click', hideGoalDetailModal);
    }
    
    const closeSettingsModal = document.getElementById('close-settings-modal');
    if (closeSettingsModal) {
        closeSettingsModal.addEventListener('click', hideSettingsModal);
    }
    
    const closeArchiveModal = document.getElementById('close-archive-modal');
    if (closeArchiveModal) {
        closeArchiveModal.addEventListener('click', hideArchiveModal);
    }
    
    const closeEditModal = document.getElementById('close-edit-modal');
    if (closeEditModal) {
        closeEditModal.addEventListener('click', hideEditGoalModal);
    }
    
    // Form submissions
    const addGoalForm = document.getElementById('add-goal-form');
    if (addGoalForm) {
        addGoalForm.addEventListener('submit', handleAddGoal);
    }
    
    const editGoalForm = document.getElementById('edit-goal-form');
    if (editGoalForm) {
        editGoalForm.addEventListener('submit', handleEditGoal);
    }
    
    const addTaskForm = document.getElementById('add-task-form');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', handleAddTask);
    }
    
    // Cancel buttons
    const cancelAdd = document.getElementById('cancel-add');
    if (cancelAdd) {
        cancelAdd.addEventListener('click', hideAddGoalModal);
    }
    
    const cancelEdit = document.getElementById('cancel-edit');
    if (cancelEdit) {
        cancelEdit.addEventListener('click', hideEditGoalModal);
    }
    
    const cancelTask = document.getElementById('cancel-task');
    if (cancelTask) {
        cancelTask.addEventListener('click', hideAddTaskModal);
    }
    
    // Task modal close button
    const closeTaskModal = document.getElementById('close-task-modal');
    if (closeTaskModal) {
        closeTaskModal.addEventListener('click', hideAddTaskModal);
    }
    
    // Priority selection
    document.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // Stepper buttons for add goal
    const decreaseBars = document.getElementById('decrease-bars');
    if (decreaseBars) {
        decreaseBars.addEventListener('click', decreaseBars);
    }
    
    const increaseBars = document.getElementById('increase-bars');
    if (increaseBars) {
        increaseBars.addEventListener('click', increaseBars);
    }
    
    // Stepper buttons for edit goal
    const editDecreaseBars = document.getElementById('edit-decrease-bars');
    if (editDecreaseBars) {
        editDecreaseBars.addEventListener('click', editDecreaseBars);
    }
    
    const editIncreaseBars = document.getElementById('edit-increase-bars');
    if (editIncreaseBars) {
        editIncreaseBars.addEventListener('click', editIncreaseBars);
    }
    
    // Settings
    const notificationsToggle = document.getElementById('notifications-toggle');
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', toggleNotifications);
    }
    
    const notification1 = document.getElementById('notification1');
    if (notification1) {
        notification1.addEventListener('change', toggleNotification1);
    }
    
    const notification2 = document.getElementById('notification2');
    if (notification2) {
        notification2.addEventListener('change', toggleNotification2);
    }
    
    const notification3 = document.getElementById('notification3');
    if (notification3) {
        notification3.addEventListener('change', toggleNotification3);
    }
    
    const time1 = document.getElementById('time-1');
    if (time1) {
        time1.addEventListener('change', updateNotificationTime1);
    }
    
    const time2 = document.getElementById('time-2');
    if (time2) {
        time2.addEventListener('change', updateNotificationTime2);
    }
    
    const time3 = document.getElementById('time-3');
    if (time3) {
        time3.addEventListener('change', updateNotificationTime3);
    }
    
    // Language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            changeLanguage(lang);
        });
    });
    
    // Backup actions
    const exportData = document.getElementById('export-data');
    if (exportData) {
        exportData.addEventListener('click', exportAppData);
    }
    
    const importData = document.getElementById('import-data');
    if (importData) {
        importData.addEventListener('click', importAppData);
    }
    
    const clearData = document.getElementById('clear-data');
    if (clearData) {
        clearData.addEventListener('click', clearAllData);
    }
    
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
    if (addGoalModal) {
        addGoalModal.addEventListener('click', (e) => {
            if (e.target === addGoalModal) hideAddGoalModal();
        });
    }
    
    if (goalDetailModal) {
        goalDetailModal.addEventListener('click', (e) => {
            if (e.target === goalDetailModal) hideGoalDetailModal();
        });
    }
    
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) hideSettingsModal();
        });
    }
    
    if (archiveModal) {
        archiveModal.addEventListener('click', (e) => {
            if (e.target === archiveModal) hideArchiveModal();
        });
    }
    
    if (editGoalModal) {
        editGoalModal.addEventListener('click', (e) => {
            if (e.target === editGoalModal) hideEditGoalModal();
        });
    }
    
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
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', showAddTaskModal);
    }
    
    if (closeTaskModal) {
        closeTaskModal.addEventListener('click', hideAddTaskModal);
    }
    
    if (cancelTask) {
        cancelTask.addEventListener('click', hideAddTaskModal);
    }
    
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', handleAddTask);
    }
    
    // Calendar events
    const calendarViewBtn = document.getElementById('calendar-view-btn');
    const closeMonthlyCalendar = document.getElementById('close-monthly-calendar');
    const prevMonth = document.getElementById('prev-month');
    const nextMonth = document.getElementById('next-month');
    
    if (calendarViewBtn) {
        calendarViewBtn.addEventListener('click', showMonthlyCalendar);
    }
    
    if (closeMonthlyCalendar) {
        closeMonthlyCalendar.addEventListener('click', hideMonthlyCalendar);
    }
    
    if (prevMonth) {
        prevMonth.addEventListener('click', () => changeMonth(-1));
    }
    
    if (nextMonth) {
        nextMonth.addEventListener('click', () => changeMonth(1));
    }
    
    // Додаю навігацію тижнів
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    
    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', goToPreviousWeek);
    }
    
    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', goToNextWeek);
    }
    
    // Додаю кнопку "сьогодні"
    const todayBtn = document.getElementById('today-btn');
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            selectedDate = new Date();
            weekOffset = 0; // Reset week offset to current week
            updateCurrentDayInfo();
            renderWeekCalendar();
            renderDayTasks(selectedDate);
            updateDayTasksTitle(selectedDate);
        });
    }
}

function updateUI() {
    // Update app title based on current tab
    if (appTitle) {
        if (currentTab === 'goals') {
            appTitle.textContent = 'Way to Freedom';
            if (addGoalBtn) {
                addGoalBtn.onclick = showAddGoalModal;
            }
        } else if (currentTab === 'tasks') {
            appTitle.textContent = 'Way to Freedom';
            if (addGoalBtn) {
                addGoalBtn.onclick = showAddTaskModal;
            }
        }
    }
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === currentTab);
    });
    
    // Update content visibility
    const goalsList = document.getElementById('goals-list');
    const tasksList = document.getElementById('tasks-list');
    
    if (currentTab === 'goals') {
        if (goalsList) goalsList.style.display = 'block';
        if (tasksList) tasksList.style.display = 'none';
        renderGoals();
    } else if (currentTab === 'tasks') {
        if (goalsList) goalsList.style.display = 'none';
        if (tasksList) tasksList.style.display = 'block';
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
    // saveToIndexedDB('goals', goals);
}

function saveArchivedGoals() {
    localStorage.setItem('archivedGoals', JSON.stringify(archivedGoals));
    // saveToIndexedDB('archivedGoals', archivedGoals);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Backup to IndexedDB for larger storage
    // saveToIndexedDB('tasks', tasks);
}

function addTask(title, description, date, time, notifications = []) {
    const task = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: title,
        description: description,
        date: date,
        time: time,
        notifications: notifications,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    
    // Schedule notifications if enabled
    if (notificationsEnabled && notifications.length > 0) {
        scheduleTaskNotifications(task);
    }
    
    // Update UI
    if (currentTab === 'tasks') {
        renderWeekCalendar();
        if (selectedDate) {
            renderDayTasks(selectedDate);
            updateDayTasksTitle(selectedDate);
        }
    }
    
    console.log('Task added:', task);
    console.log('Total tasks:', tasks.length);
}

function scheduleTaskNotifications(task) {
    if (!task || !task.date || !task.time || !task.notifications || task.notifications.length === 0) {
        console.log('Invalid task data for notifications:', task);
        return;
    }
    
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    
    task.notifications.forEach(notification => {
        const notificationTime = new Date(taskDateTime);
        notificationTime.setMinutes(notificationTime.getMinutes() - notification.minutes);
        
        const timeUntilNotification = notificationTime.getTime() - Date.now();
        
        if (timeUntilNotification > 0) {
            setTimeout(() => {
                showNotification(notification.title, notification.description);
            }, timeUntilNotification);
        }
    });
}

function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasks();
        
        // Update UI
        if (currentTab === 'tasks') {
            renderWeekCalendar();
            if (selectedDate) {
                renderDayTasks(selectedDate);
                updateDayTasksTitle(selectedDate);
            }
        }
        
        console.log('Task deleted:', taskId);
    } else {
        console.log('Task not found for deletion:', taskId);
    }
}

function renderWeekCalendar() {
    const weekDaysContainer = document.getElementById('week-days');
    if (!weekDaysContainer) {
        console.log('Week days container not found');
        return;
    }
    
    // Calculate the start of the current week (Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToSunday = dayOfWeek;
    const sundayOfCurrentWeek = new Date(today);
    sundayOfCurrentWeek.setDate(today.getDate() - daysToSunday);
    
    // Apply week offset
    const startDate = new Date(sundayOfCurrentWeek);
    startDate.setDate(sundayOfCurrentWeek.getDate() + (weekOffset * 7));
    
    const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const monthNames = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 
                       'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];
    
    weekDaysContainer.innerHTML = '';
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'week-day';
        dayElement.dataset.date = date.toISOString().split('T')[0];
        
        // Check if this day has tasks
        const dateStr = formatDate(date);
        const dayTasks = tasks.filter(task => task.date === dateStr);
        
        if (dayTasks.length > 0) {
            dayElement.classList.add('has-tasks');
        }
        
        // Check if this is today
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check if this is the selected day (including today)
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }
        
        // Check if this day has completed tasks
        const completedTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate.toDateString() === date.toDateString() && task.completed;
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
            
            // Re-render the entire week calendar to update all selections
            renderWeekCalendar();
        });
        
        weekDaysContainer.appendChild(dayElement);
    }
    
    // Update day tasks title after rendering week
    if (selectedDate) {
        updateDayTasksTitle(selectedDate);
    }
}

function setupSwipeForWeek() {
    const weekDays = document.getElementById('week-days');
    if (!weekDays) return;
    
    weekDays.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    weekDays.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Свайп вліво - наступний тиждень
            weekOffset++;
            renderWeekCalendar();
        }
        // Свайп вправо не робимо нічого (тільки вперед)
    }
}

function renderDayTasks(date) {
    const dayTasksContainer = document.getElementById('day-tasks-list');
    if (!dayTasksContainer) {
        console.log('Day tasks container not found');
        return;
    }
    
    if (!date) {
        console.log('No date provided to renderDayTasks');
        return;
    }
    
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
    if (!dayTasksTitle) {
        console.log('Day tasks title element not found');
        return;
    }
    
    if (!date) {
        console.log('No date provided to updateDayTasksTitle');
        return;
    }

    const dayNames = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const monthNames = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 
                       'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    
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

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.dataset.taskId = task.id;
    
    const timeDisplay = task.time ? `<div class="task-time">${task.time}</div>` : '';
    const descriptionDisplay = task.description ? `<div class="task-description">${task.description}</div>` : '';
    
    taskElement.innerHTML = `
        <div class="task-header">
            <div class="task-title">${task.title}</div>
            ${timeDisplay}
        </div>
        ${descriptionDisplay}
        <div class="task-actions">
            <button class="btn btn-sm btn-secondary edit-task-btn" data-task-id="${task.id}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger delete-task-btn" data-task-id="${task.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add delete event listener
    const deleteBtn = taskElement.querySelector('.delete-task-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });
    }
    
    // Add edit event listener
    const editBtn = taskElement.querySelector('.edit-task-btn');
    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showEditTaskModal(task);
        });
    }
    
    return taskElement;
}

function showMonthlyCalendar() {
    const modal = document.getElementById('monthly-calendar-modal');
    if (modal) {
        modal.classList.add('show');
        renderMonthlyCalendar();
    } else {
        console.log('Monthly calendar modal not found');
    }
}

function hideMonthlyCalendar() {
    const modal = document.getElementById('monthly-calendar-modal');
    if (modal) {
        modal.classList.remove('show');
    } else {
        console.log('Monthly calendar modal not found');
    }
}

function changeMonth(delta) {
    calendarViewMonth += delta;
    
    if (calendarViewMonth > 11) {
        calendarViewMonth = 0;
        calendarViewYear++;
    } else if (calendarViewMonth < 0) {
        calendarViewMonth = 11;
        calendarViewYear--;
    }
    
    renderMonthlyCalendar();
}

function renderMonthlyCalendar() {
    const grid = document.getElementById('monthly-calendar-grid');
    const monthYearSpan = document.getElementById('current-month-year');
    if (!grid || !monthYearSpan) {
        console.log('Monthly calendar elements not found');
        return;
    }

    const monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 
                       'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
    const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    monthYearSpan.textContent = `${monthNames[calendarViewMonth]} ${calendarViewYear}`;
    
    const firstDay = new Date(calendarViewYear, calendarViewMonth, 1);
    const lastDay = new Date(calendarViewYear, calendarViewMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    grid.innerHTML = '';
    
    // Add day headers
    dayNames.forEach(dayName => {
        const headerElement = document.createElement('div');
        headerElement.className = 'calendar-day header';
        headerElement.textContent = dayName;
        grid.appendChild(headerElement);
    });
    
    // Add calendar days
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.dataset.date = date.toISOString().split('T')[0];
        
        // Check if this day has tasks
        const dayTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate.toDateString() === date.toDateString();
        });
        
        if (dayTasks.length > 0) {
            dayElement.classList.add('has-tasks');
        }
        
        // Check if this is the selected day
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }
        
        // Check if this is current month
        if (date.getMonth() !== calendarViewMonth) {
            dayElement.classList.add('other-month');
        }
        
        // Check if this day has completed tasks
        const completedTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate.toDateString() === date.toDateString() && task.completed;
        });
        if (completedTasks.length > 0) {
            dayElement.classList.add('has-completed-tasks');
        }
        
        dayElement.innerHTML = `
            <div class="calendar-day-number">${date.getDate()}</div>
            <div class="calendar-day-name">${dayNames[date.getDay()]}</div>
        `;
        
        dayElement.addEventListener('click', () => {
            selectedDate = date;
            
            // Calculate week offset to show the selected date in the week view
            const today = new Date();
            const dayOfWeek = today.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const mondayOfCurrentWeek = new Date(today);
            mondayOfCurrentWeek.setDate(today.getDate() - daysToMonday);
            
            const selectedDayOfWeek = date.getDay();
            const daysToMondayOfSelected = selectedDayOfWeek === 0 ? 6 : selectedDayOfWeek - 1;
            const mondayOfSelectedWeek = new Date(date);
            mondayOfSelectedWeek.setDate(date.getDate() - daysToMondayOfSelected);
            
            // Calculate weeks difference
            const weeksDiff = Math.floor((mondayOfSelectedWeek - mondayOfCurrentWeek) / (7 * 24 * 60 * 60 * 1000));
            weekOffset = weeksDiff;
            
            hideMonthlyCalendar();
            updateCurrentDayInfo();
            renderWeekCalendar();
            renderDayTasks(date);
            updateDayTasksTitle(date);
        });
        
        grid.appendChild(dayElement);
    }
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
    
    const notificationOptions = document.getElementById('notification-options');
    if (notificationsEnabled) {
        notificationOptions.style.display = 'block';
        requestNotificationPermission();
    } else {
        notificationOptions.style.display = 'none';
        document.getElementById('notification1').checked = false;
        document.getElementById('notification2').checked = false;
        document.getElementById('notification3').checked = false;
        notification1Enabled = false;
        notification2Enabled = false;
        notification3Enabled = false;
        localStorage.setItem('notification1Enabled', false);
        localStorage.setItem('notification2Enabled', false);
        localStorage.setItem('notification3Enabled', false);
    }
}

function toggleNotification1() {
    notification1Enabled = document.getElementById('notification1').checked;
    localStorage.setItem('notification1Enabled', notification1Enabled);
}

function toggleNotification2() {
    notification2Enabled = document.getElementById('notification2').checked;
    localStorage.setItem('notification2Enabled', notification2Enabled);
}

function toggleNotification3() {
    notification3Enabled = document.getElementById('notification3').checked;
    localStorage.setItem('notification3Enabled', notification3Enabled);
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

// Simulate notifications (for demo purposes)
function showNotification(title, body) {
    if (!title) {
        console.log('No title provided for notification');
        return;
    }
    
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: body || '' });
    } else {
        // Fallback to alert for demo
        alert(`${title}\n${body || ''}`);
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
    // saveToIndexedDB('appData', appData);
    
    // Note: saveToFile is only called manually via export button
}

function loadAppData() {
    // Try to load from IndexedDB first
    // loadFromIndexedDB('appData').then(data => {
    //     if (data) {
    //         goals = data.goals || [];
    //         archivedGoals = data.archivedGoals || [];
    //         tasks = data.tasks || [];
    //         currentLanguage = data.settings?.language || 'uk';
    //         notificationsEnabled = data.settings?.notificationsEnabled || false;
    //         notification1Enabled = data.settings?.notification1Enabled || false;
    //         notification2Enabled = data.settings?.notification2Enabled || false;
    //         notification3Enabled = data.settings?.notification3Enabled || false;
    //         notification1Time = data.settings?.notification1Time || '09:00';
    //         notification2Time = data.settings?.notification2Time || '14:00';
    //         notification3Time = data.settings?.notification3Time || '19:00';
    //     }
    // });
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
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update content visibility
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
        setupTaskButtons(); // Setup task buttons when switching to tasks tab
        updateEmptyState();
    }
}

function setupTaskButtons() {
    console.log('Setting up task buttons...');
    
    // Setup add task button
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
        console.log('Found add task button');
        // Remove existing listeners by cloning
        const newAddTaskBtn = addTaskBtn.cloneNode(true);
        addTaskBtn.parentNode.replaceChild(newAddTaskBtn, addTaskBtn);
        newAddTaskBtn.addEventListener('click', () => {
            console.log('Add task button clicked');
            showAddTaskModal();
        });
    } else {
        console.log('Add task button not found');
    }
    
    // Setup calendar view button
    const calendarViewBtn = document.getElementById('calendar-view-btn');
    if (calendarViewBtn) {
        const newCalendarViewBtn = calendarViewBtn.cloneNode(true);
        calendarViewBtn.parentNode.replaceChild(newCalendarViewBtn, calendarViewBtn);
        newCalendarViewBtn.addEventListener('click', showMonthlyCalendar);
    }
    
    // Setup today button
    const todayBtn = document.getElementById('today-btn');
    if (todayBtn) {
        const newTodayBtn = todayBtn.cloneNode(true);
        todayBtn.parentNode.replaceChild(newTodayBtn, todayBtn);
        newTodayBtn.addEventListener('click', () => {
            selectedDate = new Date();
            weekOffset = 0; // Reset week offset to current week
            updateCurrentDayInfo();
    renderWeekCalendar();
    renderDayTasks(selectedDate);
            updateDayTasksTitle(selectedDate);
        });
    }
    
    // Setup task modal close button
    const closeTaskModal = document.getElementById('close-task-modal');
    if (closeTaskModal) {
        const newCloseTaskModal = closeTaskModal.cloneNode(true);
        closeTaskModal.parentNode.replaceChild(newCloseTaskModal, closeTaskModal);
        newCloseTaskModal.addEventListener('click', hideAddTaskModal);
    }
    
    // Setup task form
    const addTaskForm = document.getElementById('add-task-form');
    if (addTaskForm) {
        console.log('Found add task form');
        const newAddTaskForm = addTaskForm.cloneNode(true);
        addTaskForm.parentNode.replaceChild(newAddTaskForm, addTaskForm);
        newAddTaskForm.addEventListener('submit', (e) => {
            console.log('Form submitted');
            handleAddTask(e);
        });
    } else {
        console.log('Add task form not found');
    }
    
    // Setup cancel task button
    const cancelTask = document.getElementById('cancel-task');
    if (cancelTask) {
        const newCancelTask = cancelTask.cloneNode(true);
        cancelTask.parentNode.replaceChild(newCancelTask, cancelTask);
        newCancelTask.addEventListener('click', hideAddTaskModal);
    }
    
    // Setup monthly calendar buttons
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
    
    // Setup week navigation buttons
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    
    if (prevWeekBtn) {
        console.log('Found prev week button');
        const newPrevWeekBtn = prevWeekBtn.cloneNode(true);
        prevWeekBtn.parentNode.replaceChild(newPrevWeekBtn, prevWeekBtn);
        newPrevWeekBtn.addEventListener('click', () => {
            console.log('Previous week clicked');
            goToPreviousWeek();
        });
    }
    
    if (nextWeekBtn) {
        console.log('Found next week button');
        const newNextWeekBtn = nextWeekBtn.cloneNode(true);
        nextWeekBtn.parentNode.replaceChild(newNextWeekBtn, nextWeekBtn);
        newNextWeekBtn.addEventListener('click', () => {
            console.log('Next week clicked');
            goToNextWeek();
        });
    }
    
    console.log('Task buttons setup complete');
}

function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    if (!tasksList) return;

    if (currentTab === 'tasks') {
        tasksList.style.display = 'block';
        // Set selected date to current date if not set
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

function updateCurrentDayInfo() {
    const dayNames = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const monthNames = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 
                       'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
    
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
    
    if (!emptyState) return;
    
    if (currentTab === 'goals') {
        if (goals.length === 0) {
            if (goalsList) goalsList.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <i class="fas fa-bullseye empty-icon"></i>
                <h2>Поки що немає цілей</h2>
                <p>Натисніть кнопку + щоб додати першу ціль</p>
            `;
        } else {
            if (goalsList) goalsList.style.display = 'block';
            emptyState.style.display = 'none';
        }
    } else if (currentTab === 'tasks') {
        // Взагалі не показуємо emptyState для завдань
        emptyState.style.display = 'none';
        emptyState.innerHTML = '';
    }
}

function showAddTaskModal() {
    const modal = document.getElementById('add-task-modal');
    if (modal) {
        modal.classList.add('show');
        // Set current date
        const taskDateInput = document.getElementById('task-date');
        if (taskDateInput && selectedDate) {
            taskDateInput.value = selectedDate.toISOString().split('T')[0];
        }
        // Focus on title input
        const titleInput = document.getElementById('task-title');
        if (titleInput) {
            titleInput.focus();
        }
    } else {
        console.log('Add task modal not found');
    }
}

function hideAddTaskModal() {
    const modal = document.getElementById('add-task-modal');
    if (modal) {
        modal.classList.remove('show');
        
        // Reset form
        const form = document.getElementById('add-task-form');
        if (form) {
            form.reset();
        }
        
        // Reset modal state
        modal.removeAttribute('data-editTaskId');
        
        // Reset modal title and button
        const modalTitle = modal.querySelector('.modal-header h2');
        if (modalTitle) modalTitle.textContent = 'Додати завдання';
        
        const submitBtn = modal.querySelector('.form-actions .btn-primary');
        if (submitBtn) submitBtn.textContent = 'Додати';
    } else {
        console.log('Add task modal not found');
    }
}

function handleAddTask(e) {
    e.preventDefault();
    
    console.log('handleAddTask called');
    
    const titleInput = document.getElementById('task-title');
    const descriptionInput = document.getElementById('task-description');
    const dateInput = document.getElementById('task-date');
    const timeInput = document.getElementById('task-time');
    
    if (!titleInput || !dateInput) {
        console.log('Required form elements not found');
        return;
    }
    
    const title = titleInput.value.trim();
    const description = descriptionInput ? descriptionInput.value.trim() : '';
    const date = dateInput.value;
    const time = timeInput ? timeInput.value : '';
    
    console.log('Form data:', { title, description, date, time });
    
    // Get selected notifications with minutes before
    const notifications = [];
    for (let i = 1; i <= 3; i++) {
        const checkbox = document.getElementById(`notification-${i}`);
        const select = document.getElementById(`notification-time-${i}`);
        if (checkbox && checkbox.checked && select && select.value) {
            notifications.push({
                id: i,
                minutes: parseInt(select.value),
                title: title,
                description: description || 'Завдання'
            });
        }
    }
    
    if (!title || !date) {
        alert('Будь ласка, заповніть назву та дату завдання');
        return;
    }
    
    const modal = document.getElementById('add-task-modal');
    const editTaskId = modal ? modal.dataset.editTaskId : null;
    
    if (editTaskId) {
        // Редагування існуючого завдання
        console.log('Editing task:', editTaskId);
        updateTask(editTaskId, title, description, date, time, notifications);
    } else {
        // Додавання нового завдання
        console.log('Adding new task');
        addTask(title, description, date, time, notifications);
    }
    
    // Закриваємо модальне вікно після збереження
    hideAddTaskModal();
}

function updateTask(taskId, title, description, date, time, notifications) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: title,
            description: description,
            date: date,
            time: time,
            notifications: notifications,
            updatedAt: new Date().toISOString()
        };
        
        saveTasks();
        
        // Update UI
        if (currentTab === 'tasks') {
            renderWeekCalendar();
            if (selectedDate) {
                renderDayTasks(selectedDate);
                updateDayTasksTitle(selectedDate);
            }
        }
        
        console.log('Task updated:', taskId);
    } else {
        console.log('Task not found for update:', taskId);
    }
}

function hideAllModals() {
    hideAddGoalModal();
    hideGoalDetailModal();
    hideSettingsModal();
    hideArchiveModal();
    hideEditGoalModal();
    hideAddTaskModal();
    hideMonthlyCalendar();
}

function showEditTaskModal(task) {
    // Показуємо модальне вікно редагування
    const modal = document.getElementById('add-task-modal');
    if (modal) {
        modal.classList.add('show');
        
        // Заповнюємо форму даними завдання
        const titleInput = document.getElementById('task-title');
        const descriptionInput = document.getElementById('task-description');
        const dateInput = document.getElementById('task-date');
        const timeInput = document.getElementById('task-time');
        
        if (titleInput) titleInput.value = task.title;
        if (descriptionInput) descriptionInput.value = task.description || '';
        if (dateInput) dateInput.value = task.date;
        if (timeInput) timeInput.value = task.time || '';
        
        // Встановлюємо сповіщення
        for (let i = 1; i <= 3; i++) {
            const checkbox = document.getElementById(`notification-${i}`);
            const select = document.getElementById(`notification-time-${i}`);
            
            if (checkbox && select) {
                const notification = task.notifications.find(n => n.id === i);
                if (notification) {
                    checkbox.checked = true;
                    select.value = notification.minutes;
                } else {
                    checkbox.checked = false;
                    select.value = '15'; // Default to 15 minutes
                }
            }
        }
        
        // Змінюємо заголовок і кнопку
        const modalTitle = modal.querySelector('.modal-header h2');
        if (modalTitle) modalTitle.textContent = 'Редагувати завдання';
        
        const submitBtn = modal.querySelector('.form-actions .btn-primary');
        if (submitBtn) submitBtn.textContent = 'Зберегти зміни';
        
        // Зберігаємо ID завдання для редагування
        modal.dataset.editTaskId = task.id;
        
        // Focus on title input
        if (titleInput) titleInput.focus();
    }
}

// Додаю функції для навігації тижнів
function goToPreviousWeek() {
    weekOffset--;
    if (selectedDate) {
        selectedDate.setDate(selectedDate.getDate() - 7);
    }
    updateCurrentDayInfo();
    renderWeekCalendar();
    if (selectedDate) {
        renderDayTasks(selectedDate);
        updateDayTasksTitle(selectedDate);
    }
}

function goToNextWeek() {
    weekOffset++;
    if (selectedDate) {
        selectedDate.setDate(selectedDate.getDate() + 7);
    }
    updateCurrentDayInfo();
    renderWeekCalendar();
    if (selectedDate) {
        renderDayTasks(selectedDate);
        updateDayTasksTitle(selectedDate);
    }
}

function toggleWeekView() {
    isFullWeekView = !isFullWeekView;
    renderWeekCalendar();
}

function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        if (selectedDate) {
            renderDayTasks(selectedDate);
            updateDayTasksTitle(selectedDate);
        }
    } else {
        console.log('Task not found:', taskId);
    }
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        showEditTaskModal(task);
    } else {
        console.log('Task not found:', taskId);
    }
}

function formatDate(date) {
    if (!date || !(date instanceof Date)) {
        console.log('Invalid date provided to formatDate:', date);
        return '';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Goals Rendering
function renderGoals() {
    const goalsList = document.getElementById('goals-list');
    if (!goalsList) return;
    
    if (goals.length === 0) {
        goalsList.innerHTML = '';
        return;
    }
    
    goalsList.innerHTML = goals.map(goal => {
        const progress = calculateProgress(goal.progressBars);
        let progressClass = 'neutral';
        if (progress > 0) progressClass = 'positive';
        if (progress < 0) progressClass = 'negative';
        
        return `
            <div class="goal-item" data-goal-id="${goal.id}">
                <div class="goal-header">
                    <h3 class="goal-title">${goal.title}</h3>
                    <div class="goal-actions">
                        <button class="btn btn-sm btn-secondary" onclick="showGoalDetail('${goal.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                ${goal.description ? `<p class="goal-description">${goal.description}</p>` : ''}
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill ${progress < 0 ? 'negative' : ''}" style="width: ${Math.abs(progress)}%;"></div>
                </div>
                <div class="goal-progress-text">
                    <span class="goal-progress ${progressClass}">${progress}%</span>
                </div>
            </div>
        `;
    }).join('');
}