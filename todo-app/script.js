const API_URL = "http://localhost:5000/tasks";

let tasks = [];
let currentFilter = "all";

// Fetch tasks
async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks();
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// Add task
async function addTask() {
  try {
    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority").value;
    const date = document.getElementById("dueDate").value;

    if (input.value === "") return;

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: input.value,
        priority,
        date,
        completed: false
      })
    });

    input.value = "";
    fetchTasks();
  } catch (err) {
    console.error("Add error:", err);
  }
}

// Delete task
async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
    fetchTasks();
  } catch (err) {
    console.error("Delete error:", err);
  }
}

// Toggle complete ✅ (FIXED)
async function toggleComplete(id, completed) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        completed: !completed
      })
    });
    fetchTasks();
  } catch (err) {
    console.error("Toggle error:", err);
  }
}

// Render tasks
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks;

  if (currentFilter === "completed") {
    filtered = tasks.filter(t => t.completed);
  } else if (currentFilter === "pending") {
    filtered = tasks.filter(t => !t.completed);
  }

  filtered.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span style="text-decoration: ${task.completed ? "line-through" : "none"}">
        ${task.text} (${task.priority}) - ${task.date || "No date"}
      </span>

      <button onclick="toggleComplete('${task._id}', ${task.completed})">
        ${task.completed ? "Undo" : "Done"}
      </button>

      <button onclick="deleteTask('${task._id}')">
        Delete
      </button>
    `;

    list.appendChild(li);
  });
}

// Filter
function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

// Initial load
fetchTasks();
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleMode");

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
});