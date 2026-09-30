import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSubmitted(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactSubmitted(false), 5000);
    }
  };

  const servicesList = [
    {
      icon: '🩺',
      title: 'Veterinary Consultation',
      description: 'Expert diagnostics, wellness exams, and compassionate care by qualified doctors.',
    },
    {
      icon: '💉',
      title: 'Vaccination',
      description: 'Timely vaccines and scheduled immunization records to keep your pets immune & protected.',
    },
    {
      icon: '✂️',
      title: 'Grooming & Spa',
      description: 'Hygienic baths, hair trimming, nail clipping, and complete coat grooming for all breeds.',
    },
    {
      icon: '❤️',
      title: 'Health Checkup',
      description: 'Comprehensive routine screenings, parasite control, and nutrition advisory.',
    },
    {
      icon: '🦷',
      title: 'Dental Care',
      description: 'Professional dental cleaning, scaling, and oral hygiene checkups to prevent diseases.',
    },
    {
      icon: '🚨',
      title: 'Emergency Care',
      description: '24/7 urgent medical assistance, critical care stabilization, and surgical support.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center text-md-start">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6">
              <span className="badge bg-teal-subtle text-teal px-3 py-2 rounded-pill mb-3 fw-bold" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
                🐾 Dedicated Pet Healthcare System
              </span>
              <h1 className="hero-title mb-3">
                Complete Care for Your <span style={{ color: '#0d9488' }}>Beloved Pets</span>
              </h1>
              <p className="hero-subtitle mb-4">
                Book appointments, manage pet records, track vaccinations, and keep your pets healthy and happy with our all-in-one clinic platform.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                <Link
                  to={user ? '/appointments/book' : '/register'}
                  className="btn btn-primary btn-lg px-4 shadow-sm"
                >
                  <i className="bi bi-calendar-plus me-2"></i> Book Appointment
                </Link>
                <Link
                  to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'}
                  className="btn btn-outline-primary btn-lg px-4"
                >
                  {user ? 'Go to Dashboard' : 'Get Started'}
                </Link>
              </div>

              {/* Trust counters */}
              <div className="row mt-5 pt-3 border-top g-3">
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-dark">500+</h4>
                  <small className="text-muted">Happy Pets</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-dark">15+</h4>
                  <small className="text-muted">Vet Specialists</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold mb-0 text-dark">99.8%</h4>
                  <small className="text-muted">Satisfaction</small>
                </div>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <div className="position-relative p-4">
                <div
                  className="card custom-card border-0 p-4 shadow-lg mx-auto"
                  style={{ maxWidth: '450px', background: 'white' }}
                >
                  <div className="d-flex justify-content-around align-items-center mb-4">
                    <span style={{ fontSize: '4.5rem' }}>🐕</span>
                    <span style={{ fontSize: '4.5rem' }}>🐈</span>
                    <span style={{ fontSize: '4rem' }}>🦜</span>
                  </div>
                  <h5 className="fw-bold mb-2">Pet Health & Wellness Clinic</h5>
                  <p className="text-muted small mb-3">
                    Providing high standards of preventive healthcare, digital medical records, and friendly assistance for pet parents.
                  </p>
                  <div className="bg-light p-3 rounded-3 text-start small">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span>Fast Digital Appointment Scheduling</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span>Complete Medical History & Prescriptions</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span>Certified Veterinarians & Modern Equipment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-uppercase fw-bold small text-teal" style={{ color: '#0d9488' }}>
              Our Services
            </span>
            <h2 className="fw-bold mt-1">Comprehensive Veterinary Solutions</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
              From routine wellness checks to surgical procedures and grooming, we offer full-suite medical services tailored for all types of pets.
            </p>
          </div>

          <div className="row g-4">
            {servicesList.map((service, index) => (
              <div className="col-lg-4 col-md-6" key={index}>
                <div className="card custom-card h-100 p-3">
                  <div className="card-body">
                    <div
                      className="rounded-3 p-3 d-inline-flex mb-3"
                      style={{ backgroundColor: '#ccfbf1', fontSize: '2rem' }}
                    >
                      {service.icon}
                    </div>
                    <h5 className="card-title fw-bold mb-2">{service.title}</h5>
                    <p className="card-text text-muted small">{service.description}</p>
                    <Link
                      to={user ? '/appointments/book' : '/register'}
                      className="text-decoration-none fw-semibold small"
                      style={{ color: '#0d9488' }}
                    >
                      Book this service <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-5 bg-light">
        <div className="container py-4">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6">
              <div className="pe-lg-4">
                <span className="text-uppercase fw-bold small" style={{ color: '#0d9488' }}>
                  About PetCare
                </span>
                <h2 className="fw-bold mt-1 mb-3">Committed to Healthier, Happier Pets</h2>
                <p className="text-muted">
                  PetCare is an advanced web-based management portal designed to streamline pet healthcare. We bridge pet owners and certified veterinary doctors through effortless digital appointment scheduling, transparent record maintenance, and continuous health monitoring.
                </p>
                <div className="row g-3 mt-2">
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-3 p-3 bg-white rounded-3 shadow-sm">
                      <i className="bi bi-shield-check text-success fs-3"></i>
                      <div>
                        <h6 className="fw-bold mb-0">Certified Vets</h6>
                        <small className="text-muted">Licensed Practitioners</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center gap-3 p-3 bg-white rounded-3 shadow-sm">
                      <i className="bi bi-clipboard2-pulse text-primary fs-3"></i>
                      <div>
                        <h6 className="fw-bold mb-0">Digital Records</h6>
                        <small className="text-muted">Instant Access Anywhere</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="p-4 bg-white rounded-4 shadow-sm text-start">
                <h5 className="fw-bold mb-3">Why Choose PetCare?</h5>
                <ul className="list-group list-group-flush small">
                  <li className="list-group-item px-0 py-2 border-0 d-flex gap-2">
                    <i className="bi bi-check2-circle text-success fs-5"></i>
                    <span>Real-time appointment slot booking without waiting on phone calls.</span>
                  </li>
                  <li className="list-group-item px-0 py-2 border-0 d-flex gap-2">
                    <i className="bi bi-check2-circle text-success fs-5"></i>
                    <span>Complete vaccination history and automated reminders for owners.</span>
                  </li>
                  <li className="list-group-item px-0 py-2 border-0 d-flex gap-2">
                    <i className="bi bi-check2-circle text-success fs-5"></i>
                    <span>Transparent diagnosis, prescription notes, and dietary advice.</span>
                  </li>
                  <li className="list-group-item px-0 py-2 border-0 d-flex gap-2">
                    <i className="bi bi-check2-circle text-success fs-5"></i>
                    <span>Built strictly with modern MERN architecture for fast, dependable response.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-uppercase fw-bold small" style={{ color: '#0d9488' }}>
              Get In Touch
            </span>
            <h2 className="fw-bold mt-1">Have Questions? Contact Us</h2>
            <p className="text-muted">We are here to assist with any pet health inquiries, clinic directions, or general questions.</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card custom-card p-4">
                {contactSubmitted && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Thank you! Your message has been received. Our clinic team will reach out soon.
                  </div>
                )}
                <form onSubmit={handleContactSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Your Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="john@example.com"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Message</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="How can we help you and your pet?"
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-primary px-4">
                        <i className="bi bi-send me-1"></i> Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
