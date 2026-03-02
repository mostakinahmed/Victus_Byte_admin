import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  return (
    <div>
      {" "}
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center border border-slate-500 gap-2  hover:bg-gray-400 text-gray-900 px-4 py-1.5 rounded transition"
      >
        <FiArrowLeft className="text-lg" />
        <span>Back</span>
      </button>
    </div>
  );
}

export default BackButton;
