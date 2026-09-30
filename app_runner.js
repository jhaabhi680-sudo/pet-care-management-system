import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// ==========================================
// In-Memory Database (Pre-seeded with Aesthetic Data)
// ==========================================
const db = {
  users: [
    {
      _id: 'usr_admin_1',
      name: 'Dr. Aditi Sharma',
      email: 'admin@petcare.com',
      phone: '+91 98765 43210',
      passwordHash: hashPassword('password123'),
      role: 'veterinarian',
      qualification: 'B.V.Sc & A.H, M.V.Sc (Surgery)',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_owner_1',
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      phone: '+91 98112 23344',
      passwordHash: hashPassword('password123'),
      role: 'owner',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_owner_2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 98223 34455',
      passwordHash: hashPassword('password123'),
      role: 'owner',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_owner_3',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '+91 98334 45566',
      passwordHash: hashPassword('password123'),
      role: 'owner',
      createdAt: new Date().toISOString(),
    },
  ],
  pets: [
    {
      _id: 'pet_1',
      name: 'Bruno',
      species: 'Dog',
      breed: 'Labrador Retriever',
      gender: 'Male',
      age: 3,
      dateOfBirth: '2023-04-12',
      weight: 24,
      color: 'Golden Cream',
      microchipId: '985141002348912',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      owner: 'usr_owner_1',
      vaccinationStatus: 'Up to date',
      vaccineExpiry: '2027-04-12',
      medicalNotes: 'Allergic to chicken treats. Energetic and very friendly.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'pet_2',
      name: 'Milo',
      species: 'Cat',
      breed: 'Persian Longhair',
      gender: 'Male',
      age: 2,
      dateOfBirth: '2024-02-15',
      weight: 4.5,
      color: 'Pure Silk White',
      microchipId: '985141005728341',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      owner: 'usr_owner_2',
      vaccinationStatus: 'Up to date',
      vaccineExpiry: '2027-02-15',
      medicalNotes: 'Calm temperament, requires weekly coat grooming.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'pet_3',
      name: 'Rocky',
      species: 'Dog',
      breed: 'German Shepherd',
      gender: 'Male',
      age: 4,
      dateOfBirth: '2022-08-20',
      weight: 32,
      color: 'Black & Tan',
      microchipId: '985141009182374',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80',
      owner: 'usr_owner_3',
      vaccinationStatus: 'Pending',
      vaccineExpiry: '2026-10-15',
      medicalNotes: 'Annual DHPPi and Anti-Rabies booster due this week.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'pet_4',
      name: 'Bella',
      species: 'Dog',
      breed: 'Golden Retriever',
      gender: 'Female',
      age: 1.5,
      dateOfBirth: '2025-01-10',
      weight: 22,
      color: 'Honey Gold',
      microchipId: '985141003482719',
      image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
      owner: 'usr_owner_1',
      vaccinationStatus: 'Up to date',
      vaccineExpiry: '2027-01-10',
      medicalNotes: 'Loves swimming, perfectly healthy physical condition.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'pet_5',
      name: 'Luna',
      species: 'Cat',
      breed: 'Siamese Classic',
      gender: 'Female',
      age: 1,
      dateOfBirth: '2025-05-18',
      weight: 3.8,
      color: 'Seal Point',
      microchipId: '985141008273612',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
      owner: 'usr_owner_2',
      vaccinationStatus: 'Up to date',
      vaccineExpiry: '2027-05-18',
      medicalNotes: 'Indoor cat, very playful. Routine health monitoring.',
      createdAt: new Date().toISOString(),
    },
  ],
  services: [
    {
      _id: 'svc_1',
      name: 'Veterinary Consultation',
      description: 'Comprehensive physical examination, vital checks, stethoscope auscultation, and clinical assessment.',
      price: 500,
      duration: '30 mins',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
      tag: 'Popular',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'svc_2',
      name: 'Vaccination & Immunization',
      description: 'Core and non-core booster vaccines (Rabies, DHPPi, Tricat Trio) with official vaccine passport stamp.',
      price: 800,
      duration: '20 mins',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
      tag: 'Essential',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'svc_3',
      name: 'Luxury Pet Grooming & Spa',
      description: 'Aromatherapy bath, fur deshedding, sanitary styling, nail trimming, and gentle ear flushing.',
      price: 1200,
      duration: '60 mins',
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
      tag: 'Pamper',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'svc_4',
      name: 'Dental Scaling & Hygiene',
      description: 'Ultrasonic plaque & calculus removal, tooth polishing, and gingival health check.',
      price: 1500,
      duration: '45 mins',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      tag: 'Healthcare',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'svc_5',
      name: '24/7 Critical Emergency Care',
      description: 'Immediate trauma triage, resuscitation, intensive monitoring, and acute pain stabilization.',
      price: 2000,
      duration: '60 mins',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
      tag: 'Urgent',
      createdAt: new Date().toISOString(),
    },
  ],
  appointments: [
    {
      _id: 'appt_1',
      pet: 'pet_1',
      owner: 'usr_owner_1',
      veterinarian: 'usr_admin_1',
      service: 'Veterinary Consultation',
      appointmentDate: '2026-10-02',
      appointmentTime: '10:00 AM',
      reason: 'Routine 6-month wellness checkup & weight review',
      notes: 'Check ear canal and skin allergy status',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'appt_2',
      pet: 'pet_2',
      owner: 'usr_owner_2',
      veterinarian: 'usr_admin_1',
      service: 'Luxury Pet Grooming & Spa',
      appointmentDate: '2026-10-03',
      appointmentTime: '11:00 AM',
      reason: 'Seasonal fur grooming, bath and coat conditioning',
      notes: 'Gentle handling requested for sensitive skin',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'appt_3',
      pet: 'pet_3',
      owner: 'usr_owner_3',
      veterinarian: 'usr_admin_1',
      service: 'Vaccination & Immunization',
      appointmentDate: '2026-10-04',
      appointmentTime: '02:00 PM',
      reason: 'Annual anti-rabies and booster shot due',
      notes: 'Please update international health certificate',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'appt_4',
      pet: 'pet_4',
      owner: 'usr_owner_1',
      veterinarian: 'usr_admin_1',
      service: 'Dental Scaling & Hygiene',
      appointmentDate: '2026-10-05',
      appointmentTime: '04:00 PM',
      reason: 'Mild tartar accumulation check and cleaning',
      notes: 'Pre-check fasting instructions given',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'appt_5',
      pet: 'pet_5',
      owner: 'usr_owner_2',
      veterinarian: 'usr_admin_1',
      service: 'Veterinary Consultation',
      appointmentDate: '2026-09-28',
      appointmentTime: '03:00 PM',
      reason: 'Ear itching inspection & head tilt',
      notes: 'Completed checkup and issued Otomax prescription',
      status: 'Completed',
      createdAt: new Date().toISOString(),
    },
  ],
  medicalRecords: [
    {
      _id: 'med_1',
      pet: 'pet_5',
      veterinarian: 'usr_admin_1',
      visitDate: '2026-09-28',
      diagnosis: 'Mild Otitis Externa (Ear Mites)',
      symptoms: 'Ear scratching, frequent head shaking, mild dark ceruminous discharge',
      treatment: 'Thoroughly flushed both ear canals with antiseptic solution and applied soothing topical emulsion.',
      prescription: 'Otomax Otic Ointment: 4 drops into affected ear twice daily for 7 days. Clean outer ear gently before instilling.',
      vaccination: 'Tricat Trio Booster',
      notes: 'Patient showed great patience. Schedule 7-day follow-up if head shaking does not subside.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'med_2',
      pet: 'pet_1',
      veterinarian: 'usr_admin_1',
      visitDate: '2026-09-20',
      diagnosis: 'Allergic Contact Dermatitis (Dietary Sensitivity)',
      symptoms: 'Mild erythema around paw pads, recurrent paw licking, scratching abdomen',
      treatment: 'Subcutaneous injection of antihistamine administered. Paw pads cleansed with chlorhexidine wash.',
      prescription: 'Apoquel 5.4mg: 1 tablet orally once daily with meal for 5 days. Omega-3 fatty acid capsule 1000mg once daily.',
      vaccination: '',
      notes: 'Discontinue poultry and grain biscuits. Shift to hypoallergenic hydrolyzed salmon formula.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'med_3',
      pet: 'pet_2',
      veterinarian: 'usr_admin_1',
      visitDate: '2026-09-05',
      diagnosis: 'Annual Routine Wellness Examination',
      symptoms: 'None observed. Patient is active, alert, well-hydrated, and playful.',
      treatment: 'Full physical exam: clear lung fields, heart rate 140 bpm, clean teeth, coat texture optimal.',
      prescription: 'Nutri-Plus Multi-Vitamin Gel: 1 teaspoon daily mixed with wet food.',
      vaccination: 'Feline Rabies Booster (Nobivac)',
      notes: 'Ideal body condition score 5/9. Weight steady at 4.5kg. Excellent health status.',
      createdAt: new Date().toISOString(),
    },
  ],
};

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd + 'salt_petcare').digest('hex');
}

function verifyPassword(pwd, hash) {
  return hashPassword(pwd) === hash;
}

function createToken(userId) {
  return Buffer.from(JSON.stringify({ id: userId, exp: Date.now() + 86400000 * 30 })).toString('base64');
}

function verifyToken(token) {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (data.exp < Date.now()) return null;
    return db.users.find((u) => u._id === data.id);
  } catch {
    return null;
  }
}

// Helpers for Populating Foreign References
function populatePet(pet) {
  if (!pet) return null;
  const owner = db.users.find((u) => u._id === pet.owner);
  return {
    ...pet,
    owner: owner ? { _id: owner._id, name: owner.name, email: owner.email, phone: owner.phone } : null,
  };
}

function populateAppointment(appt) {
  if (!appt) return null;
  const petObj = db.pets.find((p) => p._id === appt.pet);
  const ownerObj = db.users.find((u) => u._id === appt.owner);
  const vetObj = db.users.find((u) => u._id === appt.veterinarian);
  const svcObj = db.services.find((s) => s.name === appt.service || s._id === appt.service);

  return {
    ...appt,
    pet: petObj ? { _id: petObj._id, name: petObj.name, species: petObj.species, breed: petObj.breed, age: petObj.age, image: petObj.image } : null,
    owner: ownerObj ? { _id: ownerObj._id, name: ownerObj.name, email: ownerObj.email, phone: ownerObj.phone } : null,
    veterinarian: vetObj ? { _id: vetObj._id, name: vetObj.name, email: vetObj.email, phone: vetObj.phone } : null,
    service: svcObj ? svcObj : { name: appt.service },
  };
}

function populateRecord(rec) {
  if (!rec) return null;
  const petObj = db.pets.find((p) => p._id === rec.pet);
  const vetObj = db.users.find((u) => u._id === rec.veterinarian);
  return {
    ...rec,
    pet: petObj ? { _id: petObj._id, name: petObj.name, species: petObj.species, breed: petObj.breed, age: petObj.age, image: petObj.image, owner: petObj.owner } : null,
    veterinarian: vetObj ? { _id: vetObj._id, name: vetObj.name, email: vetObj.email } : null,
  };
}

// Parse request body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  const authHeader = req.headers['authorization'];
  let currentUser = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    currentUser = verifyToken(authHeader.substring(7));
  }

  // --- API Routes ---
  if (pathname.startsWith('/api')) {
    if (pathname === '/api/health') {
      return sendJson(res, 200, { status: 'OK', message: 'PetCare System API is running smoothly' });
    }

    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.name || !body.email || !body.phone || !body.password) {
        return sendJson(res, 400, { message: 'All fields are required.' });
      }
      if (db.users.find((u) => u.email === body.email.toLowerCase())) {
        return sendJson(res, 400, { message: 'User with this email already exists.' });
      }
      const newUser = {
        _id: 'usr_' + Date.now(),
        name: body.name.trim(),
        email: body.email.toLowerCase().trim(),
        phone: body.phone.trim(),
        passwordHash: hashPassword(body.password),
        role: body.role || 'owner',
        createdAt: new Date().toISOString(),
      };
      db.users.push(newUser);
      return sendJson(res, 201, {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        token: createToken(newUser._id),
      });
    }

    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const user = db.users.find((u) => u.email === (body.email || '').toLowerCase().trim());
      if (user && verifyPassword(body.password, user.passwordHash)) {
        return sendJson(res, 200, {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: createToken(user._id),
        });
      }
      return sendJson(res, 401, { message: 'Invalid email or password.' });
    }

    if (!currentUser && (pathname.startsWith('/api/pets') || pathname.startsWith('/api/appointments') || pathname.startsWith('/api/medical-records') || pathname.startsWith('/api/users'))) {
      return sendJson(res, 401, { message: 'Not authorized, token required.' });
    }

    if (pathname === '/api/pets') {
      if (req.method === 'GET') {
        let results = db.pets;
        if (currentUser.role === 'owner') {
          results = results.filter((p) => p.owner === currentUser._id);
        }
        return sendJson(res, 200, results.map(populatePet));
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newPet = {
          _id: 'pet_' + Date.now(),
          name: body.name,
          species: body.species || 'Dog',
          breed: body.breed,
          gender: body.gender || 'Male',
          age: Number(body.age),
          dateOfBirth: body.dateOfBirth,
          weight: body.weight ? Number(body.weight) : 0,
          color: body.color || '',
          microchipId: '98514100' + Math.floor(1000000 + Math.random() * 9000000),
          image: body.image || (body.species === 'Cat' 
            ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'),
          vaccinationStatus: body.vaccinationStatus || 'Up to date',
          vaccineExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          medicalNotes: body.medicalNotes || '',
          owner: currentUser.role === 'owner' ? currentUser._id : (body.owner || currentUser._id),
          createdAt: new Date().toISOString(),
        };
        db.pets.unshift(newPet);
        return sendJson(res, 201, populatePet(newPet));
      }
    }

    if (pathname.startsWith('/api/pets/')) {
      const petId = pathname.split('/')[3];
      const petIndex = db.pets.findIndex((p) => p._id === petId);
      if (petIndex === -1) return sendJson(res, 404, { message: 'Pet not found' });

      if (req.method === 'GET') {
        return sendJson(res, 200, populatePet(db.pets[petIndex]));
      }
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        Object.assign(db.pets[petIndex], body);
        return sendJson(res, 200, populatePet(db.pets[petIndex]));
      }
      if (req.method === 'DELETE') {
        db.pets.splice(petIndex, 1);
        db.appointments = db.appointments.filter((a) => a.pet !== petId);
        return sendJson(res, 200, { message: 'Pet deleted successfully' });
      }
    }

    if (pathname === '/api/appointments') {
      if (req.method === 'GET') {
        let results = db.appointments;
        if (currentUser.role === 'owner') {
          results = results.filter((a) => a.owner === currentUser._id);
        }
        return sendJson(res, 200, results.map(populateAppointment));
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const petObj = db.pets.find((p) => p._id === body.pet);
        const newAppt = {
          _id: 'appt_' + Date.now(),
          pet: body.pet,
          owner: currentUser.role === 'owner' ? currentUser._id : (petObj ? petObj.owner : currentUser._id),
          veterinarian: body.veterinarian || db.users.find((u) => u.role === 'veterinarian')._id,
          service: body.service,
          appointmentDate: body.appointmentDate,
          appointmentTime: body.appointmentTime,
          reason: body.reason,
          notes: body.notes || '',
          status: 'Pending',
          createdAt: new Date().toISOString(),
        };
        db.appointments.unshift(newAppt);
        return sendJson(res, 201, populateAppointment(newAppt));
      }
    }

    if (pathname.startsWith('/api/appointments/')) {
      const apptId = pathname.split('/')[3];
      const apptIndex = db.appointments.findIndex((a) => a._id === apptId);
      if (apptIndex === -1) return sendJson(res, 404, { message: 'Appointment not found' });

      if (req.method === 'GET') {
        return sendJson(res, 200, populateAppointment(db.appointments[apptIndex]));
      }
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        Object.assign(db.appointments[apptIndex], body);
        return sendJson(res, 200, populateAppointment(db.appointments[apptIndex]));
      }
      if (req.method === 'DELETE') {
        db.appointments.splice(apptIndex, 1);
        return sendJson(res, 200, { message: 'Appointment deleted' });
      }
    }

    if (pathname === '/api/medical-records') {
      if (req.method === 'GET') {
        let results = db.medicalRecords;
        if (currentUser.role === 'owner') {
          const ownerPetIds = db.pets.filter((p) => p.owner === currentUser._id).map((p) => p._id);
          results = results.filter((r) => ownerPetIds.includes(r.pet));
        }
        return sendJson(res, 200, results.map(populateRecord));
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newRec = {
          _id: 'med_' + Date.now(),
          pet: body.pet,
          veterinarian: currentUser._id,
          visitDate: body.visitDate || new Date().toISOString().split('T')[0],
          diagnosis: body.diagnosis,
          symptoms: body.symptoms || '',
          treatment: body.treatment,
          prescription: body.prescription || '',
          vaccination: body.vaccination || '',
          notes: body.notes || '',
          createdAt: new Date().toISOString(),
        };
        db.medicalRecords.unshift(newRec);
        return sendJson(res, 201, populateRecord(newRec));
      }
    }

    if (pathname === '/api/services') {
      if (req.method === 'GET') {
        return sendJson(res, 200, db.services);
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newSvc = {
          _id: 'svc_' + Date.now(),
          name: body.name,
          description: body.description || '',
          price: Number(body.price),
          duration: body.duration,
          image: body.image || 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
          tag: 'Clinical',
          createdAt: new Date().toISOString(),
        };
        db.services.push(newSvc);
        return sendJson(res, 201, newSvc);
      }
    }

    if (pathname.startsWith('/api/services/')) {
      const svcId = pathname.split('/')[3];
      const svcIndex = db.services.findIndex((s) => s._id === svcId);
      if (svcIndex === -1) return sendJson(res, 404, { message: 'Service not found' });
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        Object.assign(db.services[svcIndex], body);
        return sendJson(res, 200, db.services[svcIndex]);
      }
      if (req.method === 'DELETE') {
        db.services.splice(svcIndex, 1);
        return sendJson(res, 200, { message: 'Service deleted' });
      }
    }

    if (pathname === '/api/users') {
      if (req.method === 'GET') {
        return sendJson(res, 200, db.users.map(({ passwordHash, ...u }) => u));
      }
    }

    return sendJson(res, 404, { message: 'API Endpoint Not Found' });
  }

  // --- Serve Built-in Web UI ---
  const htmlPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(htmlPath)) {
    const content = fs.readFileSync(htmlPath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>🐾 Pet Care Management System is Running!</h1><p>API Endpoint: <a href="/api/health">/api/health</a></p>`);
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✨ PET CARE MANAGEMENT SYSTEM IS LIVE & RUNNING!`);
  console.log(`======================================================`);
  console.log(`🚀 Web Interface:    http://localhost:${PORT}`);
  console.log(`🌐 REST API Endpoint: http://localhost:${PORT}/api`);
  console.log(`======================================================\n`);
});
