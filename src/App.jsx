import AppRoutes from "./routes/AppRoutes";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtnuNj9r_fq41M7a1Wmudo6oL8ZrNgMjA",
  authDomain: "web-3650d.firebaseapp.com",
  projectId: "web-3650d",
  storageBucket: "web-3650d.appspot.com",
  messagingSenderId: "800773982761",
  appId: "1:800773982761:web:7d83c993b48c6f792aea38",
  measurementId: "G-MKPL9R976H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
function App() {
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
