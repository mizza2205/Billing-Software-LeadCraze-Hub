import { useState } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [page, setPage] = useState("signup");

  return (
    <>
      {page === "signup" && <Signup />}
      {page === "login" && <Login />}
      {page === "forgot" && <ForgotPassword />}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => setPage("signup")}>Signup</button>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("forgot")}>Forgot Password</button>
      </div>
    </>
  );
}

export default App;
