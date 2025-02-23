document.addEventListener("DOMContentLoaded", function(){
    const burgerMenu=document.getElementById("burgerMenu");
    const navMenu=document.getElementById("navMenu");
    const taskList=document.getElementById("taskList");
    const filterAll=document.getElementById("filterAll");
    const filterActive=document.getElementById("filterActive");
    const filterCompleted=document.getElementById("filterCompleted");
    const searchInput=document.getElementById("searchInput");
    const themeToggle=document.getElementById("themeToggle");
    const body=document.body;

    burgerMenu.addEventListener("click", function(){
        navMenu.classList.toggle("active"); //добавляем/удаляем класс active, который делает меню видимым
        burgerMenu.textContent = navMenu.classList.contains("active") ? "✖" : "☰";
        
    })

    //закрывает меню при нажатии за его пределами
    document.addEventListener("click", function(event){
        if(!navMenu.contains(event.target) && !burgerMenu.contains(event.target)){
            navMenu.classList.remove("active");
        }
    })

    //загружаем задачи с api
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
    .then(response=>response.json())
    .then(data=>{
        data.forEach(task=>{
            const li= document.createElement("li");
            li.innerHTML=`${task.title} <button class="deleteBtn">❌</button>`;
            taskList.appendChild(li);
        });
    })
    .catch(error=>console.error("Ошибка загрузки:", error));
    
    // фильтрация задач
    function filterTasks(filterType){
        const tasks=document.querySelectorAll("li");

        tasks.forEach(task => {
            const isCompleted=task.classList.contains("completed");

            if(filterType=="all"){
                task.style.display="flex";
            }else if(filterType=="active" && !isCompleted){
                task.style.display="flex";
            }else if(filterType=="completed" && isCompleted){
                task.style.display="flex";
            }else{
                task.style.display="none";
            }
        });

        // обновляем активное состояние кнопок
        document.querySelectorAll(".filter-btn").forEach(btn=>btn.classList.remove("active"));
        document.getElementById(`filter${filterType.charAt(0).toUpperCase()+filterType.slice(1)}`).classList.add("active");

    }
    filterAll.addEventListener("click", ()=> filterTasks("all"));
    filterActive.addEventListener("click", ()=> filterTasks("active"));
    filterCompleted.addEventListener("click", ()=> filterTasks("completed"));

    // поиск задач
    searchInput.addEventListener("input", function(){
        const searchText=searchInput.value.toLowerCase();
        const tasks=taskList.querySelectorAll("li");

        tasks.forEach(task=>{
            const taskText=task.textContent.toLowerCase();

            task.style.display=taskText.includes(searchText)?"flex":"none";
        })
    })

    // проверяем сохранена ли тема в localStorage
    if(localStorage.getItem("theme")==="dark"){
        body.classList.add("dark-theme");
        themeToggle.textContent="☀️ Светлая тема";
    }

    themeToggle.addEventListener("click", function(){
        body.classList.toggle("dark-theme");

        if(body.classList.contains("dark-theme")){
            localStorage.setItem("theme", "dark");
            themeToggle.textContent="☀️ Светлая тема";
        }else{
            localStorage.setItem("theme", "light");
            themeToggle.textContent="🌙 Темная тема";
        }
    })

})

//функция для сохранения списка задач в локальной памяти
function saveTasks(){
    let tasks=[];
    document.querySelectorAll("#taskList li").forEach(li=>{
        tasks.push(li.firstChild.textContent.trim());
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//загрузка списка задач из локальной памяти при перезагрузке страницы
function loadTasks(){
    let tasks=JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(taskText=>{
        let li=document.createElement("li");
        
        li.innerHTML=`${taskText} <button class="deleteBtn">❌</button>`;
        document.getElementById("taskList").appendChild(li);
        
    });
}

//динамический список задач
document.getElementById("addTask").addEventListener("click", function(){
    let input= document.getElementById("taskInput");
    let taskText= input.value.trim();
    if(!taskText) return alert("Введите задачу!");

    fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        body: JSON.stringify({ title: taskText, completed: false }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        const li = document.createElement("li");
        li.innerHTML = `${data.title} <button class="deleteBtn">❌</button>`;
        document.getElementById("taskList").appendChild(li);
        document.getElementById("taskInput").value = ""; // Очистка поля
    })
    .catch(error => console.error("Ошибка добавления:", error));
    
});

//делегирование событий на родительский элемент
document.getElementById("taskList").addEventListener("click", function(event){
    if(event.target.tagName=="BUTTON"){
        const li=event.target.parentElement;
        const taskID=li.getAttribute("data-id"); //получаем ID задачи

        li.classList.add("fade-out");
        setTimeout(() => {
            fetch(`https://jsonplaceholder.typicode.com/todos/${taskID}`, {
                method: "DELETE",
            })
            .then(response => {
                if (response.ok) {
                    li.remove(); // Удаляем из DOM
                } else {
                    console.error("Ошибка удаления");
                }
            })
            .catch(error => console.error("Ошибка:", error));        
        }, 300);
        
    
        // event.target.parentElement.remove();
        saveTasks();
    }
    
    //отметка выполненных задач 
    if (event.target.tagName === "LI"){
        event.target.classList.toggle("completed");
        saveTasks();
    }
})

document.getElementById("taskList").addEventListener("dblclick", function(event){
    if(event.target.tagName === "LI"){
        let oldText = event.target.textContent.replace(" ❌", "").trim();
        let input = document.createElement("input");
        input.type="text";
        input.value=oldText;
        event.target.innerHTML="";
        event.target.appendChild(input);
        input.focus();

        input.addEventListener("blur",saveEdit);
        input.addEventListener("keydown", function(e){
            if(e.key ==="Enter") saveEdit();
        });

        function saveEdit(){
            let newText = input.value.trim();
            if(newText !==""){
                event.target.innerHTML = `${newText} <button class="deleteBtn"> ❌</button>`;
                saveTasks();
            }else{
                event.target.remove(); //удаляет пустую задачу
            }
        }
    }
});

window.addEventListener("load", loadTasks);