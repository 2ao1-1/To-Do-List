class TodoList {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.initSortable();
  }

  initSortable() {
    const taskList = document.getElementById("taskList");
    this.sortable = new Sortable(taskList, {
      animation: 150,
      ghostClass: "sortable-ghost",
      onEnd: () => this.updateTaskOrder(),
    });
  }

  updateTaskOrder() {
    const taskElements = document.querySelectorAll(".task");
    this.tasks = Array.from(taskElements).map((el) =>
      this.tasks.find((task) => task.id === el.dataset.id)
    );
    this.save();
  }

  addTask(title) {
    const task = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    this.tasks.push(task);
    this.save();
    this.render();
  }

  toggleTask(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.save();
      this.render();
    }
  }

  removeTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.save();
    this.render();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  render() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    this.tasks.forEach((task) => {
      const div = document.createElement("div");
      div.className = "task";
      div.dataset.id = task.id;
      div.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <span class="task-text ${task.completed ? "completed" : ""}">${
        task.title
      }</span>
        <button class="delete-btn">✕</button>
      `;

      div
        .querySelector('input[type="checkbox"]')
        .addEventListener("change", () => {
          this.toggleTask(task.id);
        });

      div.querySelector(".delete-btn").addEventListener("click", () => {
        this.removeTask(task.id);
      });

      list.appendChild(div);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const todoList = new TodoList();
  todoList.render();

  document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("taskInput");
    const title = input.value.trim();
    if (title) {
      todoList.addTask(title);
      input.value = "";
    }
  });
});
