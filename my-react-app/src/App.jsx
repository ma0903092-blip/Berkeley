import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState("")
  const [filter, setFilter] = useState("all") // 'all', 'active', 'completed'

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, id: Date.now(), completed: false }])
    setInput("")
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // Filter tasks based on the selected filter state
  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true; // 'all'
  })

  return (
    <div className="container">
      <h1>React To-Do List</h1>
      
      <div className="input-group">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Filter Buttons */}
      <div className="filter-group">
        <button className={filter === "all" ? "active-filter" : ""} onClick={() => setFilter("all")}>All</button>
        <button className={filter === "active" ? "active-filter" : ""} onClick={() => setFilter("active")}>Active</button>
        <button className={filter === "completed" ? "active-filter" : ""} onClick={() => setFilter("completed")}>Completed</button>
      </div>

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <span onClick={() => toggleTask(task.id)} style={{ cursor: 'pointer', flex: 1, textAlign: 'left' }}>
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App