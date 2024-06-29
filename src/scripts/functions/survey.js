import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, increment, deleteDoc, serverTimestamp, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig";
import { verifyUserLogin } from "./user";
import { createError } from "./error";
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export async function createSurveyData(surveyTitle, surveyAnswers) {
    return new Promise(async (resolve) => {
        verifyUserLogin().then(async (user) => {
            const docRef = await addDoc(collection(db, "surveys"), {
                surveyTitle: `${surveyTitle}`,
                creator: `${user.email}`,
                votes: 0
            });
            surveyAnswers.forEach(async (element) => {
                let subDocRef = await addDoc(collection(db, "surveys", `${docRef.id}`, "surveyItens"), {
                    title: `${element.title}`,
                    description: `${element.description}`,
                    max: element.max,
                    selected: 0,
                    answered: []
                });
            });
            resolve(docRef.id)
        })
    })
}

export async function registerResponse(name, inVoteId, awnserid, itemName) {
    const washingtonRef = doc(db, "surveys", `${inVoteId}`);
    await updateDoc(washingtonRef, {
        votes: increment(1)
    });
    const subDocRef = doc(db, "surveys", `${inVoteId}`, "surveyItens", `${awnserid}`);
    await updateDoc(subDocRef, {
        selected: increment(1),
        answered: arrayUnion(`${name}`)
    });
    localStorage.setItem(`${inVoteId}`, `{"name": "${name}", "itemName": "${itemName}"}`)
    window.location.reload()
}

export async function loadSurvey(id) {
    return new Promise(async (resolve) => {
        let confirmInVote = document.getElementById("confirmInVote")
        let voterName = document.getElementById("voterName")
        let itemSelected = false
        let itemSelectedId = ""
        let itemSelectedName = ""
        const docRef = doc(db, "surveys", `${id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const querySnapshot = await getDocs(collection(db, "surveys", `${id}`, "surveyItens"));
            querySnapshot.forEach((awnser) => {
                let viewInvoteDiv = document.getElementById("viewInvoteDiv")
                let article = document.createElement("article")
                let selectBtn = document.createElement("button")
                viewInvoteDiv.insertAdjacentElement("beforeend", article)
                article.classList.add("viewInvote__article")
                if (awnser.data().max == awnser.data().selected) {
                    article.innerHTML = `
                    <div class="viewInvote__article__div">
                        <p class="viewInvote__article__p disabled">${awnser.data().title}</p>
                        <span class="viewInvote__article__span disabled">indisponível</span>
                    </div>`
                } else {
                    article.innerHTML = `
                    <div class="viewInvote__article__div">
                        <p class="viewInvote__article__p">${awnser.data().title}</p>
                        <span class="viewInvote__article__span">${awnser.data().description}</span>
                    </div>`
                    article.insertAdjacentElement("beforeend", selectBtn)
                    selectBtn.classList.add("viewInvote__article__button")
                    selectBtn.onclick = function () {
                        if (itemSelected == true && selectBtn.classList.contains("active")) {
                            selectBtn.classList.remove("active")
                            selectBtn.innerHTML = ``
                            itemSelectedId = ``
                            itemSelectedName = ""
                            itemSelected = false
                        } else if (itemSelected == false) {
                            selectBtn.classList.add("active")
                            selectBtn.innerHTML = `<ion-icon name="checkmark-outline"></ion-icon>`
                            itemSelectedId = `${awnser.id}`
                            itemSelectedName = `${awnser.data().title}`
                            itemSelected = true
                            console.log(itemSelectedId);
                        }
                    }
                    resolve("sucess")
                }
            });
            confirmInVote.onclick = function () {
                if (voterName.value != "" && itemSelectedId != "" && itemSelected == true) {
                    registerResponse(voterName.value, `${id}`, itemSelectedId, itemSelectedName)
                    confirmInVote.onclick = function () { }
                } else {
                    createError("Coloque seu nome e selecione uma opção")
                }
            }
        } else {
            resolve(undefined)
        }
    })
}