/**
 * create_db_node.js
 * 
 * Node.js script using Mongoose to create and populate the petcare_db database in MongoDB.
 * Usage:
 *   node create_db_node.js [optional_mongo_uri]
 * Example:
 *   node create_db_node.js mongodb://127.0.0.1:27017/petcare_db
 *   node create_db_node.js "mongodb+srv://admin:pass@cluster.mongodb.net/petcare_db"
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const customUri = process.argv[2];
const MONGO_URI = customUri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/petcare_db';

console.log('==================================================');
console.log('🐾 PetCare Management System - MongoDB Database Setup');
console.log('==================================================');
console.log(`Connecting to: ${MONGO_URI.replace(/:([^:@]+)@/, ':****@')}`);

async function main() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✓ Successfully connected to MongoDB server!');

    const db = mongoose.connection.db;

    // Drop previous collections
    const collections = await db.listCollections().toArray();
    const colNames = collections.map(c => c.name);

    for (const name of ['users', 'pets', 'services', 'appointments', 'medicalrecords']) {
      if (colNames.includes(name)) {
        await db.collection(name).drop();
        console.log(`  - Dropped existing collection: ${name}`);
      }
    }

    // 1. Seed Users
    const usersCol = db.collection('users');
    const adminId = new mongoose.Types.ObjectId('67018300f19c927d3b018390');
    const owner1Id = new mongoose.Types.ObjectId('67018300f19c927d3b018391');
    const owner2Id = new mongoose.Types.ObjectId('67018300f19c927d3b018392');

    // Password 'password123'
    const passwordHash = '$2a$10$w8T9rK21bQzJ9L1XeQ6UxeF62N2Y1qN3jP3K0aV.Y5p4O8qU.eMfa';

    await usersCol.insertMany([
      {
        _id: adminId,
        name: 'Dr. Parag Sharma',
        email: 'admin@petcare.com',
        phone: '9876543210',
        password: passwordHash,
        role: 'veterinarian',
        createdAt: new Date()
      },
      {
        _id: owner1Id,
        name: 'Tanuj Sharma',
        email: 'owner@petcare.com',
        phone: '9811223344',
        password: passwordHash,
        role: 'owner',
        createdAt: new Date()
      },
      {
        _id: owner2Id,
        name: 'Priya Patel',
        email: 'priya@example.com',
        phone: '9822334455',
        password: passwordHash,
        role: 'owner',
        createdAt: new Date()
      }
    ]);
    console.log('✓ Seeded Users collection');

    // 2. Seed Services
    const servicesCol = db.collection('services');
    await servicesCol.insertMany([
      { name: 'General Health Checkup', description: 'Complete physical checkup & vitals', price: 500, duration: '30 mins', createdAt: new Date() },
      { name: 'Vaccination & Immunization', description: 'Core preventative vaccines', price: 800, duration: '20 mins', createdAt: new Date() },
      { name: 'Grooming & Spa', description: 'Bath, hair trimming & ear cleaning', price: 1200, duration: '60 mins', createdAt: new Date() },
      { name: 'Dental Care & Scaling', description: 'Oral inspection & tartar cleaning', price: 1500, duration: '45 mins', createdAt: new Date() },
      { name: 'Emergency Consultation', description: '24/7 Critical care & stabilization', price: 2000, duration: '60 mins', createdAt: new Date() }
    ]);
    console.log('✓ Seeded Services collection');

    // 3. Seed Pets
    const petsCol = db.collection('pets');
    const pet1Id = new mongoose.Types.ObjectId('6701844af19c927d3b018401');
    const pet2Id = new mongoose.Types.ObjectId('6701844af19c927d3b018402');

    await petsCol.insertMany([
      {
        _id: pet1Id,
        name: 'Bruno',
        species: 'Dog',
        breed: 'Labrador Retriever',
        gender: 'Male',
        age: 3,
        weight: 24.5,
        color: 'Golden Yellow',
        owner: owner1Id,
        vaccinationStatus: 'Vaccinated',
        medicalNotes: 'Friendly, active family canine. Rabies immunization verified.',
        createdAt: new Date()
      },
      {
        _id: pet2Id,
        name: 'Milo',
        species: 'Cat',
        breed: 'Persian Longhair',
        gender: 'Male',
        age: 2,
        weight: 4.5,
        color: 'White',
        owner: owner1Id,
        vaccinationStatus: 'Vaccinated',
        medicalNotes: 'Indoor cat, sensitive coat, regular de-shedding needed.',
        createdAt: new Date()
      }
    ]);
    console.log('✓ Seeded Pets collection');

    // 4. Seed Appointments
    const apptsCol = db.collection('appointments');
    await apptsCol.insertMany([
      {
        pet: pet1Id,
        owner: owner1Id,
        veterinarian: adminId,
        service: 'General Health Checkup',
        appointmentDate: new Date(Date.now() + 86400000 * 2),
        appointmentTime: '10:30 AM',
        reason: 'Routine seasonal checkup and wellness inspection',
        status: 'Confirmed',
        createdAt: new Date()
      },
      {
        pet: pet2Id,
        owner: owner1Id,
        veterinarian: adminId,
        service: 'Grooming & Spa',
        appointmentDate: new Date(Date.now() + 86400000 * 3),
        appointmentTime: '11:30 AM',
        reason: 'De-shedding coat trim & nail clip',
        status: 'Pending',
        createdAt: new Date()
      }
    ]);
    console.log('✓ Seeded Appointments collection');

    // 5. Seed Medical Records
    const medCol = db.collection('medicalrecords');
    await medCol.insertMany([
      {
        pet: pet1Id,
        veterinarian: adminId,
        visitDate: new Date(Date.now() - 86400000 * 10),
        diagnosis: 'Seasonal Contact Dermatitis',
        symptoms: 'Mild itching on paws and abdomen',
        treatment: 'Antihistamine wash and oral tablets',
        prescription: 'Cetirizine 10mg daily x 5 days',
        vaccination: 'Rabies Booster #RB-2026',
        notes: 'Advised single-protein diet.',
        createdAt: new Date()
      }
    ]);
    console.log('✓ Seeded Medical Records collection');

    console.log('==================================================');
    console.log('🎉 SUCCESS: MongoDB database "petcare_db" is ready!');
    console.log('==================================================');
    console.log('Collections created:');
    console.log(` - users: ${(await usersCol.countDocuments())} documents`);
    console.log(` - pets: ${(await petsCol.countDocuments())} documents`);
    console.log(` - services: ${(await servicesCol.countDocuments())} documents`);
    console.log(` - appointments: ${(await apptsCol.countDocuments())} documents`);
    console.log(` - medicalrecords: ${(await medCol.countDocuments())} documents`);
    console.log('==================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Could not connect to MongoDB server:', err.message);
    console.log('\n👉 Instructions to run MongoDB:');
    console.log('1. If running locally, make sure MongoDB Service is started:');
    console.log('   net start MongoDB   (or open MongoDB Compass and connect to localhost:27017)');
    console.log('2. If using MongoDB Atlas Cloud:');
    console.log('   node create_db_node.js "mongodb+srv://<user>:<password>@cluster0.mongodb.net/petcare_db"');
    process.exit(1);
  }
}

main();
