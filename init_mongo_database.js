/**
 * init_mongo_database.js
 * 
 * MongoDB Shell (mongosh) Initialization & Seeding Script
 * Course: Web Lab (Course Code: 2345117) - Experiment 5 & 6
 * Project: Pet Care Management System
 * 
 * Instructions:
 * - Run directly in mongosh:
 *     mongosh < init_mongo_database.js
 *   OR inside mongosh:
 *     load("init_mongo_database.js")
 * - Can also be copied and pasted directly into MongoDB Compass "MONGOSH" tab.
 */

// 1. Switch to petcare_db database (creates it if it does not exist)
use petcare_db;

print("=================================================");
print("🐾 Initializing Pet Care Management System Database");
print("=================================================");

// 2. Drop existing collections to start fresh
db.users.drop();
db.pets.drop();
db.services.drop();
db.appointments.drop();
db.medicalrecords.drop();
print("✓ Purged old collections if any existed.");

// 3. Create Collections with Validation & Indexes
db.createCollection("users");
db.createCollection("pets");
db.createCollection("services");
db.createCollection("appointments");
db.createCollection("medicalrecords");

db.users.createIndex({ email: 1 }, { unique: true });
db.pets.createIndex({ owner: 1 });
db.appointments.createIndex({ appointmentDate: 1, pet: 1 });
print("✓ Created 5 collections and query indexes.");

// 4. Seed Users (1 Veterinarian / Admin, 3 Pet Owners)
// Password for all demo accounts is 'password123' (Bcrypt hash: $2a$10$w8T9rK21bQzJ9L1XeQ6UxeF62N2Y1qN3jP3K0aV.Y5p4O8qU.eMfa)
const adminId = new ObjectId("67018300f19c927d3b018390");
const owner1Id = new ObjectId("67018300f19c927d3b018391");
const owner2Id = new ObjectId("67018300f19c927d3b018392");
const owner3Id = new ObjectId("67018300f19c927d3b018393");

db.users.insertMany([
  {
    _id: adminId,
    name: "Dr. Parag Sharma",
    email: "admin@petcare.com",
    phone: "9876543210",
    password: "$2a$10$w8T9rK21bQzJ9L1XeQ6UxeF62N2Y1qN3jP3K0aV.Y5p4O8qU.eMfa", // password123
    role: "veterinarian",
    createdAt: new Date()
  },
  {
    _id: owner1Id,
    name: "Tanuj Sharma",
    email: "owner@petcare.com",
    phone: "9811223344",
    password: "$2a$10$w8T9rK21bQzJ9L1XeQ6UxeF62N2Y1qN3jP3K0aV.Y5p4O8qU.eMfa", // password123
    role: "owner",
    createdAt: new Date()
  },
  {
    _id: owner2Id,
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "9822334455",
    password: "$2a$10$w8T9rK21bQzJ9L1XeQ6UxeF62N2Y1qN3jP3K0aV.Y5p4O8qU.eMfa", // password123
    role: "owner",
    createdAt: new Date()
  },
  {
    _id: owner3Id,
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "9833445566",
    password: "$2a$10$w8T9rK21bQzJ9L1XeQ6UxeF62N2Y1qN3jP3K0aV.Y5p4O8qU.eMfa", // password123
    role: "owner",
    createdAt: new Date()
  }
]);
print("✓ Seeded 4 Users (1 Admin/Vet + 3 Pet Owners).");

// 5. Seed Services
db.services.insertMany([
  {
    name: "General Health Checkup",
    description: "Complete physical examination, vital checks, and nutritional guidance.",
    price: 500,
    duration: "30 mins",
    createdAt: new Date()
  },
  {
    name: "Vaccination & Immunization",
    description: "Core preventive vaccines (Rabies, DHPPi, Tricat, Anti-Parasitic).",
    price: 800,
    duration: "20 mins",
    createdAt: new Date()
  },
  {
    name: "Grooming & Spa",
    description: "Medicated bath, coat styling, nail clipping, and ear canal cleaning.",
    price: 1200,
    duration: "60 mins",
    createdAt: new Date()
  },
  {
    name: "Dental Care & Scaling",
    description: "Oral hygiene assessment, dental plaque removal, and gum prophylaxis.",
    price: 1500,
    duration: "45 mins",
    createdAt: new Date()
  },
  {
    name: "Emergency Trauma Consultation",
    description: "Immediate critical trauma stabilization, fluid therapy, and 24/7 ICU support.",
    price: 2000,
    duration: "60 mins",
    createdAt: new Date()
  }
]);
print("✓ Seeded 5 Clinic Services.");

// 6. Seed Pets
const pet1Id = new ObjectId("6701844af19c927d3b018401");
const pet2Id = new ObjectId("6701844af19c927d3b018402");
const pet3Id = new ObjectId("6701844af19c927d3b018403");
const pet4Id = new ObjectId("6701844af19c927d3b018404");

db.pets.insertMany([
  {
    _id: pet1Id,
    name: "Bruno",
    species: "Dog",
    breed: "Labrador Retriever",
    gender: "Male",
    age: 3,
    dateOfBirth: new Date("2023-04-12"),
    weight: 24.5,
    color: "Golden Yellow",
    owner: owner1Id,
    vaccinationStatus: "Vaccinated",
    medicalNotes: "Friendly, healthy canine. Rabies vaccination verified.",
    createdAt: new Date()
  },
  {
    _id: pet2Id,
    name: "Milo",
    species: "Cat",
    breed: "Persian Longhair",
    gender: "Male",
    age: 2,
    dateOfBirth: new Date("2024-02-15"),
    weight: 4.5,
    color: "Pure Snow White",
    owner: owner1Id,
    vaccinationStatus: "Vaccinated",
    medicalNotes: "Indoor cat, calm temperament, regular grooming required.",
    createdAt: new Date()
  },
  {
    _id: pet3Id,
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    gender: "Male",
    age: 4,
    dateOfBirth: new Date("2022-08-20"),
    weight: 12.0,
    color: "Tricolor (White/Brown/Black)",
    owner: owner2Id,
    vaccinationStatus: "Pending",
    medicalNotes: "Annual rabies booster overdue by 2 weeks.",
    createdAt: new Date()
  },
  {
    _id: pet4Id,
    name: "Bella",
    species: "Dog",
    breed: "Golden Retriever",
    gender: "Female",
    age: 1.5,
    dateOfBirth: new Date("2025-01-10"),
    weight: 22.0,
    color: "Cream",
    owner: owner3Id,
    vaccinationStatus: "Vaccinated",
    medicalNotes: "No known food allergies, active agility dog.",
    createdAt: new Date()
  }
]);
print("✓ Seeded 4 Pets (Bruno, Milo, Charlie, Bella).");

// 7. Seed Appointments
db.appointments.insertMany([
  {
    pet: pet1Id,
    owner: owner1Id,
    veterinarian: adminId,
    service: "General Health Checkup",
    appointmentDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    appointmentTime: "10:30 AM",
    reason: "Routine seasonal wellness examination & ear check",
    notes: "Patient is active and feeding well.",
    status: "Confirmed",
    createdAt: new Date()
  },
  {
    pet: pet2Id,
    owner: owner1Id,
    veterinarian: adminId,
    service: "Grooming & Spa",
    appointmentDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    appointmentTime: "11:30 AM",
    reason: "Fur de-shedding and claw trim",
    notes: "Sensitive skin shampoo requested",
    status: "Pending",
    createdAt: new Date()
  },
  {
    pet: pet3Id,
    owner: owner2Id,
    veterinarian: adminId,
    service: "Vaccination & Immunization",
    appointmentDate: new Date(Date.now() - 86400000 * 3), // 3 days ago
    appointmentTime: "02:00 PM",
    reason: "Overdue Rabies and DHPPi booster administration",
    notes: "Completed vaccination with certification issued.",
    status: "Completed",
    createdAt: new Date()
  }
]);
print("✓ Seeded 3 Appointments (Confirmed, Pending, Completed).");

// 8. Seed Medical Records
db.medicalrecords.insertMany([
  {
    pet: pet1Id,
    veterinarian: adminId,
    visitDate: new Date(Date.now() - 86400000 * 10),
    diagnosis: "Mild Seasonal Contact Dermatitis",
    symptoms: "Pruritus, mild erythema on ventral abdomen",
    treatment: "Topical antiseptic wash & oral antihistamines",
    prescription: "Tab Cetirizine 10mg: 1 tab daily x 5 days. Dermacare spray topically BID.",
    vaccination: "Rabies Booster #RB-2026-9",
    notes: "Patient tolerated treatment well. Discontinue grain-based snacks.",
    createdAt: new Date()
  },
  {
    pet: pet2Id,
    veterinarian: adminId,
    visitDate: new Date(Date.now() - 86400000 * 25),
    diagnosis: "Annual Feline Wellness Inspection",
    symptoms: "None reported. Active and playful.",
    treatment: "Dental examination, weight audit, cardiac auscultation normal",
    prescription: "Tricat Trio nutritional gel: 1 tsp daily with food",
    vaccination: "Feline FVRCP Annual Booster",
    notes: "Healthy body condition score 5/9. Next visit due in 6 months.",
    createdAt: new Date()
  }
]);
print("✓ Seeded 2 Clinical Medical Records with Prescriptions & Passports.");

print("=================================================");
print("🎉 petcare_db DATABASE CREATED AND SEEDED SUCCESSFULLY!");
print("=================================================");
print("Collections Summary:");
print(" - users: " + db.users.countDocuments());
print(" - pets: " + db.pets.countDocuments());
print(" - services: " + db.services.countDocuments());
print(" - appointments: " + db.appointments.countDocuments());
print(" - medicalrecords: " + db.medicalrecords.countDocuments());
print("=================================================");
