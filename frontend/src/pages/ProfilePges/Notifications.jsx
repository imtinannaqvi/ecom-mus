import React from "react";

function Notifications() {
  const notificationData = [
    { title: "Profile Update", desc: "You just updated your profile picture.", time: "Just now" },
    { title: "Your order placed successfully", desc: "You placed a new order.", time: "2 mins ago" },
    { title: "Order delivered", desc: "Your order has been delivered successfully.", time: "1 hour ago" },
    { title: "Password Update successfully", desc: "Your password has been updated successfully.", time: "3 hours ago" },
    { title: "Message from support", desc: "Our support team replied to your query.", time: "Yesterday" },
  ];

  return (
    <section className="w-full flex flex-col h-full bg-white">
      {notificationData.map((item, index) => (
        <div
          key={index}
          className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 md:p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {/* Text Content */}
          <div className="flex-1 pr-4">
            <h5 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
              {item.title}
            </h5>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              {item.desc}
            </p>
          </div>

          {/* Time Badge */}
          <span className="text-xs md:text-sm font-medium text-gray-400 whitespace-nowrap bg-gray-100 sm:bg-transparent px-2 py-1 sm:p-0 rounded">
            {item.time}
          </span>
        </div>
      ))}
    </section>
  );
}

export default Notifications;