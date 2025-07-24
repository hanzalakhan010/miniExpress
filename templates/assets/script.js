function menuBar() {
    const menu = document.getElementById("menu");
    console.log(menu.style.display)
    if (menu.style.display === "none" || !menu.style.display ) {
        menu.style.display = "block";
    }
    else {
        menu.style.display = "none";
    }
}