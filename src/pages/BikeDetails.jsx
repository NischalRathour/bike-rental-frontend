import { useParams, Link } from "react-router-dom";
import "../styles/Bikes.css";

const bikes = [
  { _id: "694d0605a48ce99e1d178757", name: "Hero Xtreme 200S", price: 950, status: "Available", images: ["/images/bike8.jpg"], description: "Reliable commuter bike." },
  { _id: "694d0605a48ce99e1d178758", name: "Honda CB Shine", price: 800, status: "Available", images: ["/images/bike9.jpg"], description: "Compact daily rider." },
  { _id: "6965387ac8f1e5c605231295", name: "Suzuki GSX-R1000", price: 2000, status: "Available", images: ["/images/bike3.jpg"], description: "High performance street bike." },
  { _id: "696ba6bd1bad3c26a3d1fbb1", name: "Kawasaki Ninja 650", price: 1800, status: "Available", images: ["/images/bike4.jpg"], description: "Sporty motorcycle for city rides." },
  { _id: "696bbe5938845977a85bd20f", name: "Yamaha R15", price: 1200, status: "Available", images: ["/images/bike1.jpg"], description: "Sporty motorcycle for city rides." },
  { _id: "696bcafd3f3bf6e595727048", name: "Honda CB500X", price: 1500, status: "Available", images: ["/images/bike2.jpg"], description: "Adventure touring motorcycle." },
  { _id: "696ba5931bad3c26a3d1fbac", name: "KTM Duke 390", price: 1300, status: "Available", images: ["/images/bike3.jpg"], description: "High performance street bike." },
  { _id: "69652c02c8f1e5c605231289", name: "Royal Enfield Classic 350", price: 1100, status: "Available", images: ["/images/bike4.jpg"], description: "Classic cruiser with vintage style." },
  { _id: "6965387ac8f1e5c605231296", name: "Suzuki Gixxer", price: 1000, status: "Available", images: ["/images/bike5.jpg"], description: "Lightweight commuter bike." },
];

export default function BikeDetails() {
  const { id } = useParams();
  const bike = bikes.find((b) => b._id === id);

  if (!bike) {
    return <h2 style={{ padding: "20px" }}>Bike not found</h2>;
  }

  return (
    <div className="bike-details-container" style={{ padding: "30px" }}>
      <h2>{bike.name}</h2>
      <p>Price: Rs {bike.price} / day</p>
      <p>{bike.description}</p>

      <div className="bike-images">
        {bike.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={bike.name}
            style={{ width: "300px", marginRight: "10px", borderRadius: "10px" }}
          />
        ))}
      </div>

      <Link to={`/book/${bike._id}`}>
        <button style={{ marginTop: "20px" }}>
          Book Now
        </button>
      </Link>
    </div>
  );
}
