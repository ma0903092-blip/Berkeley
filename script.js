// ==========================================
// 1. MATRIX DIGITAL RAIN (Transparent Overlay)
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
        canvas.style.zIndex = '1';
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
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1).map(() => Math.random() * -50);

    function drawMatrix() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            for (let j = 0; j < 6; j++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                const alpha = Math.max(0.1, (6 - j) / 6);
                const colors = [
                    `rgba(56, 189, 248, ${alpha})`,
                    `rgba(0, 255, 102, ${alpha})`,
                    `rgba(129, 140, 248, ${alpha})`,
                    `rgba(192, 132, 252, ${alpha})`,
                    `rgba(52, 211, 153, ${alpha})`
                ];
                ctx.fillStyle = colors[i % colors.length];
                
                const yPos = (drops[i] - j) * fontSize;
                if (yPos > 0 && yPos < canvas.height) {
                    ctx.fillText(text, i * fontSize, yPos);
                }
            }

            if (drops[i] * fontSize > canvas.height) {
                drops[i] = 0;
            }
            drops[i] += 0.8;
        }
    }
    setInterval(drawMatrix, 35);
});


// ==========================================
// 2. TO-DO LIST APPLICATION
// ==========================================
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    if (!taskList) return; // Exit safely if not on index page

    loadTasks();

   const taskInput = document.getElementById('taskInput');

    if (taskInput) {
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTask();
            }
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

// Global scope attachment for HTML onclick bindings
window.addTask = function() {
    const taskInput = document.getElementById('taskInput');
    if (!taskInput) return;

    const text = taskInput.value.trim();
    if (!text) return;

    const tasks = getTasksFromLocalStorage();
    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });
    saveTasksToLocalStorage(tasks);

    taskInput.value = '';
    loadTasks();
};

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
    li.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; margin-bottom: 10px; background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 6px; color: #cbd5e1; gap: 15px;";

    const leftDiv = document.createElement('div');
    leftDiv.style.cssText = "display: flex; align-items: center; gap: 12px; overflow: hidden; text-overflow: ellipsis; flex-grow: 1;";

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.style.cursor = 'pointer';
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        updateTaskInStorage(task);
        loadTasks();
    });

    const span = document.createElement('span');
    span.textContent = task.text;
    span.style.wordBreak = 'break-word';
    if (task.completed) {
        span.style.textDecoration = 'line-through';
        span.style.color = '#64748b';
    }

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.cssText = "background: #ef4444; color: white; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; flex-shrink: 0;";
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