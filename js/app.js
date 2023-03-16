const form = document.getElementById('newTodoForm');
const inputForm = document.getElementById('content')
const todoItem = document.querySelector('.todoItem');
const todoList = document.getElementById('todoList')

let todos = []
let username = localStorage.getItem('USERNAME') || '';

const nameInput = document.getElementById('name');
nameInput.value = username;
nameInput.addEventListener('change', (e) => {
    localStorage.setItem('USERNAME', e.target.value);
})


document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('TODOS')) {
        todos = JSON.parse(localStorage.getItem('TODOS'))
    }
    displayTodos();
})

form.addEventListener('submit', e => {
    e.preventDefault()
    /* console.log(e.target[0].value); */
    setTodo(e)
})

const setTodo = e => {
    if (inputForm.value.trim() === '') {
        showMessage("You can't leave the field empty", "error");
    } else if (!document.querySelector('input[name="category"]:checked')) {
        showMessage("Please pick a category", "error");
    } else {
        const todo = {
            id: Date.now(),
            content: e.target.content.value,
            category: e.target.category.value,
            done: false
        }

        todos.push(todo)
        localStorage.setItem('TODOS', JSON.stringify(todos));

        form.reset(); //resetea el formulario
        inputForm.focus(); //evita que al agregar una tarea saque el autofocus
        displayTodos();
    }
}

const displayTodos = () => {

    todoList.innerHTML = ''
    todos.forEach(todo => {

        const { content, category } = todo;
        const todoItem = document.createElement('div')
        todoItem.setAttribute('class', 'todoItem')

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const todoContent = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');

        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');

        (category == 'personal')
            ? span.classList.add('personal')
            : span.classList.add('business');

        todoContent.classList.add('todoContent');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        todoContent.innerHTML = `<input type="text" value="${content}" readonly>`;
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(todoContent);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);

        if (todo.done) {
            todoItem.classList.add('done');
        }

        input.addEventListener('change', (e) => {
            todo.done = e.target.checked;
            localStorage.setItem('TODOS', JSON.stringify(todos));

            (todo.done)
                ? todoItem.classList.add('done')
                : todoItem.classList.remove('done');

            displayTodos()

        })

        edit.addEventListener('click', () => {
			const input = todoContent.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('TODOS', JSON.stringify(todos));
				displayTodos()

			})
		})

		deleteButton.addEventListener('click', () => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('TODOS', JSON.stringify(todos));
			displayTodos()
		})

    })
}

const showMessage = (message, type) => {
    Toastify({
        text: message,
        duration: 2500,
        gravity: 'bottom',
        position: 'right',
        stopOnFocus: true,
        className: type,
    }).showToast();
}
