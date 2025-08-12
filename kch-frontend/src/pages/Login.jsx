import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper } from "../utils/roles";
import AuthForm from "../components/forms/AuthForm";
import "../styles/login.css";
function Login() {
  const navigate = useNavigate();
  const { login, userRole } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      await login(formData.email, formData.password);

      // Redirect based on user role
      if (canSeeAdmin(userRole)) {
        if (isSuper(userRole)) {
          navigate("/super-admin");
        } else {
          navigate("/admin");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. "+error.response.data);
    }
  };

  return (
    <div className="container-login">
      <div className="form-section-login">
        <h1>Login to Your Account</h1>
        <AuthForm mode="login" onSubmit={handleSubmit} />
        <p>
          Don't have an account?... <a href="/register">Sign up</a>
        </p>
        <div className="admin-login-link">
          <p>
            <a href="/admin-login">🔐 Admin Access</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
