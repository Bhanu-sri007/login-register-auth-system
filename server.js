const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});
const app = express();

app.use(cors());
app.use(express.json());

let storedOTP = "";

// Send OTP
app.post("/send-otp", async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email required"
    });
  }

  storedOTP = Math.floor(100000 + Math.random() * 900000).toString();

  console.log("Generated OTP:", storedOTP);

  res.json({
    success: true,
    otp: storedOTP
  });
});

// Reset Password
app.post("/reset-password", async (req, res) => {

  const { email, otp, newPassword } = req.body;

  if (otp !== storedOTP) {
    return res.json({
      success: false,
      message: "Invalid OTP"
    });
  }

  try {

    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().updateUser(user.uid, {
      password: newPassword
    });

    res.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    res.json({
      success: false,
      message: "Password update failed"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  