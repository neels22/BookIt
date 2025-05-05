import { StarIcon } from "@/components/common/StarIcon";
import Image from "next/image";

export function RestaurantCard({
  name,
  image,
  rating,
  cuisine,
  priceRange,
  region,
  bookings,
  time,
  variant = "default", // default variant if none is passed
}) {
  return (
    <div
      className={`border rounded-md overflow-hidden ${
        variant === "search" ? "w-4/5 flex" : "min-w-[250px]"
      }`}
    >
      {/* Adjust image container height based on variant */}
      <div className={`relative ${variant === "search" ? "h-30 w-30" : "h-[150px]"}`}>
        <Image
          src={image || "https://plus.unsplash.com/premium_photo-1675344317686-118cc9f89f8a?q=80&w=2940&auto=format&fit=crop"}
          alt="Restaurant table"
          layout="fill"
          objectFit={ ` ${variant==="search" ? "fill" : "cover" }  ` }
          className= {` ${variant === "search" ? "h-30 w-30" : "w-full"} `}
        />
      </div>

      <div className={`p-3 ${variant === "search" ? "py-2" : "py-3"}`}>
        <h3 className={`font-medium ${variant === "search" ? "text-sm" : "text-base"}`}>{name}</h3>
        <div className="flex items-center text-xs">
          <div className="flex text-yellow-400">
            {[1, 2, 3].map((star) => (
              <StarIcon key={star} className="h-3 w-3" />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(Round down review #)</span>
        </div>
        <div className="text-xs text-gray-500">
          {cuisine} | {priceRange} | {region}
        </div>
        <div className="text-xs mt-2">Booked {bookings} times today</div>
        <div className="flex gap-1 mt-2">
          <button className="bg-[#f8f5f0] text-xs px-2 py-1 rounded">
            {time - 30}
          </button>
          <button className="bg-[#f8f5f0] text-xs px-2 py-1 rounded">
            {time}
          </button>
          <button className="bg-[#f8f5f0] text-xs px-2 py-1 rounded">
            {time + 30}
          </button>
        </div>
      </div>
    </div>
  );
}
