const todoForm  = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm  = document.querySelector("#edit-form");
const editInput  = document.querySelector("#edit-input");
const cancelBtn = document.querySelector("#cancel-btn");
const searchInput = document.querySelector("#search-input");
const eraserBtn = document.querySelector("#eraser-btn");
const filterBtn = document.querySelector("#filter-select");
const colorPicker = document.querySelector(".color-picker");


let oldInputValue;


const saveTodo = (text, done = 0, save = 1) => {


    const currectTasks = document.querySelectorAll(".todo").length;

    if(currectTasks >= 12) {
        alert("Você atingiu o limite máximo de tarefas!")
        return;
    }
    const todo = document.createElement('div')
    todo.classList.add("todo")
    
    const todoTitle = document.createElement("h3")
    todoTitle.classList.add("title")
    todoTitle.innerText = text
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)
    
    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const trashBtn = document.createElement("button")
    trashBtn.classList.add("remove-todo")
    trashBtn.innerHTML = '<i class="fa-solid fa-trash"></i>'
    todo.appendChild(trashBtn)

    // data localStorage

    if(done){
        todo.classList.add("done")
    }

    if(save){
        saveTodosLocalStorage({text, done : 0})
    }

    todoList.append(todo)

    todoInput.value="";

    todoInput.focus();
}

const getSearchTodos = (search) =>{
    
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();

        todo.style.display = "flex";

        if(!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none";
        }
    })
}

const filterTodos = (filterValue) => {

    const todos = document.querySelectorAll(".todo");

    switch(filterValue) 
    {
        case "all":
            todos.forEach((todo) => todo.style.display = "flex");;
            break;

        case "do":
            todos.forEach((todo) => todo.classList.contains("done") ? todo.style.display = "flex " : todo.style.display = "none");
            break;

        case "todo":
            todos.forEach((todo) => !todo.classList.contains("done") ? todo.style.display = "flex" :  todo.style.display = "none");
    
        default:
            break;   
   }



}

const hideElement = () =>{
    todoForm.classList.add("hide");
    todoList.classList.add("hide");
};

const backElements = () =>{
    todoForm.classList.remove("hide");
    todoList.classList.remove("hide");
};

const updateTodo = (newText) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let titleElement = todo.querySelector("h3");

        if (titleElement.innerText === oldInputValue) {
            titleElement.innerText = newText; // Atualiza o título no DOM
            updateTodoLocalStorage(oldInputValue, newText); // Atualiza no localStorage
            console.log(`Atualizado para: ${newText}`);
        }else {
        console.log("Elemento <h3> não encontrado dentro de .todo");
        }
    });
};

//Events

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;
    
    if (inputValue.length <= 20) 
    {
        saveTodo(inputValue);
    }else{
        alert("Insira uma tarefa no máximo de 20 caracteres")
    }
})

document.addEventListener("click", (e) => {

    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;

        console.log(todoTitle)
    }

    if(targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");

        updateTodoStatusLocalStorage(todoTitle)
    }

    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove();

        removeTodoLocalStorare(todoTitle);
    }

    if(targetEl.classList.contains("edit-todo")) {
        hideElement();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;

    }
})

editForm.addEventListener("submit", (e) => {
    
    e.preventDefault()

    const editInputValue = editInput.value

    if(editInputValue.length <= 20) {
        updateTodo(editInputValue)
    }else{
        alert("Altere nome da sua tarefa para no máximo de 20 caracteres")
    }

    backElements();
    editInput.value = "";
})

cancelBtn.addEventListener("click", (e) => {

    e.preventDefault();

    backElements();

})

searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value

    getSearchTodos(search);

})

eraserBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"))
})

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue)
})

// Backgroud color

colorPicker.addEventListener("change", (e) => {
    const selectedColor = e.target.value;
    document.body.style.backgroundColor = selectedColor;

    localStorage.setItem("backgroundColor", selectedColor)
})
setTimeout (() => {
window.addEventListener("load", () => {
    const savedColor = localStorage.getItem("backgroundColor")
    if(savedColor){
        document.body.style.backgroundColor = savedColor;
        colorPicker.value = savedColor;
    }
})
},"1");



//local storage

const getTodosLocalStorage = () => {

    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
}


const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) =>{
        saveTodo(todo.text, todo.done, 0)
    })
}

const removeTodoLocalStorare = (todoText) => {

    const todos = getTodosLocalStorage()

    const filteredTodos = todos.filter((todo) =>todo.text !== todoText)

    localStorage.setItem("todos", JSON.stringify(filteredTodos))


}

const updateTodoStatusLocalStorage = (todoText) => {

    const todos = getTodosLocalStorage()

    todos.map((todo) =>todo.text === todoText ? todo.done = !todo.done : null)

    localStorage.setItem("todos", JSON.stringify(todos))


}

const updateTodoLocalStorage = (todoOldText, todoNewText) => {

    const todos = getTodosLocalStorage()

    todos.map((todo) =>
        todo.text === todoOldText ? (todo.text = todoNewText) : null);

    localStorage.setItem("todos", JSON.stringify(todos))


}

const saveTodosLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos))
}

loadTodos();