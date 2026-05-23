const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let storedOTP = "";

// Home Route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

// Send OTP Route
app.post("/send-otp", (req, res) => {

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

// Reset Password Route
app.post("/reset-password", (req, res) => {

  const { otp } = req.body;

  if (otp === storedOTP) {

    res.json({
      success: true
    });

  } else {

    res.json({
      success: false,
      message: "Invalid OTP"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});