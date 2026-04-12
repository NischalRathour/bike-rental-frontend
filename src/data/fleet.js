/**
 * 🏍️ RIDE N ROAR - DYNAMIC FLEET ASSETS
 * Logic: All image paths point to the local /public/images directory.
 * The _id fields are synchronized to match MongoDB BSON patterns.
 */

export const bikesData = [
  {
    _id: "b1",
    name: "Hunter 350",
    brand: "Royal Enfield",
    price: 950,
    modelYear: "2024 Edition",
    mileage: "45 kmpl",
    engine: "350cc J-Series",
    seats: "2 Seats",
    gear: "5-Speed Manual",
    fuel: "Petrol",
    rating: 4.8,
    reviews: 12,
    description: "The Hero Xtreme 200S is a fully-faired, sporty commuter. It offers a perfect balance of performance for Kathmandu's streets and comfort for longer city rides.",
    // ✅ Updated to your local public folder image
    images: ["/images/royal-enfield-1.jpg"] 
  },
  {
    _id: "b2",
    name: "Duke 200",
    brand: "KTM",
    price: 2000,
    modelYear: "2023 Edition",
    mileage: "35 kmpl",
    engine: "199cc Liquid Cooled",
    seats: "2 Seats",
    gear: "6-Speed Manual",
    fuel: "Petrol",
    rating: 5.0,
    reviews: 8,
    description: "The King of Street bikes. Experience raw power and precision with the KTM Duke. Perfect for navigating Kathmandu traffic with agility.",
    // ✅ Updated to your local public folder image
    images: ["/images/ktm-duke-2.jpg"]
  },
  {
    _id: "b3",
    name: "CB 350 RS",
    brand: "Honda",
    price: 1500,
    modelYear: "2024 Model",
    mileage: "28 kmpl",
    engine: "348cc Parallel-Twin",
    seats: "2 Seats",
    gear: "5-Speed Manual",
    fuel: "Petrol",
    rating: 4.9,
    reviews: 15,
    description: "A modern-classic adventurer perfect for Nepal's varied terrain. Smooth power delivery and upright seating make it ideal for the ride from Kathmandu to Pokhara.",
    // ✅ Updated to your local public folder image
    images: ["/images/honda-cb350-1.jpg"]
  },
  {
    _id: "b4",
    name: "Pulsar N160",
    brand: "Bajaj",
    price: 900,
    modelYear: "2024 Edition",
    mileage: "45 kmpl",
    engine: "160cc Oil Cooled",
    seats: "2 Seats",
    gear: "5-Speed Manual",
    fuel: "Petrol",
    rating: 4.6,
    reviews: 42,
    description: "The perfect balance of power and efficiency. The N160 provides a sporty feel for city commuting with incredible fuel economy.",
    // ✅ Updated to your local public folder image
    images: ["/images/bajaj-pulsar-1.jpg"]
  },
  {
    _id: "b5",
    name: "R15 V4",
    brand: "Yamaha",
    price: 1300,
    modelYear: "2025 Model",
    mileage: "40 kmpl",
    engine: "155cc VVA Liquid Cooled",
    seats: "2 Seats",
    gear: "6-Speed Manual",
    fuel: "Petrol",
    rating: 4.8,
    reviews: 19,
    description: "Race-bred performance. The R15 V4 brings track technology to the street with Traction Control and a highly efficient VVA engine.",
    // ✅ Updated to your local public folder image
    images: ["/images/bike1.jpg"]
  },
  {
    _id: "b9",
    name: "RC 390",
    brand: "KTM",
    price: 2500,
    modelYear: "2026 Model",
    mileage: "25 kmpl",
    engine: "373cc Liquid Cooled",
    seats: "2 Seats",
    gear: "6-Speed Manual",
    fuel: "Petrol",
    rating: 5.0,
    reviews: 25,
    description: "The ultimate supersport machine for the streets. Built for all roads, and no roads, providing massive torque and high-speed stability.",
    // ✅ Updated to your local public folder image
    images: ["/images/ktm-duke-3.jpg"]
  }
];