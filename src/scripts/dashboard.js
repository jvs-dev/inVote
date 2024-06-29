import { alterToSection } from "./functions/alterSection"
import { getMySurveys, getSurveyData } from "./functions/survey"
import { verifyUserLogin } from "./functions/user"
let reCopyLink = document.getElementById("reCopyLink")

reCopyLink.addEventListener("click", function () {
    let tempInput = document.createElement("input");
    let textToCopy = document.getElementById("inVoteDataLink").textContent
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    reCopyLink.style.background = "rgb(3, 209, 0)"
    reCopyLink.innerHTML = `<ion-icon name="checkmark-circle-outline"></ion-icon>`
    setTimeout(() => {
        reCopyLink.style.background = ""
        reCopyLink.innerHTML = `<ion-icon name="copy-outline"></ion-icon>`
    }, 2000);
});


function loadDashboard() {
    let dashboardSection = document.getElementById("dashboardSection")
    let inVoteDataDiv = document.getElementById("inVoteDataDiv")
    verifyUserLogin().then(user => {
        if (user != undefined) {
            getMySurveys(user.email).then(res => {
                res.forEach(element => {
                    let article = document.createElement("article")
                    dashboardSection.insertAdjacentElement("beforeend", article)
                    article.classList.add("dashboard__article")
                    article.innerHTML = `
                        <p class="dashboard__p">${element[1].surveyTitle == "" ? "Sem Titulo" : element[1].surveyTitle}</p>
                        <span class="dashboard__span">${element[1].votes} votos</span>
                    `
                    article.onclick = function () {
                        document.getElementById("inVoteDataLink").textContent = `http://localhost:5173/#${element[0]}`
                        alterToSection(document.getElementById("inVoteDataSection"))
                        getSurveyData(element[0]).then(answerData => {
                            answerData.forEach(answer => {
                                let card = document.createElement("card")
                                inVoteDataDiv.insertAdjacentElement("beforeend", card)
                                card.classList.add("inVoteData__article")
                                card.innerHTML = `
                                    <div class="inVoteData__article__div">
                                        <p class="inVoteData__article__title">${answer.title}</p>
                                        ${answer.answered.map(item => `<span class="inVoteData__article__name">${item}</span>`)}                                                                                
                                    </div>
                                    <p class="inVoteData__article__votes">${answer.selected} votos</p>
                                `
                            });
                        })
                    }
                });
            })
        }
    })
}
loadDashboard()