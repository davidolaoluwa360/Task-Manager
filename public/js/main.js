"use strict";

//* Selecting Elements
const taskInput = document.querySelector(".add-task__input");
const addTaskBtn = document.querySelector(".btn-add-task");
const clearTaskBtn = document.querySelector(".btn-clear-task");
const updateTaskBtn = document.querySelector(".btn-update-task");
const deleteTaskBtn = document.querySelectorAll(".fa-trash-alt");
const editTaskBtn = document.querySelector(".fa-pen");
const taskLists = document.querySelector(".task-lists");

//* creating important functions

//* when called get element from the localstorage
const getTaskFromLocalStorage = function (key) {
  return localStorage.getItem(key);
};

//* when called remove task from the localstorage
const removeTaskFromLocalStorage = function (key, index) {
  if (taskObj[Number(index)]) {
    delete taskObj[Number(index)];
    localStorage.setItem(key, JSON.stringify(taskObj));
  }
};

//* when called add task to the localstorage
const addTaskToLocalStorage = function (index, key, task) {
  const stringiedIndex = index.toString();
  taskObj[stringiedIndex] = task;
  localStorage.setItem(key, JSON.stringify(taskObj));
};

//* set initial variables
let taskObj, listIndex, isUpdate;
const init = (function () {
  taskObj = getTaskFromLocalStorage("task")
    ? JSON.parse(getTaskFromLocalStorage("task"))
    : {};
  let objectHasEnteries =
    Object.entries(taskObj).length > 0
      ? Object.entries(taskObj)[Object.entries(taskObj).length - 1]
      : 0;

  if (typeof objectHasEnteries !== "number") {
    let [index, value] = objectHasEnteries;
    listIndex = Number(index) + 1;
  } else {
    listIndex = objectHasEnteries;
  }

  isUpdate = false;
})();

const createHTML = function (value, index) {
  const html = `
    <li class="task-list task-list-${index}">
        <div class="task-list__left">
        <p>${value}</p>
        </div>
        <div class="task-list__right">
        <i class="fas fa-trash-alt task-delete-${index}"></i>
        <i class="fas fa-pen task-edit-${index}"></i>
        </div>
    </li>
    `;

  return html;
};

//* called when the DOM is loaded
(function () {
  //* remove all static task in the DOM
  taskLists.innerHTML = "";

  //* populate the task list from the localstorage
  let taskListData = getTaskFromLocalStorage("task")
    ? JSON.parse(getTaskFromLocalStorage("task"))
    : [];
  taskListData = Object.entries(taskListData);
  taskListData.forEach(function ([index, value]) {
    const html = createHTML(value, index);

    taskLists.insertAdjacentHTML("afterbegin", html);
  });

  //* Add event listener to delete element from the DOM
  taskLists.querySelectorAll(".fa-trash-alt").forEach(function (value) {
    value.addEventListener("click", function () {
      const taskClass = this.classList[this.classList.length - 1];
      deleteTask(taskClass.slice(taskClass.lastIndexOf("-") + 1));
      this.parentElement.parentElement.remove();
    });
  });

  //* add event listener to edit element from the DOM
  taskLists.querySelectorAll(".fa-pen").forEach(function (value) {
    value.addEventListener("click", function () {
      const taskClass = this.classList[this.classList.length - 1];
      editTask(taskClass.slice(taskClass.lastIndexOf("-") + 1));
    });
  });
})();

//* when called takes the task list and add it to the input
const editTask = function (index) {
  //* set the update state
  isUpdate = true;

  taskInput.value = document
    .querySelector(`.task-edit-${index}`)
    .parentElement.parentElement.querySelector(
      ".task-list__left p"
    ).textContent;
  addTaskBtn.classList.toggle("close");
  updateTaskBtn.classList.toggle("close");
  updateTaskBtn.addEventListener("click", function () {
    addTask(true, index);
  });
};

//* When called update the task in the DOM as well as in the localstorage
const updateTask = function (index) {
  //* update the task object
  taskObj[String(index)] = taskInput.value;

  //* update task in the localstorage
  localStorage.setItem("task", JSON.stringify(taskObj));

  //* update the DOM
  document.querySelector(`.task-list-${index} .task-list__left p`).textContent =
    taskInput.value;
  addTaskBtn.classList.toggle("close");
  updateTaskBtn.classList.toggle("close");

  //*reset the update state once the update operation is done
  isUpdate = false;
};

//* add task to the DOM and to the localstorage
const addTask = function (hasIndex = false, index = 0) {
  //* check if task value is not empty
  if (taskInput?.value && !hasIndex) {
    //* add th?e task to the localstorage
    addTaskToLocalStorage(listIndex, "task", taskInput.value);

    //* add task to task list in the DOM
    const html = createHTML(taskInput?.value, listIndex);

    taskLists.insertAdjacentHTML("afterbegin", html);

    //* add event listener to delete element from the DOM
    taskLists
      .querySelector(`.task-delete-${listIndex}`)
      .addEventListener("click", function () {
        const taskClass = this.classList[this.classList.length - 1];
        deleteTask(taskClass.slice(taskClass.lastIndexOf("-") + 1));
        this.parentElement.parentElement.remove();
      });

    //* add event listener to edit element from the DOM
    taskLists
      .querySelector(`.task-edit-${listIndex}`)
      .addEventListener("click", function () {
        const taskClass = this.classList[this.classList.length - 1];
        editTask(taskClass.slice(taskClass.lastIndexOf("-") + 1));
      });
    listIndex++;
  } else if (hasIndex && taskInput?.value) {
    updateTask(index);
  }

  //* clear the task input
  clearTask();
};

//*when called, clear task input
const clearTask = function () {
  taskInput.value = "";
};

//* when called delete task from the localstorage
const deleteTask = function (index) {
  removeTaskFromLocalStorage("task", Number(index));
};

//* Event Handler
//* add task
addTaskBtn.addEventListener("click", function () {
  addTask();
});
//* clear task input
clearTaskBtn.addEventListener("click", clearTask);

//* called when the user click on the enter key to add task
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter" && !isUpdate) {
    addTask();
  }
});
