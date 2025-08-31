import React from "react";
import { FaCheck, FaBan, FaTrash } from "react-icons/fa";

const ResortTable = ({ resorts }) => {
  if (!Array.isArray(resorts)) {
    return (
      <div className="text-center text-gray-500 py-6">
        No resorts available
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {resorts.map((resort) => (
        <div
          key={resort._id}
          className="bg-white shadow-sm hover:shadow-md rounded-xl p-5 transition duration-200 border border-gray-200"
        >
          <div className="flex justify-between items-center flex-wrap">
            {/* Resort Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-2xl">
                {resort.icon || "🏨"}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {resort.name}
                </p>
                <p className="text-sm text-gray-500">{resort.location}</p>
              </div>
            </div>

            {/* Owner */}
            <div className="text-sm text-gray-700 min-w-[120px]">
              <p className="font-medium">
                {resort.ownerId?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">Owner</p>
            </div>

            {/* Performance */}
            <div className="text-sm text-gray-700 min-w-[120px]">
              <p>{resort.bookings || 0} bookings</p>
              <p className="text-xs text-gray-500">
                ₹{resort.revenue || 0} revenue
              </p>
            </div>

            {/* Status */}
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                  resort.visible
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {resort.visible ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-center">
              {!resort.visible ? (
                <button
                  className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 transition"
                  title="Approve"
                >
                  <FaCheck className="w-4 h-4" />
                </button>
              ) : (
                <button
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                  title="Block"
                >
                  <FaBan className="w-4 h-4" />
                </button>
              )}
              <button
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
                title="Delete"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResortTable;
