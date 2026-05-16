import React, { useState } from 'react';
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

const Notification = () => {
  // Dummy Dynamic Notifications Stream
  const [notifications, setNotifications] = useState([
    {
      _id: "n1",
      title: "New Premium Order Received",
      description: "Customer Hamza Ahmed placed order #MAU-8801 for Rs. 4,500.",
      type: "order",
      time: "2 mins ago",
      isUnread: true
    },
    {
      _id: "n2",
      title: "New Customer Registration",
      description: "Sana Khan created a verified buyer account on Maurish portal.",
      type: "user",
      time: "45 mins ago",
      isUnread: true
    },
    {
      _id: "n3",
      title: "Database Backup Completed",
      description: "Automated daily systems storage snapshot sync completed securely.",
      type: "system",
      time: "4 hours ago",
      isUnread: false
    },
    {
      _id: "n4",
      title: "Support Ticket Escalation",
      description: "Zeeshan Ali requested assistance regarding refund workflow status.",
      type: "support",
      time: "1 day ago",
      isUnread: false
    }
  ]);

  // Action Handlers
  const markAllReadHandler = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  const clearAllHandler = () => {
    if (window.confirm("Are you sure you want to clear all notifications logs?")) {
      setNotifications([]);
    }
  };

  const toggleSingleRead = (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isUnread: false } : n));
  };

  // Helper Configuration for Contextual Icons and Color Palettes
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
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <div className="max-w-4xl mx-auto">
        
        {/* Modern Header Layout with Control Links */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#1E1B4B]">Notification Hub</h1>
              {notifications.filter(n => n.isUnread).length > 0 && (
                <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-extrabold border border-rose-100 animate-pulse">
                  {notifications.filter(n => n.isUnread).length} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Live updates channel. Audit platform activity logs, sales triggers, and consumer escalations.
            </p>
          </div>

          {/* Top Quick Actions Trigger Bar */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-3 self-start sm:self-center">
              <button
                type="button"
                onClick={markAllReadHandler}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:text-[#1E1B4B] hover:border-[#1E1B4B] text-xs font-bold transition bg-white shadow-sm"
              >
                <FiCheck size={13} />
                <span>Mark all read</span>
              </button>
              <button
                type="button"
                onClick={clearAllHandler}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-transparent rounded-lg text-gray-400 hover:text-red-500 text-xs font-bold transition"
              >
                <FiTrash2 size={13} />
                <span>Clear history</span>
              </button>
            </div>
          )}
        </header>

        {/* Notifications Sheet Feed Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
          {notifications.length > 0 ? (
            notifications.map((item) => {
              const config = getTypeConfig(item.type);

              return (
                <div 
                  key={item._id}
                  onClick={() => toggleSingleRead(item._id)}
                  className={`p-4 flex items-start gap-4 transition-all relative cursor-pointer group ${
                    item.isUnread ? "bg-slate-50/70 hover:bg-slate-50" : "hover:bg-slate-50/30"
                  }`}
                >
                  {/* Left Custom Visual Context Icon Badge */}
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 shadow-sm ${config.style}`}>
                    {config.icon}
                  </div>

                  {/* Center Content Stream Body */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-xs font-bold tracking-tight truncate ${
                        item.isUnread ? "text-[#1E1B4B]" : "text-gray-600 font-semibold"
                      }`}>
                        {item.title}
                      </h3>
                      {item.isUnread && (
                        <FiCircle className="text-[#635BFF] fill-[#635BFF] animate-scale" size={6} />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      {item.description}
                    </p>
                    <span className="text-[10px] text-gray-400 font-normal mt-1.5 inline-block">
                      {item.time}
                    </span>
                  </div>

                  {/* Soft Action Shortcut Trigger Appear On Hover */}
                  {item.isUnread && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] bg-white border border-gray-200 text-gray-500 font-bold px-2 py-1 rounded-md shadow-sm">
                        Dismiss
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* Fallback Clean Slate State Matrix Grid representation */
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