"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ContactForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Form submission failed");

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("Form error:", err);
      setError(t("contact.error") || "An error occurred. Please try again.");
      setStatus("");
    }
  };

  return (
    <div className="contact-form">
      {status === "success" ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <p>{t("contact.success")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t("contact.name")}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t("contact.email")}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">{t("contact.message")}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="form-control"
            ></textarea>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="neon-button"
            disabled={status === "sending"}
          >
            {status === "sending" ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <Send size={16} />
                <span>{t("contact.send")}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
