document.addEventListener("DOMContentLoaded", function(){
    const burgerMenu=document.getElementById("bureger-menu");
    const navMenu=document.getElementById("nav-menu");

    burgerMenu.addEventListener("click", function(){
        navMenu.classList.toggle("active"); //добавляем/удаляем класс active, который делает меню видимым
    })
})

//закрывает меню при нажатии за его пределами
document.addEventListener("click", function(event){
    if(!navMenu.contains(event.target) && !burgerMenu.contains(event.target)){
        navMenu.classList.remove("active");
    }
})

//меняет значок при открытии меню
burgerMenu.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    burgerMenu.textContent = navMenu.classList.contains("active") ? "✖" : "☰";
});
