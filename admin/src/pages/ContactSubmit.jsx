import React, { useState, useEffect } from "react";
import { FiMail, FiTrash2, FiCheck, FiMessageSquare } from "react-icons/fi";
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Unread"); // Unread | Read | All
  const [actingId, setActingId] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/contact/admin/all");
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      toast.error("Failed to load messages: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Both handlers take the submission object directly — this was the bug:
  // they previously had no parameter at all, so submission._id inside them
  // was undefined and every call silently failed.
  const handleMarkRead = async (submission) => {
    setActingId(submission._id);
    try {
      await Api.patch(`/contact/admin/${submission._id}/read`);
      setSubmissions((prev) =>
        prev.map((s) => (s._id === submission._id ? { ...s, isRead: true } : s))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as read");
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (submission) => {
    setActingId(submission._id);
    try {
      await Api.delete(`/contact/admin/${submission._id}`);
      toast.success("Message deleted");
      setSubmissions((prev) => prev.filter((s) => s._id !== submission._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    } finally {
      setActingId(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === "Unread") return !s.isRead;
    if (filter === "Read") return s.isRead;
    return true;
  });

  const unreadCount = submissions.filter((s) => !s.isRead).length;

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto min-w-0">

        <header className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#1E1B4B]">Contact Messages</h1>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-extrabold border border-rose-100">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Messages submitted through the storefront's Contact Us form.
          </p>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-slate-200/50 p-1 rounded-xl w-full sm:w-max border border-gray-100 shadow-inner mb-6 overflow-x-auto">
          {["Unread", "Read", "All"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
                filter === tab
                  ? "bg-white text-[#1E1B4B] shadow-sm border border-slate-100"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {loading ? (
            <div className="p-16 flex justify-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-16 text-center text-gray-400 text-sm font-medium">
              <FiMessageSquare className="mx-auto text-2xl mb-2 text-gray-300" />
              No {filter.toLowerCase()} messages.
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div
                key={submission._id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 ${!submission.isRead ? "bg-indigo-50/20" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#1E293B] break-words">{submission.name}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 break-all">
                      <FiMail size={10} className="shrink-0" /> {submission.email}
                    </span>
                    {!submission.isRead && (
                      <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 shrink-0">
                        New
                      </span>
                    )}
                  </div>

                  {submission.subject && (
                    <p className="text-sm font-semibold mt-2 break-words">{submission.subject}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">{submission.message}</p>

                  <p className="text-[10px] text-gray-400 mt-2">
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Action buttons: stack full-width on mobile, sit in a
                    compact column on larger screens */}
                <div className="grid grid-cols-3 sm:grid-cols-1 gap-2 shrink-0 w-full sm:w-auto">
                  {!submission.isRead ? (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(submission)}
                      disabled={actingId === submission._id}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition disabled:opacity-50"
                    >
                      <FiCheck size={14} /> <span className="hidden sm:inline">Mark Read</span>
                    </button>
                  ) : (
                    <span className="hidden sm:block" />
                  )}
                  <a
                    href={`mailto:${submission.email}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 text-gray-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition"
                  >
                    <FiMail size={14} /> <span className="hidden sm:inline">Reply</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(submission)}
                    disabled={actingId === submission._id}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition disabled:opacity-50"
                  >
                    <FiTrash2 size={14} /> <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSubmissions;