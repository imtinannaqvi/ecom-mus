import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEye, FiDownload, FiTrash2, FiMapPin, FiClock, FiUsers } from "react-icons/fi";
import Api, { BACKEND_URL } from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_TABS = ["All", "New", "Reviewed", "Shortlisted", "Rejected"];

const statusColor = (status) => {
  switch (status) {
    case "Shortlisted": return "bg-emerald-50 text-emerald-600 ring-emerald-200";
    case "Reviewed": return "bg-blue-50 text-blue-600 ring-blue-200";
    case "Rejected": return "bg-red-50 text-red-600 ring-red-200";
    default: return "bg-amber-50 text-amber-600 ring-amber-200";
  }
};

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        Api.get("/jobs/admin/all"),
        Api.get(`/jobs/admin/${jobId}/applications`),
      ]);
      const matchedJob = (jobsRes.data.jobs || []).find((j) => j._id === jobId);
      setJob(matchedJob || null);
      setApplications(appsRes.data.applications || []);
    } catch (err) {
      toast.error("Failed to load applicants: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

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

  const filteredApplications = applications.filter((a) => filter === "All" || a.status === filter);

  const countFor = (status) =>
    status === "All" ? applications.length : applications.filter((a) => a.status === status).length;

  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto min-w-0">

        <button
          onClick={() => navigate("/admin/hiring")}
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-500 hover:text-[#1E1B4B] hover:border-[#1E1B4B] rounded-lg text-xs font-bold transition bg-white shadow-sm mb-6"
        >
          <FiArrowLeft size={13} /> Back to Job Listings
        </button>

       

        {/* Status Filter Tabs */}
        <div className="flex gap-1 bg-slate-200/50 p-1 rounded-xl w-full sm:w-max border border-gray-100 shadow-inner mb-6 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
                filter === tab
                  ? "bg-white text-[#1E1B4B] shadow-sm border border-slate-100"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab} <span className="text-gray-400 font-normal">({countFor(tab)})</span>
            </button>
          ))}
        </div>

        {/* Applicant Cards */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400 text-sm font-medium">
            No {filter.toLowerCase() === "all" ? "" : filter.toLowerCase()} applicants{filter !== "All" ? "" : " yet"}.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const resumeUrl = `${BACKEND_URL}${app.resume}`;
              const previewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(resumeUrl)}&embedded=true`;

              return (
                <div key={app._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#1E293B]">{app.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{app.email} &middot; {app.phone}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ring-1 ring-inset shrink-0 ${statusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  {app.coverLetter && (
                    <p className="text-sm text-gray-600 mt-3 border-t border-gray-50 pt-3">{app.coverLetter}</p>
                  )}

                  {/* Status action buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {["New", "Reviewed", "Shortlisted", "Rejected"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateStatus(app._id, s)}
                        className={`text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg transition ${
                          app.status === s
                            ? statusColor(s) + " ring-1 ring-inset"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#635BFF] flex items-center gap-1.5 hover:underline"
                    >
                      <FiEye size={13} /> Preview Resume
                    </a>
                  
                    <button
                      onClick={() => deleteApplication(app._id)}
                      className="text-xs font-bold text-red-500 flex items-center gap-1.5 hover:underline ml-auto"
                    >
                      <FiTrash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;