// ================= EMAILJS INIT =================
emailjs.init("EbnheFts254TkMPfh");


// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7Q7qkX6hTOe1QhIr_yOgbDoBR_0HIMbY",
  authDomain: "login-page-8ae54.firebaseapp.com",
  projectId: "login-page-8ae54",
  storageBucket: "login-page-8ae54.firebasestorage.app",
  messagingSenderId: "73355822649",
  appId: "1:73355822649:web:ded812e0a006f1e5922fe8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ================= REGISTER =================
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const msg = document.getElementById("registerMessage");

  if (password !== confirmPassword) {
    msg.textContent = "Passwords do not match ❌";
    msg.className = "message error";
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {
      name,
      email,
      phone
    });

    msg.textContent = "Registration successful!";
    msg.className = "message success";

    document.getElementById("registerForm").reset();

  } catch (error) {
    let message = "";

    if (error.code === "auth/email-already-in-use") {
      message = "Email already exists";
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email format";
    } else if (error.code === "auth/weak-password") {
      message = "Password must be at least 6 characters";
    } else {
      message = "Something went wrong";
    }

    msg.textContent = message;
    msg.className = "message error";
  }
});


// ================= LOGIN =================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful ✅");

  } catch (error) {

    let message = "";

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      message = "Incorrect password ❌";

      const passwordInput = document.getElementById("loginPassword");
      passwordInput.classList.add("shake");

      setTimeout(() => {
        passwordInput.classList.remove("shake");
      }, 300);

    } else if (error.code === "auth/user-not-found") {
      message = "User not found";
    } else {
      message = "Login failed";
    }

    alert(message);
  }
});


// ================= PASSWORD TOGGLE =================
window.togglePassword = function (id, icon) {
  const input = document.getElementById(id);

  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "🙈";
  } else {
    input.type = "password";
    icon.textContent = "👁️";
  }
};
// ================= OTP SYSTEM =================

// 🔹 Forgot Password (Send OTP + Email)
window.forgotPassword = async function () {

  const email = document.getElementById("loginEmail").value;

  if (!email) {
    document.getElementById("message").innerText = "Please enter your email";
    return;
  }

  try {

    const res = await fetch("https://login-auth-backend-z235.onrender.com/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (data.success) {

      const otp = data.otp;

      await emailjs.send("service_1826", "template_1826", {
        to_email: email,
        otp: otp
      });

      alert("OTP sent to your email");

      document.getElementById("loginForm").style.display = "none";
      document.getElementById("otpSection").style.display = "block";
    }

  } catch (err) {

    console.error(err);
    alert("Server or Email error");

  }
};


// 🔹 Verify OTP + Reset Password
window.verifyOTP = async function () {

  const email = document.getElementById("loginEmail").value;

  const otp = document.getElementById("otpInput").value;

  const newPassword = document.getElementById("newPassword").value;

  const confirmPassword = document.getElementById("confirmNewPassword").value;

  const msg = document.getElementById("otpMessage");


  if (newPassword !== confirmPassword) {

    msg.textContent = "Passwords do not match";

    msg.style.color = "red";

    return;
  }

  try {

    const res = await fetch("https://login-auth-backend-z235.onrender.com/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        otp,
        newPassword
      })
    });

    const data = await res.json();

    if (data.success) {

      msg.textContent = "Password reset successful";

      msg.style.color = "green";

      setTimeout(() => {

        document.getElementById("otpSection").style.display = "none";

        document.getElementById("loginForm").style.display = "block";

      }, 2000);

    } else {

      msg.textContent = data.message;

      msg.style.color = "red";
    }

  } catch (err) {

    msg.textContent = "Server error";

    msg.style.color = "red";
  }
};