document.addEventListener("DOMContentLoaded", function(){
    const burgerMenu=document.getElementById("bureger-menu");
    const navMenu=document.getElementById("nav-menu");

    burgerMenu.addEventListener("click", function(){
        navMenu.classList.toggle("active"); //добавляем/удаляем класс active, который делает меню видимым
    })
})