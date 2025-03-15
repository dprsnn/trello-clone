document.addEventListener("DOMContentLoaded", loadTasks); // Завантажуємо задачі при запуску сторінки

function addTask(columnId, taskText = null, taskId = null) {
    if (!taskText) {
        taskText = prompt("Введіть назву задачі:");
        if (!taskText) return;
    }

    if (!taskId) {
        taskId = "task-" + Date.now(); // Унікальний ID для нової задачі
    }

    let task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("draggable", "true");
    task.setAttribute("ondragstart", "drag(event)");
    task.id = taskId;

    task.innerHTML = `
        <span>${taskText}</span>
        <div class="buttons">
            <button onclick="editTask(this)">✏️</button>
            <button onclick="deleteTask(this)">🗑️</button>
        </div>
    `;

    document.getElementById(columnId).appendChild(task);
    saveTasks(); // Зберігаємо після додавання
}

function editTask(button) {
    let task = button.closest(".task");
    let taskTextElement = task.querySelector("span");
    let newText = prompt("Редагувати задачу:", taskTextElement.innerText);

    if (newText) {
        taskTextElement.innerText = newText;
        saveTasks(); // Зберігаємо після редагування
    }
}

function deleteTask(button) {
    let task = button.closest(".task");
    if (confirm("Ви дійсно хочете видалити цю задачу?")) {
        task.remove();
        saveTasks(); // Зберігаємо після видалення
    }
}

// Збереження задач у Local Storage
function saveTasks() {
    let tasks = [];

    document.querySelectorAll(".tasks").forEach(column => {
        let columnId = column.id;
        column.querySelectorAll(".task").forEach(task => {
            tasks.push({
                id: task.id,
                text: task.querySelector("span").innerText,
                column: columnId
            });
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Завантаження задач із Local Storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        addTask(task.column, task.text, task.id);
    });
}

// Drag & Drop логіка
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text/plain");
    let task = document.getElementById(taskId);

    if (event.target.classList.contains("tasks")) {
        event.target.appendChild(task);
        saveTasks(); // Зберігаємо після переміщення
    }
}

