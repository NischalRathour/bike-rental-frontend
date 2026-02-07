import React from "react";

const BikeCard = ({ bike }) => {
  return (
    <div className="bike-card">
      <h4>{bike.name}</h4>
      <p>Type: {bike.type}</p>
      <p>Price: Rs {bike.price}/day</p>
      <button>Book Now</button>
    </div>
  );
};

export default BikeCard;