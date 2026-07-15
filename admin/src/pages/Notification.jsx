import React, { useState, useEffect } from 'react';
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiShoppingBag,
  FiUserPlus,
  FiAlertTriangle,
  FiMessageSquare,
  FiCircle
} from 'react-icons/fi';
import Api from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      toast.error(
        "Failed to load notifications: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllReadHandler = async () => {
    try {
      await Api.patch("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
      toast.success("All notifications marked as read!", {
      position: "top-right",
      autoClose: 2500,
      theme: "colored",
    });
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const clearAllHandler = async () => {
    try {
      await Api.delete("/notifications/clear-all");
      setNotifications([]);
      toast.success("Notifications cleared successfully!", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    } catch (err) {
      toast.error("Failed to clear notifications");
    }
  };

  const toggleSingleRead = async (id) => {
    try {
      await Api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isUnread: false } : n))
      );
    } catch (err) {
      // Silent — marking read is a soft action, not worth an error toast
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case "order":
        return {
          style: "bg-indigo-50 text-[#635BFF] border-indigo-100",
          icon: <FiShoppingBag size={15} />
        };
      case "user":
        return {
          style: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: <FiUserPlus size={15} />
        };
      case "support":
        return {
          style: "bg-amber-50 text-amber-700 border-amber-100",
          icon: <FiMessageSquare size={15} />
        };
      default:
        return {
          style: "bg-slate-100 text-slate-700 border-slate-200",
          icon: <FiAlertTriangle size={15} />
        };
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B] p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto min-w-0">


        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight italic text-[#1E1B4B]">Notification Hub</h1>
              {notifications.filter(n => n.isUnread).length > 0 && (
                <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-extrabold border border-rose-100 animate-pulse shrink-0">
                  {notifications.filter(n => n.isUnread).length} Unread
                </span>
              )}
            </div>
           
          </div>

          {notifications.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={markAllReadHandler}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:text-[#1E1B4B] hover:border-[#1E1B4B] text-xs font-bold transition bg-white shadow-sm whitespace-nowrap"
              >
                <FiCheck size={13} />
                <span>Mark all read</span>
              </button>
              <button
                type="button"
                onClick={clearAllHandler}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent rounded-lg text-gray-400 hover:text-red-500 text-xs font-bold transition whitespace-nowrap"
              >
                <FiTrash2 size={13} />
                <span>Clear history</span>
              </button>
            </div>
          )}
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50 min-w-0">
          {loading ? (
            <div className="flex justify-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-[#635BFF] rounded-full animate-spin" /></div>
          ) : notifications.length > 0 ? (
            notifications.map((item) => {
              const config = getTypeConfig(item.type);

              return (
                <div
                  key={item._id}
                  onClick={() => item.isUnread && toggleSingleRead(item._id)}
                  className={`p-4 md:p-5 flex items-start gap-4 transition-all relative cursor-pointer group ${
                    item.isUnread ? "bg-slate-50/70 hover:bg-slate-50" : "hover:bg-slate-50/30"
                  }`}
                >
                  <div className={`p-2.5 md:p-3 rounded-xl border flex-shrink-0 shadow-sm self-start ${config.style}`}>
                    {config.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-6 md:pr-24">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-xs md:text-sm font-bold tracking-tight truncate ${
                        item.isUnread ? "text-[#1E1B4B]" : "text-gray-600 font-semibold"
                      }`}>
                        {item.title}
                      </h3>
                      {item.isUnread && (
                        <FiCircle className="text-[#635BFF] fill-[#635BFF] shrink-0" size={6} />
                      )}
                    </div>
                    <p className="text-xs md:text-[13px] text-gray-400 font-medium leading-relaxed break-words">
                      {item.description}
                    </p>
                    <span className="text-[10px] text-gray-400 font-normal mt-1.5 inline-block">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>

                  {item.isUnread && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block z-10">
                      <span className="text-[10px] bg-white border border-gray-200 text-gray-500 font-bold px-2.5 py-1.5 rounded-md shadow-sm whitespace-nowrap hover:border-[#635BFF] hover:text-[#635BFF] transition-colors">
                        Dismiss
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center text-gray-400">
              <div className="p-3 bg-slate-50 border border-gray-100 text-gray-300 rounded-xl mb-3">
                <FiBell size={22} />
              </div>
              <p className="text-xs font-semibold text-gray-500">Inbox is completely clear</p>
              <p className="text-[10px] text-gray-400 mt-0.5">We will alert you when critical core events execute</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Notification;