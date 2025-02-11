//# static/script.js
async function loadTodos() {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${todo.title}
            <div>
                <button onclick="completeTodo('${todo.title}')" ${todo.completed ? 'disabled' : ''}>
                    完了
                </button>
                <button onclick="deleteTodo('${todo.title}')">削除</button>
            </div>
        `;
        if (todo.completed) {
            li.style.textDecoration = 'line-through';
        }
        todoList.appendChild(li);
    });
}

async function addTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();
    
    if (title) {
        await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        input.value = '';
        loadTodos();
    }
}

async function completeTodo(title) {
    await fetch(`/api/todos/${title}`, {
        method: 'PUT'
    });
    loadTodos();
}

async function deleteTodo(title) {
    await fetch(`/api/todos/${title}`, {
        method: 'DELETE'
    });
    loadTodos();
}

document.addEventListener('DOMContentLoaded', loadTodos);