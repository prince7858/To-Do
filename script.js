let addBtn = document.getElementById("addBtn");
let taskTitle = document.getElementById("title");
let taskDesc = document.getElementById("desc");
let taskPriority = document.getElementById("priority");
let todoContainer = document.getElementById("todoContainer");
let defaultMessage = document.getElementById("defaultMessage");
let searchBar = document.getElementById("searchBar");

// Load tasks from localStorage on page load
window.onload = () => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => addTaskToDOM(task.title, task.desc, task.priority, false));
    toggleDefaultMessage();
};

// Add a new task
addBtn.addEventListener("click", () => {
    if (taskTitle.value === "" || taskDesc.value === "") {
        alert("Please enter task details");
        return;
    }

    let title = taskTitle.value;
    let desc = taskDesc.value;
    let priority = taskPriority.value;

    saveTaskToLocalStorage(title, desc, priority);
    addTaskToDOM(title, desc, priority, true);

    // Clear inputs
    taskTitle.value = "";
    taskDesc.value = "";
    taskPriority.value = "Medium";

    toggleDefaultMessage();
});

// Add task to the DOM
function addTaskToDOM(title, desc, priority, animate = true) {
    // Hide default message
    defaultMessage.style.display = "none";

    let task = document.createElement("div");
    task.classList.add(
        "border",
        "p-3",
        "myColor",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "rounded-4",
        "mt-3"
    );

    if (animate) {
        task.style.opacity = 0;
        setTimeout(() => (task.style.opacity = 1), 100);
    }

    let leftDiv = document.createElement("div");
    let rightDiv = document.createElement("div");

    let theading = document.createElement("h5");
    theading.innerText = title;

    let tdesc = document.createElement("p");
    tdesc.classList.add("text-muted", "mb-0");
    tdesc.innerText = desc;

    let tpriority = document.createElement("span");
    tpriority.innerText = `Priority: ${priority}`;
    tpriority.classList.add("badge", getPriorityClass(priority), "ms-2");

    leftDiv.appendChild(theading);
    leftDiv.appendChild(tdesc);
    leftDiv.appendChild(tpriority);

    task.appendChild(leftDiv);

    // Delete button
    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.classList.add("btn", "btn-danger", "btn-sm");

    delBtn.addEventListener("click", () => {
        task.style.opacity = 0;
        setTimeout(() => {
            todoContainer.removeChild(task);
            removeTaskFromLocalStorage(title, desc);
            toggleDefaultMessage();
        }, 300);
    });

    // Edit button
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("btn", "btn-warning", "btn-sm", "ms-2");

    editBtn.addEventListener("click", () => {
        taskTitle.value = title;
        taskDesc.value = desc;
        taskPriority.value = priority;
        todoContainer.removeChild(task);
        removeTaskFromLocalStorage(title, desc);
        toggleDefaultMessage();
    });

    rightDiv.appendChild(delBtn);
    rightDiv.appendChild(editBtn);

    task.appendChild(rightDiv);

    todoContainer.appendChild(task);
}

// Save task to localStorage
function saveTaskToLocalStorage(title, desc, priority) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ title, desc, priority });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Remove task from localStorage
function removeTaskFromLocalStorage(title, desc) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((task) => task.title !== title || task.desc !== desc);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Show/hide default message
function toggleDefaultMessage() {
    if (todoContainer.children.length === 0) {
        defaultMessage.style.display = "block";
    } else {
        defaultMessage.style.display = "none";
    }
}

// Filter tasks by search
searchBar.addEventListener("input", (e) => {
    let filter = e.target.value.toLowerCase();
    Array.from(todoContainer.children).forEach((task) => {
        let title = task.querySelector("h5").innerText.toLowerCase();
        task.style.display = title.includes(filter) ? "flex" : "none";
    });
});

// Get CSS class for priority badge
function getPriorityClass(priority) {
    if (priority === "High") return "bg-danger";
    if (priority === "Medium") return "bg-warning";
    if (priority === "Low") return "bg-success";
}
