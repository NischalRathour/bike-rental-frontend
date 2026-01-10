import { Link } from "react-router-dom";
import "../styles/Bikes.css";

export default function Bikes() {
  const bikes = [
    { _id: 1, name: "Yamaha R15", price: 1200, status: "Available", images: ["/images/bike1.jpg"], description: "Sporty motorcycle for city rides." },
    { _id: 2, name: "Honda CB500X", price: 1500, status: "Available", images: ["/images/bike2.jpg"], description: "Adventure touring motorcycle." },
    { _id: 3, name: "KTM Duke 390", price: 1300, status: "Available", images: ["/images/bike3.jpg"], description: "High performance street bike." },
    { _id: 4, name: "Royal Enfield Classic 350", price: 1100, status: "Available", images: ["/images/bike4.jpg"], description: "Classic cruiser with vintage style." },
    { _id: 5, name: "Suzuki Gixxer", price: 1000, status: "Available", images: ["/images/bike5.jpg"], description: "Lightweight commuter bike." },
    { _id: 6, name: "Bajaj Pulsar NS200", price: 900, status: "Available", images: ["/images/bike6.jpg"], description: "Sporty and affordable." },
    { _id: 7, name: "KTM RC 200", price: 1400, status: "Available", images: ["/images/bike7.jpg"], description: "Racing style street bike." },
    { _id: 8, name: "Hero Xtreme 200S", price: 950, status: "Available", images: ["/images/bike8.jpg"], description: "Reliable commuter bike." },
    { _id: 9, name: "Honda CB Shine", price: 800, status: "Available", images: ["/images/bike9.jpg"], description: "Compact daily rider." },
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
