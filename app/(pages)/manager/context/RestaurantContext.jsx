"use client";
import React, { createContext, useContext, useState } from "react";
// import PropTypes from "prop-types";
import { uuid } from "../utils/uuid";

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Add a new restaurant
  const addRestaurant = (restaurant) => {
    setRestaurants((prev) => [
      ...prev,
      { ...restaurant, id: uuid(), tables: [] },
    ]);
  };

  // Add tables to a restaurant
  const addTables = (restaurantId, tablesArray) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? { ...r, tables: [...r.tables, ...tablesArray] }
          : r
      )
    );
  };

  // Toggle table occupied status
  const toggleTableOccupied = (restaurantId, tableId) => {
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? {
              ...r,
              tables: r.tables.map((t) =>
                t.id === tableId ? { ...t, occupied: !t.occupied } : t
              ),
            }
          : r
      )
    );
  };

  // Set selected restaurant
  const setSelectedRestaurant = (id) => {
    setSelectedRestaurantId(id);
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        selectedRestaurantId,
        addRestaurant,
        addTables,
        toggleTableOccupied,
        setSelectedRestaurant,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

// RestaurantProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

export const useRestaurantContext = () => useContext(RestaurantContext); 