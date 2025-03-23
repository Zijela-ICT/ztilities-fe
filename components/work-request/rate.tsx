import createAxiosInstance from "@/utils/api";
import React, { useState } from "react";

const Star = ({ filled, onClick }) => (
  <span
    onClick={onClick}
    style={{
      cursor: "pointer",
      fontSize: "2.0rem",
      color: filled ? "#A8353A" : "gray",
    }}
  >
    {filled ? "★" : "☆"}
  </span>
);

const StarRating = ({ rating, onRate }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} filled={star <= rating} onClick={() => onRate(star)} />
      ))}
    </div>
  );
};

export default function RatingsForm({
  activeRowId,
  setModalState,
  setSuccessState,
}) {
  const axiosInstance = createAxiosInstance();

  const [ratings, setRatings] = useState([
    { entity: "Customer Service", rate: 1 },
    { entity: "Vendor/Technician", rate: 1 },
    { entity: "FM Company", rate: 1 },
  ]);

  const handleRateChange = (index, newRate) => {
    const newRatings = [...ratings];
    newRatings[index].rate = newRate;
    setRatings(newRatings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.patch(`/work-orders/${activeRowId}/rate`, { ratings });

    setModalState("");
    setSuccessState({
      title: "Successful",
      detail: "Ratings submitted successfully.",
      status: true,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-12 px-6 max-w-full sm:mt-6 pb-12"
    >
      {ratings.map((item, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {item.entity}
          </label>
          <StarRating
            rating={item.rate}
            onRate={(rate) => handleRateChange(index, rate)}
          />
        </div>
      ))}
      <div className="mt-10 flex w-full justify-end">
        <button
          type="submit"
          className="block rounded-md bg-[#A8353A] px-4 py-3.5 text-center text-xs font-semibold text-white"
        >
          Rate
        </button>
      </div>
    </form>
  );
}
