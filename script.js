function addTask() {
    // 1. Get the text from the input box
    const input = document.getElementById('taskInput');
    const taskText = input.value;
    
    // 2. Check if the input is empty
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }
    
    // 3. Create a new list item element
    const li = document.createElement('li');
    li.className = 'task-item';
        
    // 4. Create text span and delete button
    const span = document.createElement('span');
    span.textContent = taskText;
        
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
        
    // 5. Add click event to delete button
    delBtn.onclick = function() {
        li.remove();
    };
    
    // 6. Assemble the list item
    li.appendChild(span);
    li.appendChild(delBtn);
    
    // 7. Add to the main list
    document.getElementById('taskList').appendChild(li);
    
    // 8. Clear the input box
    input.value = "";
}