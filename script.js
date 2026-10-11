// Load tasks from LocalStorage when the page opens
document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }
    
    // Create the task object to save in LocalStorage
    const task = {
        text: taskText,
        id: Date.now() // Unique ID based on time
    };
    
    // Save to LocalStorage and create HTML element
    saveTaskToLocalStorage(task);
    createTaskElement(task);
    
    // Clear the input box
    input.value = "";
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.id = `task-${task.id}`;
        
    const span = document.createElement('span');
    span.textContent = task.text;
    
    // Final Challenge: Click text to cross it out
    span.style.cursor = 'pointer';
    span.onclick = function() {
        span.style.textDecoration = span.style.textDecoration === 'line-through' ? 'none' : 'line-through';
    };
        
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
        
    delBtn.onclick = function() {
        removeTask(task.id);
        li.remove();
    };
    
    li.appendChild(span);
    li.appendChild(delBtn);
    document.getElementById('taskList').appendChild(li);
}

function saveTaskToLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks.push(task);
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

function loadTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => createTaskElement(task));
}

function removeTask(id) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}