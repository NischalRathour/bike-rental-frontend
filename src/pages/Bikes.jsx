import { Link } from "react-router-dom";
import "../styles/Bikes.css";

export default function Bikes() {
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

  const availableBikes = bikes.filter(bike => bike.status === "Available");

  return (
    <div className="bikes-container">
      <header className="bikes-header">
        <h1>Available Motorcycles 🏍️</h1>
        <p>Click on a bike to see details and book your ride today!</p>
      </header>

      <div className="bike-grid">
        {availableBikes.map((bike) => (
          <div className="bike-card" key={bike._id}>
            <div className="bike-image">
              <img
                src={bike.images[0] || "/images/default-bike.jpg"}
                alt={bike.name}
              />
            </div>

            <div className="bike-info">
              <h3>{bike.name}</h3>
              <p className="price">Rs. {bike.price} / day</p>
              <span className="status available">Available</span>

              <div className="bike-actions">
                <Link to={`/bikes/${bike._id}`}>
                  <button className="view-btn">View Details</button>
                </Link>
                <Link to={`/book/${bike._id}`}>
                  <button className="book-btn">Book Now</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
