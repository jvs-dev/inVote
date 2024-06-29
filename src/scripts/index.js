import { alterToSection } from "./functions/alterSection"
import { signIn, verifyUserLogin } from "./functions/user"

let footer = document.getElementById("footer")
let introSection = document.getElementById("introSection")
let header = document.getElementById("header")
let newInVote = document.getElementById("newInVote")
let perfilBtn = document.getElementById("perfilBtn")
let shareSectionLink = document.getElementById("shareSectionLink");
let copyLink = document.getElementById("copyLink")

copyLink.onclick = function () {
    let tempInput = document.createElement("input");
    tempInput.value = shareSectionLink.textContent;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    copyLink.style.background = "rgb(3 209 0)"
    copyLink.innerHTML = `<ion-icon name="checkmark-circle-outline"></ion-icon>`
    setTimeout(() => {
        copyLink.style.background = ""
        copyLink.innerHTML = `<ion-icon name="copy-outline"></ion-icon>`
    }, 2000);
};

newInVote.onclick = function () {
    verifyUserLogin().then(user => {
        if (user != undefined) {
            alterToSection(document.getElementById("createSection"))
            footer.classList.remove("active")
        } else {
            signIn().then(response => {
                if (response != undefined) {
                    alterToSection(document.getElementById("createSection"))
                    footer.classList.remove("active")
                }
            })
        }
    })
}

function loadPage() {
    if (window.location.hash == "") {
        window.addEventListener("load", () => {
            setTimeout(() => {
                introSection.classList.add("loaded")
                setTimeout(() => {
                    introSection.classList.remove("active")
                    verifyUserLogin().then(user => {
                        if (user != undefined) {
                            perfilBtn.children[0].src = user.photoURL
                        }
                    })
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