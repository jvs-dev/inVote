import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, increment, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig";
import { verifyUserLogin } from "./user";
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