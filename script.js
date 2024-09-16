document.addEventListener("DOMContentLoaded", function() {
  let draggedTask = null;

  function addTask(taskText) {
    var todoList = document.getElementById("todoList");
    var newTask = document.createElement("li");
    newTask.draggable = true;
    newTask.addEventListener('dragstart', () => {
      draggedTask = newTask;
      newTask.classList.add('dragging');
    });
    newTask.addEventListener('dragend', () => {
      newTask.classList.remove('dragging');
      draggedTask = null;
    });

    var taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.className = "taskCheckbox";
    taskCheckbox.addEventListener("change", function() {
      if (this.checked) {
        newTask.classList.add('checked');
      } else {
        newTask.classList.remove('checked');
      }
    });

    var taskLabel = document.createElement("label");
    taskLabel.appendChild(taskCheckbox);
    taskLabel.appendChild(document.createTextNode(taskText));
    newTask.appendChild(taskLabel);

    var deleteButton = document.createElement("button");
    deleteButton.className = "deleteBtn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
      deleteTask(newTask);
    });
    newTask.appendChild(deleteButton);

    todoList.insertBefore(newTask, todoList.firstChild);
  }

  function deleteTask(task) {
    var todoList = document.getElementById("todoList");
    todoList.removeChild(task);
  }

  document.getElementById("add").addEventListener("click", function() {
    var taskInput = document.getElementById("newTodo");
    var taskText = taskInput.value.trim();
    if (taskText !== "") {
      addTask(taskText);
      taskInput.value = "";
    } else {
      alert("Please enter a task!");
    }
  });

  document.getElementById("todoList").addEventListener("dragover", function(event) {
    event.preventDefault();
    const afterTask = getAfterTask(event.clientY);
    const parent = document.getElementById("todoList");
    if (afterTask === null) {
      parent.appendChild(draggedTask);
    } else {
      parent.insertBefore(draggedTask, afterTask);
    }
  });

  document.getElementById("todoList").addEventListener('drop', function(event) {
    event.preventDefault();
    const parent = document.getElementById("todoList");
    const target = event.target.closest('li');
    if (target) {
      parent.insertBefore(draggedTask, target);
    } else {
      parent.appendChild(draggedTask);
    }
  });

  function getAfterTask(y) {
    const tasks = [...document.querySelectorAll('#todoList li:not(.dragging)')];
    return tasks.reduce((closest, task) => {
      const box = task.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, task: task };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).task;
  }
});
