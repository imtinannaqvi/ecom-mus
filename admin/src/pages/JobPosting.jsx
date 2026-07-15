import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiUsers, FiX, FiEye, FiDownload } from "react-icons/fi";
import Api, { BACKEND_URL } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

const JobPosting = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
  });

  const [viewingJob, setViewingJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/jobs/admin/all");
      setJobs(res.data.jobs || []);
    } catch (err) {
      toast.error("Failed to load jobs: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const resetForm = () => {
    setForm({ title: "", category: "", location: "", type: "Full-time", description: "", requirements: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.location || !form.description) {
      return toast.error("Title, category, location, and description are required");
    }
    setSubmitting(true);
    try {
      await Api.post("/jobs/admin/create", form);
      toast.success("Job posted successfully!");
      resetForm();
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (job) => {
    setTogglingId(job._id);
    try {
      const res = await Api.put(`/jobs/admin/${job._id}`, { isActive: !job.isActive });
      setJobs((prev) => prev.map((j) => (j._id === job._id ? { ...j, isActive: res.data.job.isActive } : j)));
    } catch (err) {
      toast.error("Failed to update job status");
    } finally {
      setTogglingId(null);
    }
  };

  const deleteJob = async (id) => {
    try {
      await Api.delete(`/jobs/admin/${id}`);
      toast.success("Job deleted");
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  const openApplicants = async (job) => {
    setViewingJob(job);
    setAppsLoading(true);
    try {
      const res = await Api.get(`/jobs/admin/${job._id}/applications`);
      setApplications(res.data.applications || []);
    } catch (err) {
      toast.error("Failed to load applicants");
    } finally {
      setAppsLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await Api.patch(`/jobs/admin/applications/${appId}/status`, { status });
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteApplication = async (appId) => {
    try {
      await Api.delete(`/jobs/admin/applications/${appId}`);
      setApplications((prev) => prev.filter((a) => a._id !== appId));
      toast.success("Application removed");
    } catch (err) {
      toast.error("Failed to delete application");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Shortlisted": return "bg-emerald-50 text-emerald-600";
      case "Reviewed": return "bg-blue-50 text-blue-600";
      case "Rejected": return "bg-red-50 text-red-600";
      default: return "bg-amber-50 text-amber-600";
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto min-w-0">

        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1E1B4B]">We Are Hiring</h1>
            <p className="text-xs text-gray-400 mt-0.5">Post job openings and review applicants.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#635BFF] hover:bg-[#5149E4] text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-[0.98]"
          >
            <FiPlus size={16} /> {showForm ? "Cancel" : "Post New Job"}
          </button>
        </header>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Job Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm font-medium transition-all"
                  placeholder="e.g. Warehouse Associate"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm leading-relaxed transition-all resize-none"                  placeholder="e.g. Design, Warehouse, Customer Support"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm leading-relaxed transition-all resize-none"                  placeholder="add location"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Job Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-xs font-semibold appearance-none transition-all"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Description</label>
              <textarea
                rows="4"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm leading-relaxed transition-all"
                placeholder="What this role involves day to day..."
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block tracking-wider">Requirements</label>
              <textarea
                rows="4"
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-gray-200 rounded-xl focus:border-[#635BFF] focus:bg-white outline-none text-sm leading-relaxed transition-all"
                placeholder="Skills, experience, qualifications..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-[#1E1B4B] text-white rounded-xl font-bold text-xs tracking-widest hover:bg-[#2e2a70] transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? "POSTING..." : "POST JOB"}
            </button>
          </form>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {loading ? (
            <div className="p-16 flex justify-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-16 text-center text-gray-400 text-sm font-medium">No jobs posted yet.</div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-[#1E293B]">{job.title}</h3>
                    <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-indigo-50 text-[#635BFF]">
                      {job.category}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${job.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                      {job.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{job.location} &middot; {job.type}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openApplicants(job)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-gray-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition"
                  >
                    <FiUsers size={14} /> {job.applicantCount || 0} Applicants
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={job.isActive}
                    disabled={togglingId === job._id}
                    onClick={() => toggleActive(job)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${job.isActive ? "bg-emerald-500" : "bg-gray-300"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${job.isActive ? "translate-x-4.5" : "translate-x-0.5"}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteJob(job._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Applicants Modal */}
        {viewingJob && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setViewingJob(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#1E1B4B]">Applicants — {viewingJob.title}</h3>
                <button onClick={() => setViewingJob(null)} className="text-gray-400 hover:text-black">
                  <FiX size={20} />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                {appsLoading ? (
                  <div className="p-10 flex justify-center">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
                  </div>
                ) : applications.length === 0 ? (
                  <p className="p-10 text-center text-gray-400 text-sm">No applicants yet.</p>
                ) : (
                  applications.map((app) => (
                    <div key={app._id} className="p-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <p className="text-sm font-bold">{app.name}</p>
                          <p className="text-xs text-gray-400">{app.email} &middot; {app.phone}</p>
                        </div>
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app._id, e.target.value)}
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg border-none outline-none ${statusColor(app.status)}`}
                        >
                          {["New", "Reviewed", "Shortlisted", "Rejected"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      {app.coverLetter && <p className="text-xs text-gray-600 mt-2">{app.coverLetter}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        <a
                          href={`${BACKEND_URL}${app.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#635BFF] flex items-center gap-1 hover:underline"
                        >
                          <FiDownload size={12} /> View Resume
                        </a>
                        <button onClick={() => deleteApplication(app._id)} className="text-xs font-bold text-red-500 hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPosting;