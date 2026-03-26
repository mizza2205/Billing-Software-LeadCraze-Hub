import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const handleSendOTP = () => {
    alert("OTP sent");
    setShowOTP(true);
  };

  const handleVerifyOTP = () => {
    if (otp === "1234") {
      alert("OTP Verified");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>

      <input
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSendOTP}>Send OTP</button>

      {showOTP && (
        <>
          <input
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;