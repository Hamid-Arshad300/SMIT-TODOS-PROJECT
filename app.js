
import {getDocs,collection,db,addDoc,deleteDoc,doc,updateDoc} from "./firebaseConfig.js";


let todos = [];

let rendorElm = document.querySelector("#list-items");
let todoInput = document.querySelector("#taskInput");
let addBtn = document.querySelector("#addTaskButton");

let editingId = null;


// 1. LOCAL STORAGE

let addinLOcalastorage = () => {
    window.localStorage.setItem("todos", JSON.stringify(todos));
};


let getfromlocalstorage = () => {
    let data = window.localStorage.getItem("todos");

    if (data) {
        todos = JSON.parse(data);
    }
};


// 2. FETCH TODOS FROM FIREBASE

let fetchTodos = async () => {
    try {

        const querySnapshot = await getDocs(
            collection(db, "todos")
        );

        todos = [];

        querySnapshot.forEach((docSnap) => {

            todos.push({
                ...docSnap.data(),
                id: docSnap.id
            });

        });

        addinLOcalastorage();

        rendoritems();

    } catch (error) {

        console.error("Error fetching todos:", error);

        getfromlocalstorage();
        rendoritems();
    }
};


// 3. ADD TODO

let add = async () => {

    if (todoInput.value.trim() === "") {
        alert("Enter a task");
        return;
    }

    try {

        let todoObj = {
            text: todoInput.value.trim(),
            isCompleted: false
        };

        const docRef = await addDoc(
            collection(db, "todos"),
            todoObj
        );

        todos.push({
            ...todoObj,
            id: docRef.id
        });

        addinLOcalastorage();

        todoInput.value = "";

        rendoritems();

    } catch (error) {
        console.error("Error adding todo:", error);
    }
};


// 4. DELETE TODO

let del = async (item_id) => {

    try {

        await deleteDoc(doc(db, "todos", item_id));

        todos = todos.filter((item) => {
            return item.id !== item_id;
        });

        addinLOcalastorage();

        rendoritems();

    } catch (error) {
        console.error("Error deleting todo:", error);
    }
};


// 5. EDIT TODO

let editTodo = (item_id) => {

    todos.forEach((item) => {

        if (item.id === item_id) {
            todoInput.value = item.text;
        }

    });

    // Disable all todo buttons
    let allBtns = document.querySelectorAll("#list-items button");
    let clearAll = document.querySelector("#delAll");

    allBtns.forEach((btn) => {
        btn.disabled = true;
    });

    clearAll.disabled = true;

    editingId = item_id;

    addBtn.innerText = "Update";
};


// 6. UPDATE TODO

let updateTodo = async (item_id) => {

    if (todoInput.value.trim() === "") {
        alert("Enter a task");
        return;
    }

    try {

        await updateDoc(
            doc(db, "todos", item_id),
            {
                text: todoInput.value.trim()
            }
        );

        todos.forEach((item) => {

            if (item.id === item_id) {
                item.text = todoInput.value.trim();
            }

        });

        addinLOcalastorage();

        todoInput.value = "";

        // Enable all buttons again
        let allBtns = document.querySelectorAll("#list-items button");
        let clearAll = document.querySelector("#delAll");

        allBtns.forEach((btn) => {
            btn.disabled = false;
        });

        clearAll.disabled = false;

        editingId = null;

        addBtn.innerText = "Add";

        rendoritems();

    } catch (error) {
        console.error("Error updating todo:", error);
    }
};


// 7. DONE TODO

let doneTodo = async (id) => {

    try {

        await updateDoc(
            doc(db, "todos", id),
            {
                isCompleted: true
            }
        );

        todos.forEach((todoObj) => {

            if (todoObj.id === id) {
                todoObj.isCompleted = true;
            }

        });

        addinLOcalastorage();

        rendoritems();

    } catch (error) {
        console.error("Error completing todo:", error);
    }
};


// 8. DELETE ALL

let delAll = async () => {

    try {

        await Promise.all(
            todos.map((item) => {
                return deleteDoc(
                    doc(db, "todos", item.id)
                );
            })
        );

        todos = [];

        addinLOcalastorage();

        editingId = null;

        todoInput.value = "";

        addBtn.innerText = "Add";

        rendoritems();

    } catch (error) {
        console.error("Error deleting all todos:", error);
    }
};


// 9. RENDER TODOS
let rendoritems = () => {

    rendorElm.innerHTML = '';

    todos.forEach((item) => {

        let todoitems = document.createElement('div');

        todoitems.className = 'todo';

        if (item.isCompleted) {
            todoitems.className += ' done';
        }

        todoitems.innerHTML = `
            <div>
                <span>${item.text}</span>

                ${item.isCompleted
                    ? `<button class="id-btn del-btn">del</button>`
                    : `
                        <button class="id-btn edit-btn">edit</button>
                        <button class="id-btn done-btn">done</button>
                        <button class="id-btn del-btn">del</button>
                    `
                }
            </div>
        `;

        // Edit button
        let editBtn = todoitems.querySelector('.edit-btn');

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editTodo(item.id);
            });
        }

        // Done button
        let doneBtn = todoitems.querySelector('.done-btn');

        if (doneBtn) {
            doneBtn.addEventListener('click', () => {
                doneTodo(item.id);
            });
        }

        // Delete button
        let delBtn = todoitems.querySelector('.del-btn');

        delBtn.addEventListener('click', () => {
            del(item.id);
        });

        rendorElm.appendChild(todoitems);

    });

};

// 10. ADD / UPDATE BUTTON

addBtn.addEventListener("click", () => {

    if (editingId !== null) {

        updateTodo(editingId);

    } else {

        add();

    }

});


// 11. DELETE ALL BUTTON

document.querySelector("#delAll")
    .addEventListener("click", delAll);


// 12. INITIALIZATION

getfromlocalstorage();

rendoritems();

fetchTodos();
