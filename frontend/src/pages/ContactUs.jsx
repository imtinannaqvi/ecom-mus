import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await Api.post("/contact", form);
      toast.success(data.message || "Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      <ToastContainer position="top-right" autoClose={1000} />

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold italic">Contact Us</h1>
         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <FiMail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</p>
                <p className="text-sm font-semibold mt-1">help@maurish.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <FiPhone size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone</p>
                <p className="text-sm font-semibold mt-1">1-888-923-8044</p>
                <p className="text-xs text-gray-400 mt-0.5">24/7 Support Center</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <FiMapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Working Hours</p>
                <p className="text-sm font-semibold mt-1">8:00 AM – 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-sm outline-none focus:ring-1 focus:ring-black transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-sm outline-none focus:ring-1 focus:ring-black transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Subject <span className="normal-case font-medium text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Order inquiry, product question, etc."
                className="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-sm outline-none focus:ring-1 focus:ring-black transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="6"
                placeholder="Tell us how we can help..."
                className="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-sm outline-none focus:ring-1 focus:ring-black transition resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ContactUs;