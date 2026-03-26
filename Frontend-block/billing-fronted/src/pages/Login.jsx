import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyOTP = () => {
    if (otp === "1234") {
      alert("OTP Login Successful");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2>Login</h2>

        <input
          placeholder="Email"
          style={{ margin: "10px", padding: "10px", width: "90%" }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={{ margin: "10px", padding: "10px", width: "90%" }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          style={{
            padding: "10px",
            width: "100%",
            background: "#6a11cb",
            color: "white",
            border: "none",
            marginTop: "10px",
            borderRadius: "5px",
          }}
        >
          Login
        </button>

        <p style={{ margin: "15px 0" }}>------ OR ------</p>

        <button
          onClick={() => setShowOTP(true)}
          style={{
            padding: "10px",
            width: "100%",
            background: "#2575fc",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Login with OTP
        </button>

        {showOTP && (
          <>
            <input
              placeholder="Enter OTP"
              style={{ margin: "10px", padding: "10px", width: "90%" }}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOTP}
              style={{
                padding: "10px",
                width: "100%",
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;