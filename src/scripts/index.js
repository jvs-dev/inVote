import { alterToSection } from "./functions/alterSection"
import { loadSurvey } from "./functions/survey"
import { signIn, verifyUserLogin } from "./functions/user"

let footer = document.getElementById("footer")
let introSection = document.getElementById("introSection")
let header = document.getElementById("header")
let newInVote = document.getElementById("newInVote")
let perfilBtn = document.getElementById("perfilBtn")
let shareSectionLink = document.getElementById("shareSectionLink");
let copyLink = document.getElementById("copyLink")
let viewInvoteSection = document.getElementById("viewInvoteSection")
let homeSection = document.getElementById("homeSection")
let goToDashboard = document.getElementById("goToDashboard")
let InVolteLogo = document.getElementById("InVolteLogo")


InVolteLogo.onclick = function () {
    alterToSection(document.getElementById("homeSection"))
}

goToDashboard.onclick = function () {
    verifyUserLogin().then(user => {
        if (user != undefined) {
            alterToSection(document.getElementById("dashboardSection"))
        } else {
            signIn().then(response => {
                if (response != undefined) {
                    alterToSection(document.getElementById("dashboardSection"))
                }
            })
        }
    })
}

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
        if (localStorage.getItem(`${window.location.hash.replace("#", "")}`) != null) {
            let obj = JSON.parse(localStorage.getItem(`${window.location.hash.replace("#", "")}`))
            footer.classList.remove("active")
            introSection.classList.remove("active")
            homeSection.style.display = "none"
            perfilBtn.style.display = "none"
            document.getElementById("respondedName").textContent = `${obj.name}`
            document.getElementById("respondedItem").textContent = `${obj.itemName}`
            alterToSection(document.getElementById("respondedForm"))
        } else {
            loadSurvey(window.location.hash.replace("#", "")).then(res => {
                if (res != undefined) {
                    header.classList.remove("active")
                    footer.classList.remove("active")
                    introSection.classList.remove("active")
                    homeSection.style.display = "none"
                    viewInvoteSection.classList.add("active")
                } else {
                    window.location.href=`${window.location.origin}`
                }
            })
        }
    }
}

loadPage()