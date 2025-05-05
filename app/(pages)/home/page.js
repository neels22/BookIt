"use client";
import { useEffect, useState } from "react";
import {
  Github,
  Twitter,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";


import { BASE_URL } from "@/constants/constants";

export default function Component() {
  const [availableRestaurants, setAvailableRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({
    topRated: [],
    topBookedToday: [],
    nearYou: []
  });

  useEffect(() => {
    const fetchAvailableRestaurants = async () => {
      try {
        const response = await fetch(`${BASE_URL}/restaurants/available-tables`);
        if (!response.ok) {
          throw new Error('Failed to fetch available restaurants');
        }
        const data = await response.json();
        setAvailableRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/restaurants/categories?location=San%20Jose`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAvailableRestaurants();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-64 h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="text-red-500">Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-6">Currently Available Tables</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRestaurants.map((restaurant, index) => (
            <Link 
              key={restaurant.restaurantId} 
              href={`/restaurant/${restaurant.restaurantId}`}
              className="block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white border"
            >
              <div className="relative h-48 overflow-hidden">
                {restaurant.photos && restaurant.photos.length > 0 && restaurant.photos[0] ? (
                  <Image
                    src={restaurant.photos[0]}
                    alt={restaurant.restaurantName}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {restaurant.photos && restaurant.photos.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-md">
                    <span className="text-white text-xs">+{restaurant.photos.length - 1} photos</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{restaurant.restaurantName}</h2>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(restaurant.avgRating) ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">
                    ({restaurant.avgRating.toFixed(1)})
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {restaurant.cuisine} • {restaurant.costRating === 1 ? '$' : restaurant.costRating === 2 ? '$$' : '$$$'}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {restaurant.totalReviews} reviews • {restaurant.bookedToday} booked today
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Available Times:</h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.availableTimes.map((time, timeIndex) => (
                      <span 
                        key={timeIndex}
                        className="px-3 py-1 bg-[#8B2615] text-white text-sm rounded-full hover:bg-[#a13425] transition-colors"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-4xl font-bold mb-6 mt-12">
          Top Rated
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.topRated.map((restaurant) => (
            <Link 
              key={restaurant.id} 
              href={`/restaurant/${restaurant.id}`}
              className="block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white border p-4"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  {restaurant.photos && restaurant.photos.length > 0 && restaurant.photos[0] ? (
                    <Image
                      src={restaurant.photos[0]}
                      alt={restaurant.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#8B2615]">{restaurant.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(restaurant.avgStarRating) ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="ml-1">({restaurant.avgStarRating.toFixed(1)})</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {restaurant.cuisine} • {restaurant.costRating === 1 ? '$' : restaurant.costRating === 2 ? '$$' : '$$$'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.topBookedToday.length > 0 && (
          <>
            <div className="text-4xl font-bold mb-6 mt-12">
              Top Booked Today
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.topBookedToday.map((restaurant) => (
                <Link 
                  key={restaurant.id} 
                  href={`/restaurant/${restaurant.id}`}
                  className="block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white border p-4"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      {restaurant.photos && restaurant.photos.length > 0 && restaurant.photos[0] ? (
                        <Image
                          src={restaurant.photos[0]}
                          alt={restaurant.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No photo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#8B2615]">{restaurant.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(restaurant.avgStarRating) ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="ml-1">({restaurant.avgStarRating.toFixed(1)})</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {restaurant.cuisine} • {restaurant.costRating === 1 ? '$' : restaurant.costRating === 2 ? '$$' : '$$$'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {categories.nearYou.length > 0 && (
          <>
            <div className="text-4xl font-bold mb-6 mt-12">
              Near You
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.nearYou.map((restaurant) => (
                <Link 
                  key={restaurant.id} 
                  href={`/restaurant/${restaurant.id}`}
                  className="block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white border p-4"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      {restaurant.photos && restaurant.photos.length > 0 && restaurant.photos[0] ? (
                        <Image
                          src={restaurant.photos[0]}
                          alt={restaurant.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No photo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#8B2615]">{restaurant.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(restaurant.avgStarRating) ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="ml-1">({restaurant.avgStarRating.toFixed(1)})</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {restaurant.cuisine} • {restaurant.costRating === 1 ? '$' : restaurant.costRating === 2 ? '$$' : '$$$'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="text-center py-4 text-sm text-gray-600 border-t">
        <div>(C) 2025 Maverick, Inc</div>
        <div className="flex justify-center gap-4 mt-2">
          <Github size={16} />
          <Twitter size={16} />
        </div>
      </footer>
    </div>
  );
}

function CategorySection({ category }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${BASE_URL}/restaurants/search?cuisine=${category.name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        const data = await response.json();
        setRestaurants(data.slice(0, 4)); // Show only first 4 restaurants
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [category.name]);

  if (loading) {
    return (
      <div className="border rounded-md p-4">
        <h2 className="text-xl text-[#8B2615] font-medium mb-4">{category.name}</h2>
        <div className="animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 py-3 border-t">
              <div className="w-15 h-15 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-md p-4">
        <h2 className="text-xl text-[#8B2615] font-medium mb-4">{category.name}</h2>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4">
      <h2 className="text-xl text-[#8B2615] font-medium mb-4">{category.name}</h2>
      {restaurants.map((restaurant) => (
        <Link 
          key={restaurant.restaurantId} 
          href={`/restaurant/${restaurant.restaurantId}`}
          className="flex gap-3 py-3 border-t group hover:bg-gray-50 transition-colors"
        >
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            {restaurant.photos && restaurant.photos.length > 0 ? (
              <Image
                src={restaurant.photos[0]}
                alt={restaurant.name}
                width={80}
                height={80}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No photo</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium group-hover:text-[#8B2615] transition-colors">{restaurant.name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(restaurant.avgRating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="ml-1">({restaurant.avgRating.toFixed(1)})</span>
            </div>
            <p className="text-sm text-gray-600">
              {restaurant.cuisine} • {restaurant.costRating === 1 ? '$' : restaurant.costRating === 2 ? '$$' : '$$$'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}