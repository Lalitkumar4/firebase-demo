import { initializeApp } from "firebase/app"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
}

// init firebase app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const collectionRef = collection(db, "books")

// queries
const q = query(collectionRef, orderBy("createdAt"))

// real time collection data
const unsubColl = onSnapshot(q, (snapshot) => {
  let books = []

  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id })
  })

  console.log(books)
})

// adding document
const addBookForm = document.querySelector(".add")
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault()

  addDoc(collectionRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset()
  })
})

// deleting document
const deleteBookForm = document.querySelector(".delete")
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const docRef = doc(db, "books", deleteBookForm.id.value)

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset()
  })
})

// get a single document
const docRef = doc(db, "books", "YlJsOxraFgpsJLEdPoSg")

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})

// updating a document
const updateForm = document.querySelector(".update")
updateForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const docRef = doc(db, "books", updateForm.id.value)

  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateForm.reset()
  })
})

// signing user up
const signupForm = document.querySelector(".signup")
signupForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then((credential) => {
      //   console.log("user created:", credential.user)
      signupForm.reset()
    })
    .catch((err) => {
      console.log(err.message)
    })
})

// logging in and out
const logoutButton = document.querySelector(".logout")
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      //   console.log("the user signed out")
    })
    .catch((err) => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector(".login")
loginForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then((credential) => {
      //   console.log("user logged in:", credential.user)
    })
    .catch((err) => {
      console.log(err.message)
    })
})

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user)
})

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub")
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing")
  unsubColl()
  unsubDoc()
  unsubAuth()
})
