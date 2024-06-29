import { shareSection } from "./functions/alterSection"
import { createSurveyData } from "./functions/survey"

let addSurveyItem = document.getElementById("addSurveyItem")
let createSurvey = document.getElementById("createSurvey")
let surveyItensDiv = document.getElementById("surveyItensDiv")
let surveyTitleInput = document.getElementById("surveyTitleInput")
let actualItens = [{ max: 3, selected: 0, title: "", description: "", answered: [] }]

function loadSurveyItens() {
    surveyItensDiv.innerHTML = ""
    let iteMIndex = 1
    actualItens.forEach((element, index) => {
        let article = document.createElement("article")
        let inputTitle = document.createElement("input")
        inputTitle.classList.add("cardSurveyItem__input--1")
        inputTitle.type = "text"
        inputTitle.placeholder = "Titulo do item"
        inputTitle.value = `${element.title}`
        let inputDescription = document.createElement("input")
        inputDescription.classList.add("cardSurveyItem__input--2")
        inputDescription.type = "text"
        inputDescription.placeholder = "Descrição do item"
        inputDescription.value = `${element.description}`
        let inputMax = document.createElement("input")
        inputMax.classList.add("cardSurveyItem__input--3")
        inputMax.type = "number"
        inputMax.value = `${element.max}`
        let removeAnswer = document.createElement("button")
        removeAnswer.classList.add("cardSurveyItem__ButtonTrash")
        removeAnswer.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`
        surveyItensDiv.insertAdjacentElement("beforeend", article)
        article.classList.add("create__cardSurveyItem")
        article.innerHTML = `
            <span class="cardSurveyItem__span">#Item ${iteMIndex}</span>            
            <div class="cardSurveyItem__div">                
                <div class="cardSurveyItem__div--2">
                    <p class="cardSurveyItem__p">Máx.</p>                    
                </div>
            </div>            
        `
        article.children[0].insertAdjacentElement("afterend", inputTitle)
        article.children[2].insertAdjacentElement("afterbegin", inputDescription)
        article.children[2].children[1].insertAdjacentElement("beforeend", inputMax)
        article.insertAdjacentElement("beforeend", removeAnswer)
        removeAnswer.onclick = function () {
            actualItens.splice(index, 1);
            loadSurveyItens()            
        }
        inputTitle.oninput = function (evt) {
            element.title = `${evt.target.value}`
        }
        inputDescription.oninput = function (evt) {
            element.description = `${evt.target.value}`
        }
        inputMax.oninput = function (evt) {
            element.max = Number(`${evt.target.value}`)
        }
        iteMIndex++
    });
}

createSurvey.onclick = function () {
    createSurveyData(surveyTitleInput.value, actualItens).then(docId => {
        shareSection(`http://localhost:5173/#${docId}`)
    })
}

addSurveyItem.onclick = function () {
    actualItens.push({ max: 3, selected: 0, title: "", description: "", answered: [] })
    loadSurveyItens()
}

loadSurveyItens()
