const sidebar = document.querySelector(".sidebar");
const sidebarToggletBtn = document.querySelector("#sidebar-toggle")

sidebarToggletBtn.addEventListener("click" , () => {
        sidebar.classList.toggle("collapsed")
    }
)