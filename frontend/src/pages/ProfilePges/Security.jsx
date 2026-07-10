import React, { useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Api from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Security() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await Api.put("/auth/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full h-full p-4 md:p-8 flex flex-col items-center">
      <ToastContainer />
      <div className="w-full max-w-2xl flex flex-col gap-10">
        
        <form onSubmit={handleChangePassword} className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="w-full items-center flex justify-between cursor-pointer group">
            <span className="flex items-center gap-3 font-semibold text-gray-700">
              <IoWalletOutline className="text-xl group-hover:text-black transition-colors" /> 
              Change Password
            </span>
            <IoIosArrowDown className="text-gray-400 group-hover:text-black" />
          </div>
          
          <div className="w-full mt-6 space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Current Password</label>
              <input
                type="password"
                placeholder="********"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full mt-2 py-3 px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-black outline-none rounded-lg transition-all"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">New Password</label>
              <input
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-2 py-3 px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-black outline-none rounded-lg transition-all"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
              <input
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-2 py-3 px-4 border border-gray-300 bg-gray-50 focus:bg-white focus:border-black outline-none rounded-lg transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3.5 bg-black text-white font-bold rounded-lg active:scale-[0.98] transition-transform shadow-md disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>

       

      </div>
    </section>
  );
}

export default Security;