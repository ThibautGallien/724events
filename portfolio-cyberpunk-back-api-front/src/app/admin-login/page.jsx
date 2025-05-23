"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const AdminLogin = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error || "Authentication failed.");
        setLoading(false);
        return;
      }

      const { token } = await res.json();
      localStorage.setItem("adminToken", token);
      router.push("/admin-dashboard");
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login">
      <div className="container">
        <div className="login-card">
          <div className="login-header">
            <Lock size={32} />
            <h1>{t("admin.login")}</h1>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">{t("admin.username")}</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t("admin.password")}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="neon-button" disabled={loading}>
              {loading ? (
                <span className="loading-spinner" />
              ) : (
                t("admin.login")
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
