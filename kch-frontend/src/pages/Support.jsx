import React, { useState } from "react";
import api from "../services/request";
import { useAuth } from "../context/AuthContext";

export default function Support() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.fname ? `${user.fname} ${user.lname ?? ""}`.trim() : "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await api.post("/support/contact", form);
      setStatus("Thanks! Your message has been sent.");
      setForm({ ...form, subject: "", message: "" });
    } catch (err) {
      setStatus("Sorry, we couldn't send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 80 }}>
      <h1>Contact Support</h1>
      <p className="text-dim">We usually reply within a few hours.</p>
      <form onSubmit={onSubmit} className="grid gap-4" style={{ maxWidth: 600 }}>
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={onChange}
          className="form-input"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange}
          className="form-input"
          required
        />
        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={onChange}
          className="form-input"
          required
        />
        <textarea
          name="message"
          placeholder="How can we help?"
          value={form.message}
          onChange={onChange}
          className="form-input"
          rows={6}
          required
        />
        <button disabled={loading} className="btn btn-primary" type="submit">
          {loading ? "Sending..." : "Send Message"}
        </button>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
}


