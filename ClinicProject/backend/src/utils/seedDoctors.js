const Doctor = require('../models/Doctor');

const defaultDoctors = [
  {
    name: 'Dr. Nimal Perera',
    specialization: 'Cardiologist',
    hospital: 'City Care Hospital',
    experience: 12,
    fee: 5000,
    rating: 4.8,
    description: 'Specialist in heart health, preventive care, and managing chronic cardiac conditions.',
    available: true,
    phone: '+94 11 234 5678',
    image: '🫀'
  },
  {
    name: 'Dr. Anya Silva',
    specialization: 'Dermatologist',
    hospital: 'Sunrise Medical Center',
    experience: 8,
    fee: 5000,
    rating: 4.6,
    description: 'Focuses on skin health, acne treatment, and cosmetic dermatology.',
    available: true,
    phone: '+94 11 245 6789',
    image: '✨'
  },
  {
    name: 'Dr. Ruwan Jay',
    specialization: 'Pediatrician',
    hospital: 'Little Steps Clinic',
    experience: 10,
    fee: 5000,
    rating: 4.9,
    description: 'Provides child healthcare, vaccinations, and growth monitoring.',
    available: true,
    phone: '+94 11 256 7890',
    image: '🧒'
  },
  {
    name: 'Dr. Maya Fernando',
    specialization: 'General Practitioner',
    hospital: 'Green Valley Hospital',
    experience: 15,
    fee: 5000,
    rating: 4.7,
    description: 'Experienced in diagnosing and treating common illnesses and health concerns.',
    available: true,
    phone: '+94 11 267 8901',
    image: '🩺'
  },
  {
    name: 'Dr. Shenal Wickramasinghe',
    specialization: 'Neurologist',
    hospital: 'Neuro Life Institute',
    experience: 11,
    fee: 5000,
    rating: 4.7,
    description: 'Specializes in brain, spine, and nerve disorders with patient-focused care plans.',
    available: true,
    phone: '+94 11 278 9012',
    image: '🧠'
  },
  {
    name: 'Dr. Kavindi Rajapaksha',
    specialization: 'Orthopedic Surgeon',
    hospital: 'Ortho Plus Hospital',
    experience: 9,
    fee: 5000,
    rating: 4.6,
    description: 'Treats bone and joint injuries, sports trauma, and mobility-related conditions.',
    available: true,
    phone: '+94 11 289 0123',
    image: '🦴'
  },
  {
    name: 'Dr. Isuru Madushan',
    specialization: 'ENT Specialist',
    hospital: 'Harmony ENT Center',
    experience: 7,
    fee: 5000,
    rating: 4.5,
    description: 'Provides care for ear, nose, and throat conditions including sinus and hearing issues.',
    available: true,
    phone: '+94 11 290 1234',
    image: '👂'
  },
  {
    name: 'Dr. Piumi Gunasekara',
    specialization: 'Gynecologist',
    hospital: "Women's Care Hospital",
    experience: 13,
    fee: 5000,
    rating: 4.8,
    description: "Supports women's health from routine checkups to prenatal and reproductive care.",
    available: true,
    phone: '+94 11 301 2345',
    image: '🤰'
  },
  {
    name: 'Dr. Charith Dissanayake',
    specialization: 'Psychiatrist',
    hospital: 'MindWell Clinic',
    experience: 10,
    fee: 5000,
    rating: 4.7,
    description: 'Experienced in anxiety, depression, and stress management with holistic treatment plans.',
    available: true,
    phone: '+94 11 312 3456',
    image: '🧘'
  },
  {
    name: 'Dr. Tharushi Abeykoon',
    specialization: 'Endocrinologist',
    hospital: 'Metro Specialist Hospital',
    experience: 12,
    fee: 5000,
    rating: 4.9,
    description: 'Treats diabetes, thyroid conditions, and hormone-related disorders with long-term follow-up.',
    available: true,
    phone: '+94 11 323 4567',
    image: '🧬'
  }
];

const seedDoctors = async () => {
  // Check if database is connected before proceeding
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    console.log('❌ Skipping doctor seeding: No database connection.');
    return;
  }

  const doctorCount = await Doctor.countDocuments();

  if (doctorCount > 0) {
    await Doctor.updateMany({}, { $set: { fee: 5000 } });
    console.log('Updated existing doctor fees to Rs. 5000');
    return;
  }

  await Doctor.insertMany(defaultDoctors);
  console.log(`Seeded ${defaultDoctors.length} default doctors`);
};

module.exports = seedDoctors;