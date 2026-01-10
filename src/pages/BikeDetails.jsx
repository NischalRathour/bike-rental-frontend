import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Bikes.css";

export default function BikeDetails() {
  const { id } = useParams();
  const [bike, setBike] = useState(null);

  useEffect(() => {
    api.get(`/bikes/${id}`)
      .then((res) => setBike(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!bike) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  return (
    <div className="bike-details-container" style={{ padding: "30px" }}>
      <h2>{bike.name}</h2>
      <p>Price: Rs {bike.price} / day</p>
      <p>{bike.description}</p>

      <div className="bike-images">
        {bike.images?.map((img, index) => (
          <img
            key={index}
            src={img || "/images/default-bike.jpg"}
            alt={`${bike.name}-${index}`}
            style={{ width: "300px", marginRight: "10px", borderRadius: "10px" }}
          />
        ))}
      </div>

      <button style={{ marginTop: "20px" }} disabled={bike.status !== "Available"}>
        {bike.status === "Available" ? "Book Now" : "Not Available"}
      </button>
    </div>
  );
}
