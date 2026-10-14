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
                
                // Sleek, dim grey alpha opacity
                const alpha = Math.max(0.05, ((6 - j) / 6) * 0.35);
                ctx.fillStyle = `rgba(160, 174, 192, ${alpha})`;
                
                const yPos = (drops[i] - j) * fontSize;
                if (yPos > 0 && yPos < canvas.height) {
                    ctx.fillText(text, i * fontSize, yPos);
                }
            }

            if (drops[i] * fontSize > canvas.height) {
                drops[i] = 0;
            }
            drops[i] += 0.2;
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

   // Global function for filter buttons
function filterTasks(filter) {
    currentFilter = filter;

    // Update active class on buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (event && event.target) {
        event.target.classList.add('active');
    }

    loadTasks();
}

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
    const taskDateInput = document.getElementById('taskDate');
    const dueDate = taskDateInput ? taskDateInput.value : '';

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false,
        dueDate: dueDate // Save the selected date
    });

    if (taskDateInput) taskDateInput.value = ''; // Reset date picker

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

    if (task.dueDate) {
        const dateBadge = document.createElement('span');
        dateBadge.className = 'task-date-badge';
        dateBadge.textContent = `Due: ${task.dueDate}`;
        leftDiv.appendChild(dateBadge);
    }

    // Add double-click inline editing to span
    span.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = task.text;
        
        leftDiv.replaceChild(input, span);
        input.focus();

        input.onblur = function() {
            const newText = input.value.trim();
            if (newText) {
                task.text = newText;
                updateTaskInStorage(task);
            }
            loadTasks();
        };

        input.onkeydown = function(e) {
            if (e.key === 'Enter') input.blur();
        };
    });
    
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

// Interactive Terminal Logic
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');

if (terminalInput && terminalOutput) {
    terminalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            
            // Print command line entry
            const cmdLine = document.createElement('p');
            cmdLine.style.cssText = 'margin: 0 0 8px 0; font-family: monospace; color: #94a3b8;';
            cmdLine.innerHTML = `<span style="color: #38bdf8;">$</span> ${terminalInput.value}`;
            terminalOutput.appendChild(cmdLine);

            // Process output line
            const resLine = document.createElement('p');
            resLine.style.cssText = 'margin: 0 0 15px 0; font-family: monospace; color: #f3f4f6;';

            if (command === 'help') {
                resLine.innerHTML = 'Available commands: <span style="color: #38bdf8;">whoami</span>, <span style="color: #38bdf8;">skills</span>, <span style="color: #38bdf8;">status</span>, <span style="color: #38bdf8;">clear</span>';
            } else if (command === 'whoami') {
                resLine.textContent = 'System Operator & Full-Spectrum Developer.';
            } else if (command === 'skills') {
                resLine.innerHTML = '<span style="color: #34d399;">> Frontend, System Administration, Security & Git Workflow.</span>';
            } else if (command === 'status') {
                resLine.textContent = 'System Status: All security layers operational. Node secure.';
            } else if (command === 'clear') {
                terminalOutput.innerHTML = '';
                terminalInput.value = '';
                return;
            } else if (command === '') {
                resLine.textContent = '';
            } else {
                resLine.innerHTML = `<span style="color: #ff5f56;">Command not recognized: ${terminalInput.value}. Type 'help' for options.</span>`;
            }

            if (command !== 'clear') {
                terminalOutput.appendChild(resLine);
            }

            terminalInput.value = '';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}