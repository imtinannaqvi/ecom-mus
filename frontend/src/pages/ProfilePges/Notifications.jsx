import React, { useState, useEffect } from "react";
import Api from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(dateString).toLocaleDateString();
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data } = await Api.get("/notifications/my");
        if (data.success) setNotifications(data.notifications || []);
      } catch (err) {
        toast.error("Failed to load notifications: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <section className="w-full flex justify-center items-center h-full bg-white py-20">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col h-full bg-white">
      <ToastContainer />
      {notifications.length > 0 ? (
        notifications.map((item) => (
          <div
            key={item._id}
            className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 md:p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            {/* Text Content */}
            <div className="flex-1 pr-4">
              <h5 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                {item.title}
              </h5>
              <p className="text-sm md:text-base text-gray-500 mt-1">
                {item.description}
              </p>
            </div>

            {/* Time Badge */}
            <span className="text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap bg-gray-100 sm:bg-transparent px-2 py-1 sm:p-0 rounded">
              {timeAgo(item.createdAt)}
            </span>
          </div>
        ))
      ) : (
        <div className="text-center py-20 text-gray-400 text-sm font-medium uppercase tracking-widest">
          No notifications yet
        </div>
      )}
    </section>
  );
}

export default Notifications;