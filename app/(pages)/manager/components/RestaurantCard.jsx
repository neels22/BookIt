"use client";
import React, { useState } from "react";
// import PropTypes from "prop-types";
import StatBadge from "./StatBadge";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants/constants";
const RestaurantCard = ({ restaurant, onDelete }) => {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/manager/restaurants/${restaurant.id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete restaurant");
      }

      setShowDeleteModal(false);
      onDelete(restaurant.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow flex flex-col overflow-hidden">
        <div className="relative h-48">
          {restaurant.image ? (
            <img 
              src={restaurant.image} 
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-slate-700 text-white flex items-center justify-center h-full rounded-t-xl text-lg font-semibold">
              No Image
            </div>
          )}
          {restaurant.approvalStatus && (
            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-medium ${
              restaurant.approvalStatus === "APPROVED" ? "bg-green-100 text-green-800" :
              restaurant.approvalStatus === "PENDING" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>
              {restaurant.approvalStatus}
            </div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col gap-2">
          <div className="font-bold text-lg">{restaurant.name}</div>
          <div className="text-slate-500 text-sm">{restaurant.cuisine}</div>
          <div className="text-slate-500 text-sm mb-2">{restaurant.address}</div>
          <div className="flex gap-2 mb-4">
            <StatBadge title="Rating" value={restaurant.rating || 0} />
            <StatBadge title="Cost" value={'$'.repeat(restaurant.costRating)} />
            <StatBadge title="Status" value={restaurant.status} />
          </div>
          <div className="text-sm text-slate-500">
            Hours: {restaurant.openingTime} - {restaurant.closingTime}
          </div>
          <div className="text-sm text-slate-500">
            Phone: {restaurant.phone}
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              restaurant.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {restaurant.status}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/manager/restaurants/edit/${restaurant.id}`)}
                className="text-rose-700 hover:text-rose-800 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Restaurant</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{restaurant.name}"? This action cannot be undone.
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

// RestaurantCard.propTypes = {
//   restaurant: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     description: PropTypes.string,
//     image: PropTypes.string,
//     address: PropTypes.string,
//     phone: PropTypes.string,
//     cuisine: PropTypes.string,
//     costRating: PropTypes.number,
//     rating: PropTypes.number,
//     status: PropTypes.string,
//     openingTime: PropTypes.string,
//     closingTime: PropTypes.string,
//     approvalStatus: PropTypes.string,
//   }).isRequired,
//   onDelete: PropTypes.func.isRequired,
// };

export default RestaurantCard; 