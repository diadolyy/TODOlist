document.addEventListener("DOMContentLoaded", function(){
    const burgerMenu=document.getElementById("burgerMenu");
    const navMenu=document.getElementById("navMenu");

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

    

})

//изменяем текст по нажатию кнопки-переключателя с плавной анимацией
document.getElementById("changeText").addEventListener("click", function(){
    let text=document.getElementById("text");
    text.style.opacity="0";
    setTimeout(() => {
        text.textContent=text.textContent ==="Это обычный текст."
        ? "Текст изменился!"
        : "Это обычный текст."
        text.style.opacity="1";
    }, 300);
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
        
        li.innerHTML='${taskText} <button class="deleteBtn">❌</button>';
        document.getElementById("taskList").appendChild(li);
        
    });
}

//динамический список задач
document.getElementById("addTask").addEventListener("click", function(){
    let input= document.getElementById("taskInput");
    let taskText= input.value.trim();

    if(taskText !== ""){
        let li= document.createElement("li");
        li.innerHTML= `${taskText} <button class="deleteBtn">❌</button>`; //добавляет кнопку закрытия
        document.getElementById("taskList").appendChild(li);
        input.value ="";
        saveTasks();
    }
});

//делегирование событий на родительский элемент
document.getElementById("taskList").addEventListener("click", function(event){
    if(event.target.tagName=="BUTTON"){
        event.target.parentElement.remove();
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

document.getElementById("contactForm").addEventListener("submit", function(event){
    event.preventDefault(); //останавливает отправку формы по умолчанию

    // const name=document.getElementById("name").value;
    // const email=document.getElementById("email").value;
    // const message=document.getElementById("message").value;

    const form=document.getElementById("contactForm");
    const inputs=form.querySelectorAll("input, textarea");

    let isValid=true;
    
    // Простая валидация
    // if (name === "") {
    //     document.getElementById("name").classList.add("error");
    //     isValid = false;
    // } else {
    //     document.getElementById("name").classList.remove("error");
    // }

    // if (email === "") {
    //     document.getElementById("email").classList.add("error");
    //     isValid = false;
    // } else {
    //     document.getElementById("email").classList.remove("error");
    // }

    // if (message === "") {
    //     document.getElementById("message").classList.add("error");
    //     isValid = false;
    // } else {
    //     document.getElementById("message").classList.remove("error");
    // }

    inputs.forEach(inout=>{
        if(input.value.trim()===""){
            input.classList.add("error");
            isValid=false;
        }else{
            input.classList.remove("error");
        }
    });

    if (!isValid) {
        alert("Все поля должны быть заполнены!");
        return;
    }

    //вывод данных в консоль
    console.log(`Имя: ${name}, Email: ${email}, Сообщение: ${message}`);

    inputs.forEach(input=>{
        input.addEventListener("input", function(){
            if(input.value.trim()!==""){
                input.classList.remove("error");
            }
        })
    })
})

window.addEventListener("load", loadTasks);