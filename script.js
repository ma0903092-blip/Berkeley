// ==========================================
// 1. MATRIX DIGITAL RAIN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById('matrixCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'matrixCanvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '1'; // Sits above background image, below text cards
        canvas.style.pointerEvents = 'none';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    function drawMatrix() {
        // Semi-transparent trail fade to keep it dim and reveal the background image
        ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            
            // Dim, muted cyberpunk color palette
            const colors = ['rgba(56, 189, 248, 0.7)', 'rgba(0, 255, 102, 0.6)', 'rgba(129, 140, 248, 0.7)', 'rgba(192, 132, 252, 0.6)'];
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 40);
});


// ==========================================
// 2. TO-DO LIST APPLICATION (Robust Selectors)
// ==========================================
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    if (!taskList) return; // Exit if not on index.html

    loadTasks();

    // Universal selectors to catch any button/input ID variation
    const addTaskBtn = document.getElementById('addTaskBtn') || document.querySelector('.btn-add') || document.querySelector('button');
    const taskInput = document.getElementById('taskInput') || document.querySelector('input[type="text"]');

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addNewTask();
        });
    }

    if (taskInput) {
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addNewTask();
            }
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            loadTasks();
        });
    });

    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', () => {
            let tasks = getTasksFromLocalStorage();
            tasks = tasks.filter(t => !t.completed);
            saveTasksToLocalStorage(tasks);
            loadTasks();
        });
    }
});

function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('berkeley_tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('berkeley_tasks', JSON.stringify(tasks));
}

function addNewTask() {
    const taskInput = document.getElementById('taskInput') || document.querySelector('input[type="text"]');
    if (!taskInput) return;

    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    const tasks = getTasksFromLocalStorage();
    tasks.push(newTask);
    saveTasksToLocalStorage(tasks);

    taskInput.value = '';
    loadTasks();
}

function loadTasks() {
    const listElement = document.getElementById('taskList');
    if (!listElement) return;

    let tasks = getTasksFromLocalStorage();
    listElement.innerHTML = '';

    let filteredTasks = tasks;
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    }

    filteredTasks.forEach(task => createTaskElement(task));
    updateTaskCounter(tasks);
}

function createTaskElement(task) {
    const listElement = document.getElementById('taskList');
    if (!listElement) return;

    const li = document.createElement('li');
    li.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; margin-bottom: 10px; background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 6px; color: #cbd5e1;";

    const leftDiv = document.createElement('div');
    leftDiv.style.cssText = "display: flex; align-items: center; gap: 10px;";

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        updateTaskInStorage(task);
        loadTasks();
    });

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) {
        span.style.textDecoration = 'line-through';
        span.style.color = '#64748b';
    }

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.cssText = "background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;";
    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
    });

    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);
    listElement.appendChild(li);
}

function updateTaskInStorage(updatedTask) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    saveTasksToLocalStorage(tasks);
}

function deleteTask(id) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(t => t.id !== id);
    saveTasksToLocalStorage(tasks);
    loadTasks();
}

function updateTaskCounter(tasks) {
    const counterEl = document.getElementById('taskCounter');
    if (!counterEl) return;

    const activeTasks = tasks.filter(t => !t.completed).length;
    counterEl.textContent = `${activeTasks} item${activeTasks === 1 ? '' : 's'} left`;
}


// ==========================================
// 3. CYBER AUDIO SYNTHESIZER
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let audioEnabled = true;

function playCyberClick(frequency = 800, type = 'sine', duration = 0.04) {
    if (!audioEnabled) return;
    
    try {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    const clickableElements = document.querySelectorAll('button, a, .project-card');
    clickableElements.forEach(element => {
        element.addEventListener('click', () => {
            playCyberClick(700, 'sine', 0.05);
        });
    });
});