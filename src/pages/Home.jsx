import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-text">
          <h1>Ride N Roar 🏍️</h1>
          <p>Rent motorcycles easily, quickly, and affordably.</p>
          <a href="/bikes" className="hero-btn">Explore Bikes</a>
        </div>

        <img 
          src="https://i.imgur.com/m5I8rbO.jpeg" 
          alt="Bike"
          className="hero-img"
        />
      </section>
    </div>
  );
}
