let footer = document.getElementById("footer")
let introSection = document.getElementById("introSection")
let header = document.getElementById("header")

function loadPage() {
    if (window.location.hash == "") {
        window.addEventListener("load", () => {
            setTimeout(() => {
                introSection.classList.add("loaded")                
                setTimeout(() => {
                    introSection.classList.remove("active")                
                }, 500);
            }, 1000);
        })
    } else {
        header.classList.remove("active")
        footer.classList.remove("active")
        introSection.classList.remove("active")
    }
}

loadPage()