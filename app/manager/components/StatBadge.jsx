"use client";
import React from "react";
// import PropTypes from "prop-types";

const StatBadge = ({ title, value }) => (
  <div className="bg-slate-100 text-slate-700 rounded-lg px-4 py-2 flex flex-col items-center min-w-[80px]">
    <div className="text-xs font-medium uppercase tracking-wide">{title}</div>
    <div className="text-lg font-bold">{value}</div>
  </div>
);

// StatBadge.propTypes = {
//   title: PropTypes.string.isRequired,
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
// };

export default StatBadge; 