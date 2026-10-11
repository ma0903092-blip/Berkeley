// 1. Load tasks from localStorage when the page first loads
document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskText => renderTask(taskText, false));
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }
    
    renderTask(taskText, true);
    input.value = "";
}

// 2. Helper function to create and append list items
function renderTask(taskText, saveToStorage) {
    const list = document.getElementById('taskList');
    const li = document.createElement('li');
    li.className = 'task-item';
        
    const span = document.createElement('span');
    span.textContent = taskText;
        
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
        
    // 3. Delete event removes item from screen and localStorage
    delBtn.onclick = function() {
        li.remove();
        removeTaskFromStorage(taskText);
    };
    
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);

    if (saveToStorage) {
        saveTaskToStorage(taskText);
    }
}

// 4. LocalStorage helper functions
function saveTaskToStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}