import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";

export default function BikeDetails() {
  const { id } = useParams();
  const [bike, setBike] = useState(null);

  useEffect(() => {
    api.get(`/bikes/${id}`).then((res) => setBike(res.data));
  }, [id]);

  if (!bike) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>{bike.name}</h2>
      <p>Price: Rs {bike.price}/day</p>
      <p>{bike.description}</p>
    </div>
  );
}
