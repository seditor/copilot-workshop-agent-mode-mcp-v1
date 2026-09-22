// ===== 我的待辦清單 =====
// 使用原生 JavaScript，並將資料保存到瀏覽器的 localStorage。

const STORAGE_KEY = "offline-todos";
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const remainingCount = document.getElementById("remaining-count");

let todos = loadTodos();

// 從 localStorage 讀取資料；資料格式不正確時使用空清單。
function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch (error) {
    return [];
  }
}

// 將目前的待辦清單寫回 localStorage。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 產生待辦事項識別碼。
function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 重新繪製待辦清單與統計數字。
function render() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = todo.completed ? "todo-item completed" : "todo-item";
    item.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `完成「${todo.text}」`);

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = todos.length > 0;
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
}

// 新增一筆非空白的待辦事項。
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  todos.push({ id: createId(), text, completed: false });
  saveTodos();
  render();
  input.value = "";
  input.focus();
});

// 用事件委派處理勾選與刪除，避免逐筆綁定事件。
list.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");
  if (!item) return;

  const todo = todos.find((currentTodo) => currentTodo.id === item.dataset.id);
  if (!todo) return;

  if (event.target.matches("input[type=checkbox]")) {
    todo.completed = event.target.checked;
  } else if (event.target.matches(".delete-button")) {
    todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
  } else {
    return;
  }

  saveTodos();
  render();
});

render();
