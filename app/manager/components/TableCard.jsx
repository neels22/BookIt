"use client";
import React, { useState } from "react";
// import PropTypes from "prop-types";
import { BASE_URL } from "@/constants/constants";
const TableCard = ({ table, onDelete, onUpdate }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [seats, setSeats] = useState(table.seats);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    
    try {
      await onDelete(table.id);
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError("");
    
    try {
      await onUpdate(table.id, seats);
      setShowUpdateModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Table</h3>
            <p className="text-sm text-slate-500">{table.seats} seats</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="text-blue-600 hover:text-blue-700"
              title="Update table"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:text-red-700"
              title="Delete table"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Update Table Seats</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Seats
              </label>
              <input
                type="number"
                min="1"
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                disabled={isUpdating}
              />
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Table</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this table? This action cannot be undone.
            </p>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// TableCard.propTypes = {
//   table: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     number: PropTypes.number.isRequired,
//     seats: PropTypes.number.isRequired,
//   }).isRequired,
//   onDelete: PropTypes.func.isRequired,
//   onUpdate: PropTypes.func.isRequired,
// };

export default TableCard; 