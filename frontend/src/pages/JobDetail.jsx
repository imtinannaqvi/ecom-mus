import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiMapPin, FiClock, FiUpload } from "react-icons/fi";
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "", coverLetter: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const { data } = await Api.get(`/jobs/${id}`);
        if (data.success) setJob(data.job);
      } catch (err) {
        setError(err.response?.data?.message || "This position is no longer available.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in your name, email, and phone.");
      return;
    }
    if (!resumeFile) {
      toast.error("Please attach your resume (PDF, DOC, or DOCX).");
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append("resume", resumeFile);

      const { data } = await Api.post(`/jobs/${id}/apply`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(data.message || "Application submitted!");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-gray-500">{error}</p>
        <Link to="/careers" className="text-sm font-bold underline">Back to Openings</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        <Link to="/careers" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">
          &larr; Back to Openings
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mt-4">{job.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
          <span className="flex items-center gap-1.5"><FiMapPin size={14} /> {job.location}</span>
          <span className="flex items-center gap-1.5"><FiClock size={14} /> {job.type}</span>
          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-bold uppercase">{job.category}</span>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Description</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>
          {job.requirements && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Requirements</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{job.requirements}</p>
            </div>
          )}
        </div>

        <div className="mt-12 pt-10 border-t">
          {submitted ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-bold">Application Submitted!</h3>
              <p className="text-gray-500 mt-2">Thank you for applying — we'll be in touch if there's a match.</p>
              <Link to="/careers" className="inline-block mt-6 text-xs font-bold uppercase tracking-widest underline">
                View Other Openings
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold uppercase tracking-tight mb-6">Apply for this Position</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-sm outline-none focus:ring-1 focus:ring-black transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-sm outline-none focus:ring-1 focus:ring-black transition"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-xl py-4 px-4 text-sm outline-none focus:ring-1 focus:ring-black transition"
                    required
                  />
                </div>
               
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                    Resume <span className="normal-case font-medium text-gray-400">(PDF, DOC, or DOCX)</span>
                  </label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-black transition">
                    <FiUpload className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {resumeFile ? resumeFile.name : "Click to upload your resume"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default JobDetail;