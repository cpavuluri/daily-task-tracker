
const API_URL = "/tasks/";

const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const tasks = await response.json();

        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.className = `task-item ${task.completed ? "completed" : ""}`;

            const title = document.createElement("span");
            title.textContent = task.title;

            const actions = document.createElement("div");
            actions.className = "task-actions";

            if (!task.completed) {
                const completeButton = document.createElement("button");
                completeButton.textContent = "Complete";
                completeButton.className = "complete-btn";
                completeButton.addEventListener("click", () => completeTask(task.id));
                actions.appendChild(completeButton);
            }

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.addEventListener("click", () => deleteTask(task.id));

            actions.appendChild(deleteButton);
            li.appendChild(title);
            li.appendChild(actions);
            taskList.appendChild(li);
        });

        updateCounts(tasks);
    } catch (error) {
        console.error(error);
        alert("Unable to load tasks. Please try again.");
    }
}

async function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        alert("Please enter a task.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error("Failed to add task");
        }

        taskInput.value = "";
        await loadTasks();
    } catch (error) {
        console.error(error);
        alert("Unable to add task. Please try again.");
    }
}

async function completeTask(taskId) {
    try {
        const response = await fetch(`${API_URL}${taskId}`, {
            method: "PATCH"
        });

        if (!response.ok) {
            throw new Error("Failed to complete task");
        }

        await loadTasks();
    } catch (error) {
        console.error(error);
        alert("Unable to complete task. Please try again.");
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_URL}${taskId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        await loadTasks();
    } catch (error) {
        console.error(error);
        alert("Unable to delete task. Please try again.");
    }
}

function updateCounts(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById("total-count").textContent = total;
    document.getElementById("pending-count").textContent = pending;
    document.getElementById("completed-count").textContent = completed;
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

loadTasks();
