let currentFilter = 'all';

// Load tasks from LocalStorage when the page opens
document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }
    
    const task = {
        text: taskText,
        id: Date.now(),
        completed: false
    };
    
    saveTaskToLocalStorage(task);
    loadTasks();
    input.value = "";
}

function filterTasks(filter) {
    currentFilter = filter;
        
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadTasks();
}

function createTaskElement(task) {
    const listElement = document.getElementById('taskList');
    
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.id = `task-${task.id}`;
        
    const span = document.createElement('span');
    span.textContent = task.text;
    span.style.cursor = 'pointer';
        
    span.onclick = function() {
        task.completed = !task.completed;
        updateTaskInStorage(task);
        loadTasks();
    };

    span.ondblclick = function() {
        editTask(task.id, li, span);
    };
        
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
        
    delBtn.onclick = function() {
        removeTask(task.id);
        loadTasks();
    };
    
    li.appendChild(span);
    li.appendChild(delBtn);
    listElement.appendChild(li);
}

function loadTasks() {
    let tasks = getTasksFromLocalStorage();
    const listElement = document.getElementById('taskList');

    // Guard clause: Exit if taskList doesn't exist on this page
    if (!listElement) return;
    
    listElement.innerHTML = ''; // Clear the list before re-rendering
    
    let filteredTasks = tasks;
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    }
    
    filteredTasks.forEach(task => createTaskElement(task));
    
    // Update the active task counter
    updateTaskCounter(tasks);
}

function updateTaskCounter(tasks) {
    const counterEl = document.getElementById('taskCounter');
    
    // Guard clause: Exit if taskCounter doesn't exist on this page
    if (!counterEl) return;

    const activeTasks = tasks.filter(t => !t.completed).length;
    counterEl.textContent = `${activeTasks} item${activeTasks === 1 ? '' : 's'} left`;
    }
}

function editTask(id, li, span) {
    const taskText = span.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = taskText;
        
    li.replaceChild(input, span);
    input.focus();
    
    input.onblur = function() {
        const newText = input.value.trim();
        let tasks = getTasksFromLocalStorage();
        const task = tasks.find(t => t.id === id);
        
        if (newText && task) {
            task.text = newText;
            updateTaskInStorage(task);
        }
        loadTasks();
    };
    
    input.onkeydown = function(e) {
        if (e.key === 'Enter') input.blur();
    };
}

function saveTaskToLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function updateTaskInStorage(updatedTask) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
    let tasks;
    if (localStorage.getItem('myTasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('myTasks'));
    }
    return tasks;
}

function removeTask(id) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function clearCompletedTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(t => !t.completed);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    loadTasks();
}

function handleContactSubmit(event) {
    event.preventDefault(); // Stop page reload

    // Show the green success banner immediately
    const successBanner = document.getElementById('formSuccessMessage');
    if (successBanner) {
        successBanner.style.display = 'block';
    }

    // Reset the form fields
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
    }

    // Hide the success message after 5 seconds
    setTimeout(() => {
        if (successBanner) {
            successBanner.style.display = 'none';
        }
    }, 5000);
}

// Initialize Matrix Digital Rain Effect
function initMatrixRain() {
    let canvas = document.getElementById('matrix-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        document.body.insertBefore(canvas, document.body.firstChild);
    }

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@$%&*<>?/~';
    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 17, 40, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#4ecca3';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 33);
}

// Run when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMatrixRain);
} else {
    initMatrixRain();
}