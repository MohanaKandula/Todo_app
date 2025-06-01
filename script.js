const form = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => 
    {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
      <div>
        <strong>${task.text}</strong> [${task.category}] - Due: ${task.dueDate}
      </div>
      <div>
        <button onclick="toggleComplete(${index})">✔</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = document.getElementById("task-input").value;
  const dueDate = document.getElementById("due-date").value;
  const category = document.getElementById("category").value;

  tasks.push({ text, dueDate, category, completed: false });
  saveTasks();
  renderTasks();
  form.reset();
});

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) 
{
  const task = tasks[index];

  const newText = prompt("Edit task text:", task.text);
  if (newText !== null && newText.trim() !== "") {
    task.text = newText;
  }

  const newDueDate = prompt("Edit due date (YYYY-MM-DD):", task.dueDate);
  if (newDueDate !== null && newDueDate.trim() !== "") {
    task.dueDate = newDueDate;
  }

  const newCategory = prompt("Edit category (Work, Personal, Other):", task.category);
  if (newCategory !== null && newCategory.trim() !== "") {
    task.category = newCategory;
  }

  saveTasks();
  renderTasks();
}

renderTasks();
