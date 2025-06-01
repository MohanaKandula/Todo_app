const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const task = document.getElementById('task-input').value.trim();
  const dueDate = document.getElementById('due-date').value;
  const category = document.getElementById('category').value;

  if (task) {
    tasks.push({ task, dueDate, category, completed: false });
    updateTasks();
    form.reset();
  }
});

function updateTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'task';

    // Task text
    const taskSpan = createEditableSpan(item.task, (newValue) => {
      tasks[index].task = newValue;
      updateTasks();
    });

    // Due date
    const dateSpan = createEditableInput('date', item.dueDate, (newValue) => {
      tasks[index].dueDate = newValue;
      updateTasks();
    });

    // Category
    const categorySpan = createEditableSelect(item.category, (newValue) => {
      tasks[index].category = newValue;
      updateTasks();
    });

    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = item.completed ? '✔' : '✗';
    toggleBtn.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      updateTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      updateTasks();
    });

    actions.append(toggleBtn, deleteBtn);

    if (item.completed) {
      taskSpan.style.textDecoration = 'line-through';
    }

    li.append(taskSpan, dateSpan, categorySpan, actions);
    taskList.appendChild(li);
  });
}

// Helpers for inline editing
function createEditableSpan(text, onSave) {
  const span = document.createElement('span');
  span.textContent = text;

  span.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = text;

    input.addEventListener('blur', () => onSave(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') input.blur();
    });

    span.replaceWith(input);
    input.focus();
  });

  return span;
}

function createEditableInput(type, value, onSave) {
  const span = document.createElement('small');
  span.textContent = value;

  span.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = type;
    input.value = value;

    input.addEventListener('blur', () => onSave(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') input.blur();
    });

    span.replaceWith(input);
    input.focus();
  });

  return span;
}

function createEditableSelect(value, onSave) {
  const span = document.createElement('small');
  span.textContent = value;

  span.addEventListener('click', () => {
    const select = document.createElement('select');
    ['Personal', 'Work', 'Other'].forEach(optionVal => {
      const option = document.createElement('option');
      option.value = optionVal;
      option.textContent = optionVal;
      if (optionVal === value) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener('blur', () => onSave(select.value));
    select.addEventListener('change', () => select.blur());

    span.replaceWith(select);
    select.focus();
  });

  return span;
}

renderTasks();
