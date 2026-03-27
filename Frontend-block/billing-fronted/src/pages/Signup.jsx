import { useState } from "react";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      // 🔥 FORM DATA (clear text me)
      console.log(
        "Form Data:",
        JSON.stringify({
          name: name,
          email: email,
          password: password,
        })
      );

      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      // 🔥 API RESPONSE (clear text me)
      console.log(
        "Signup Response:",
        JSON.stringify(data)
      );

      if (data.message && data.message.toLowerCase().includes("success")) {
        alert("Signup Successful ✅");
      } else {
        alert(data.message || "Signup Failed ❌");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Server Error ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Signup</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;