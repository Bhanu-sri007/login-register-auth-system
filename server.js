const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  })
});

const app = express();

app.use(cors());
app.use(express.json());

let storedOTP = "";

// ================= SEND OTP =================
app.post("/send-otp", async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email required"
    });
  }

  try {

    // Check if user exists
    await admin.auth().getUserByEmail(email);

    // Generate OTP
    storedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Generated OTP:", storedOTP);

    return res.json({
      success: true,
      otp: storedOTP
    });

  } catch (error) {

    console.log("User not found");

    return res.json({
      success: false,
      message: "Email not registered ❌"
    });
  }
});


// ================= RESET PASSWORD =================
app.post("/reset-password", async (req, res) => {

  const { email, otp, newPassword } = req.body;

  if (otp !== storedOTP) {
    return res.json({
      success: false,
      message: "Invalid OTP ❌"
    });
  }

  try {

    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().updateUser(user.uid, {
      password: newPassword
    });

    return res.json({
      success: true,
      message: "Password updated successfully ✅"
    });

  } catch (error) {

    console.error(error);

    return res.json({
      success: false,
      message: "Password update failed ❌"
    });
  }
});


// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});