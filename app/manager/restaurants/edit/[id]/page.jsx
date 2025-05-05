"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "@/constants/constants";
// Helper to convert 12-hour AM/PM format to 24-hour time
function to24HourFormat(time12) {
  const [time, period] = time12.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

// Helper to convert 24-hour time to 12-hour AM/PM format
function to12HourFormat(time24) {
  let [hour, minute] = time24.split(":");
  hour = parseInt(hour, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
}

const EditRestaurantPage = ({ params }) => {
  const id = React.use(params).id;
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    photos: [],
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    },
    phoneNumber: "",
    cuisine: "",
    costRating: 1,
    openingTime: "09:00",
    closingTime: "22:00",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRemoveImage = (indexToRemove) => {
    setExistingImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/manager/restaurants/restaurants-by-manager/${user.id}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant details");
        }

        const restaurants = await response.json();
        const restaurant = restaurants.find(r => r.id === id);

        if (!restaurant) {
          throw new Error("Restaurant not found");
        }

        setForm({
          name: restaurant.name,
          description: restaurant.description,
          photos: [],
          address: {
            street: restaurant.address.street,
            city: restaurant.address.city,
            state: restaurant.address.state,
            zipCode: restaurant.address.zipCode
          },
          phoneNumber: restaurant.contact,
          cuisine: restaurant.cuisine,
          costRating: restaurant.costRating,
          openingTime: to24HourFormat(restaurant.openingTime),
          closingTime: to24HourFormat(restaurant.closingTime),
        });
        setExistingImages(restaurant.photos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRestaurantDetails();
    }
  }, [id, user?.id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photos" && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((f) => ({
          ...f,
          photos: [...f.photos, ev.target.result]
        }));
      };
      reader.readAsDataURL(files[0]);
    } else if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm((f) => ({
        ...f,
        address: { ...f.address, [field]: value }
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Add the request JSON as a Blob
      const restaurantRequest = {
        restaurantId: id,
        name: form.name,
        description: form.description,
        address: form.address,
        phoneNumber: form.phoneNumber,
        cuisine: form.cuisine,
        costRating: form.costRating,
        openingTime: to12HourFormat(form.openingTime),
        closingTime: to12HourFormat(form.closingTime),
        retainedImageUrls: existingImages
      };

      const jsonBlob = new Blob([JSON.stringify(restaurantRequest)], {
        type: "application/json",
      });
      formData.append("request", jsonBlob);

      // Add new image files
      if (form.photos.length > 0) {
        form.photos.forEach((photo, index) => {
          // Convert base64 to blob
          const byteString = atob(photo.split(',')[1]);
          const mimeString = photo.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          formData.append("images", blob, `photo${index}.jpg`);
        });
      }

      const response = await fetch(`${BASE_URL}/manager/restaurants/update-restaurant`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update restaurant");
      }

      setSuccess("Restaurant updated successfully!");
      setTimeout(() => {
        router.push("/manager/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-slate-500">Loading restaurant details...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Restaurant</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      <form className="bg-white rounded-xl p-8 max-w-2xl" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Restaurant Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cuisine</label>
            <input name="cuisine" value={form.cuisine} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input name="address.street" value={form.address.street} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input name="address.city" value={form.address.city} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input name="address.state" value={form.address.state} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ZIP Code</label>
            <input name="address.zipCode" value={form.address.zipCode} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cost Rating (1-5)</label>
            <input 
              type="number" 
              name="costRating" 
              value={form.costRating} 
              onChange={handleChange} 
              min="1" 
              max="5" 
              required 
              className="w-full border rounded px-3 py-2" 
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Restaurant Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Opening Hours</label>
            <div className="flex gap-2 items-center">
              <input type="time" name="openingTime" value={form.openingTime} onChange={handleChange} className="border rounded px-2 py-1" />
              <span>-</span>
              <input type="time" name="closingTime" value={form.closingTime} onChange={handleChange} className="border rounded px-2 py-1" />
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Existing Photos</label>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {existingImages.map((image, index) => (
              <div key={index} className="relative group">
                <img src={image} alt={`Restaurant photo ${index + 1}`} className="w-full h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {existingImages.length === 0 && (
            <div className="text-sm text-slate-500 mb-4">No existing photos</div>
          )}
          <label className="block text-sm font-medium mb-1">Add New Photos</label>
          <input type="file" name="photos" accept="image/*" onChange={handleChange} className="block" multiple />
          <div className="text-xs text-slate-500 mt-1">Upload additional images of your restaurant.</div>
        </div>
        <div className="flex gap-4 mt-8">
          <button type="button" onClick={() => router.back()} className="rounded-md px-6 py-2 border border-slate-300">Cancel</button>
          <button type="submit" className="bg-rose-700 hover:bg-rose-800 rounded-md px-6 py-2 text-white">Update Restaurant</button>
        </div>
      </form>
    </div>
  );
};

export default EditRestaurantPage; 