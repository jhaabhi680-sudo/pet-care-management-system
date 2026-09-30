import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import Pet from './models/Pet.js';
import Service from './models/Service.js';
import Appointment from './models/Appointment.js';
import MedicalRecord from './models/MedicalRecord.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/petcare_db';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Service.deleteMany({});
    await Appointment.deleteMany({});
    await MedicalRecord.deleteMany({});
    console.log('🧹 Purged existing database collections.');

    // 1. Create 1 Admin / Veterinarian and 3 Pet Owners
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.create([
      {
        name: 'Dr. Aditi Sharma',
        email: 'admin@petcare.com',
        phone: '9876543210',
        password: 'password123', // Will be hashed by pre-save hook
        role: 'veterinarian',
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        phone: '9811223344',
        password: 'password123',
        role: 'owner',
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        phone: '9822334455',
        password: 'password123',
        role: 'owner',
      },
      {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        phone: '9833445566',
        password: 'password123',
        role: 'owner',
      },
    ]);

    const [adminVet, owner1, owner2, owner3] = users;
    console.log('✅ Created 1 Admin/Vet and 3 Pet Owners.');

    // 2. Create 5 Services
    const services = await Service.create([
      {
        name: 'General Consultation',
        description: 'Comprehensive physical examination, vital checks, and veterinary advice.',
        price: 500,
        duration: '30 mins',
      },
      {
        name: 'Vaccination & Immunization',
        description: 'Core and non-core preventive vaccine boosters (Rabies, DHPPi, Tricat).',
        price: 800,
        duration: '20 mins',
      },
      {
        name: 'Grooming & Spa',
        description: 'Bath, coat brushing, hair trim, ear cleaning, and nail clipping.',
        price: 1200,
        duration: '60 mins',
      },
      {
        name: 'Dental Checkup & Scaling',
        description: 'Oral hygiene assessment, tartar removal, and gum polishing.',
        price: 1500,
        duration: '45 mins',
      },
      {
        name: 'Emergency Consultation',
        description: 'Immediate urgent trauma care, triage, and stabilization.',
        price: 2000,
        duration: '60 mins',
      },
    ]);
    console.log('✅ Created 5 Clinic Services.');

    // 3. Create 5 Pets
    const pets = await Pet.create([
      {
        name: 'Bruno',
        species: 'Dog',
        breed: 'Labrador Retriever',
        gender: 'Male',
        age: 3,
        dateOfBirth: new Date('2023-04-12'),
        weight: 24,
        color: 'Golden',
        owner: owner1._id,
        vaccinationStatus: 'Up to date',
        medicalNotes: 'Allergic to chicken flavored treats.',
      },
      {
        name: 'Milo',
        species: 'Cat',
        breed: 'Persian',
        gender: 'Male',
        age: 2,
        dateOfBirth: new Date('2024-02-15'),
        weight: 4.5,
        color: 'Pure White',
        owner: owner2._id,
        vaccinationStatus: 'Up to date',
        medicalNotes: 'Very calm demeanor, sensitive skin.',
      },
      {
        name: 'Rocky',
        species: 'Dog',
        breed: 'German Shepherd',
        gender: 'Male',
        age: 4,
        dateOfBirth: new Date('2022-08-20'),
        weight: 32,
        color: 'Black and Tan',
        owner: owner3._id,
        vaccinationStatus: 'Pending',
        medicalNotes: 'Annual booster vaccine due.',
      },
      {
        name: 'Bella',
        species: 'Dog',
        breed: 'Golden Retriever',
        gender: 'Female',
        age: 1.5,
        dateOfBirth: new Date('2025-01-10'),
        weight: 22,
        color: 'Cream',
        owner: owner1._id,
        vaccinationStatus: 'Up to date',
        medicalNotes: 'Enjoys outdoor activities, no known allergies.',
      },
      {
        name: 'Luna',
        species: 'Cat',
        breed: 'Siamese',
        gender: 'Female',
        age: 1,
        dateOfBirth: new Date('2025-05-18'),
        weight: 3.8,
        color: 'Seal Point',
        owner: owner2._id,
        vaccinationStatus: 'Up to date',
        medicalNotes: 'Active kitten, indoor pet.',
      },
    ]);
    console.log('✅ Created 5 Pets with diverse profiles.');

    // 4. Create 5 Appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 2);

    await Appointment.create([
      {
        pet: pets[0]._id, // Bruno
        owner: owner1._id,
        veterinarian: adminVet._id,
        service: 'General Consultation',
        appointmentDate: tomorrow,
        appointmentTime: '10:00 AM',
        reason: 'Routine 6-month wellness checkup',
        notes: 'Check weight and ear condition',
        status: 'Confirmed',
      },
      {
        pet: pets[1]._id, // Milo
        owner: owner2._id,
        veterinarian: adminVet._id,
        service: 'Grooming & Spa',
        appointmentDate: tomorrow,
        appointmentTime: '11:00 AM',
        reason: 'Seasonal fur grooming and bath',
        notes: 'Gentle handling requested',
        status: 'Pending',
      },
      {
        pet: pets[2]._id, // Rocky
        owner: owner3._id,
        veterinarian: adminVet._id,
        service: 'Vaccination & Immunization',
        appointmentDate: dayAfter,
        appointmentTime: '02:00 PM',
        reason: 'Annual Rabies and DHPPi booster',
        notes: 'Please update vaccination certificate',
        status: 'Pending',
      },
      {
        pet: pets[3]._id, // Bella
        owner: owner1._id,
        veterinarian: adminVet._id,
        service: 'Dental Checkup & Scaling',
        appointmentDate: dayAfter,
        appointmentTime: '04:00 PM',
        reason: 'Dental tartar inspection and clean',
        notes: 'Mild bad breath noticed',
        status: 'Confirmed',
      },
      {
        pet: pets[4]._id, // Luna
        owner: owner2._id,
        veterinarian: adminVet._id,
        service: 'General Consultation',
        appointmentDate: pastDate,
        appointmentTime: '03:00 PM',
        reason: 'Ear scratching inspection',
        notes: 'Completed checkup and prescribed ear drops',
        status: 'Completed',
      },
    ]);
    console.log('✅ Created 5 Appointments with varied statuses.');

    // 5. Create 3 Medical Records
    await MedicalRecord.create([
      {
        pet: pets[4]._id, // Luna
        veterinarian: adminVet._id,
        visitDate: pastDate,
        diagnosis: 'Mild Ear Mites (Otodectes cynotis)',
        symptoms: 'Head shaking, ear scratching, mild discharge',
        treatment: 'Cleaned auditory canal with antiseptic solution',
        prescription: 'Otomax ear drops: 3 drops twice daily for 7 days',
        vaccination: '',
        notes: 'Schedule follow-up check after 10 days if symptoms persist.',
      },
      {
        pet: pets[0]._id, // Bruno
        veterinarian: adminVet._id,
        visitDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        diagnosis: 'Mild Food Allergy (Contact Dermatitis)',
        symptoms: 'Skin erythema around paws, constant licking',
        treatment: 'Administered subcutaneous antihistamine injection',
        prescription: 'Apoquel 5.4mg: 1 tablet daily with food for 5 days',
        vaccination: '',
        notes: 'Discontinue poultry and grain treats; switch to single-protein salmon food.',
      },
      {
        pet: pets[1]._id, // Milo
        veterinarian: adminVet._id,
        visitDate: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000),
        diagnosis: 'Annual Routine Wellness Exam',
        symptoms: 'None observed. Patient is active and healthy.',
        treatment: 'Physical exam, coat check, auscultation normal',
        prescription: 'Multi-vitamin nutritional gel: 1 teaspoon daily',
        vaccination: 'Tricat Trio Booster Vaccine',
        notes: 'Body condition score: 5/9. Perfect weight.',
      },
    ]);
    console.log('✅ Created 3 Medical Records with prescriptions.');

    console.log('\n======================================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Demo Credentials for College Viva / Testing:');
    console.log('🔑 Admin / Veterinarian: admin@petcare.com | password123');
    console.log('🔑 Pet Owner (Rahul):    rahul@example.com | password123');
    console.log('🔑 Pet Owner (Priya):    priya@example.com | password123');
    console.log('🔑 Pet Owner (Amit):     amit@example.com  | password123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
