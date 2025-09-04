import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canSeeAdmin, isSuper } from "../utils/roles";
import AuthForm from "../components/forms/AuthForm";
import { Icon } from "../components/IconProvider";

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

      let errorMessage = "Login failed. ";
      if (error.response?.data) {
        errorMessage += error.response.data;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Unknown error occurred";
      }

      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <img
                src="/assets/images/logos/MainLogoGold.png"
                alt="Keycode Help Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          {/* Form */}
          <AuthForm mode="login" onSubmit={handleSubmit} />

          {/* Links */}
          <div className="mt-6 text-center space-y-4">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign up
              </a>
            </p>

            <div className="pt-4 border-t border-slate-700">
              <a
                href="/admin-login"
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200"
              >
                <Icon name="shield" size={16} />
                Admin Access
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
