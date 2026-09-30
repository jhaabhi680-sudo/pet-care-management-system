import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-3 d-flex align-items-center gap-2">
              <span>🐾</span> PetCare Management System
            </h5>
            <p className="small">
              A comprehensive MERN stack web platform designed for pet clinics, veterinary hospitals, and dedicated pet parents. Simplifying appointments, health monitoring, and medical record keeping.
            </p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="/#home">Home</a></li>
              <li><a href="/#services">Services</a></li>
              <li><a href="/#about">About Us</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white mb-3">Clinic Hours</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li>Monday – Friday: 8:00 AM – 8:00 PM</li>
              <li>Saturday: 9:00 AM – 6:00 PM</li>
              <li>Sunday: 10:00 AM – 4:00 PM</li>
              <li className="text-warning">24/7 Emergency Care on Call</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white mb-3">Get In Touch</h6>
            <p className="small mb-1"><i className="bi bi-geo-alt me-2 text-teal"></i> 123 Animal Wellness Lane, Pune, MH</p>
            <p className="small mb-1"><i className="bi bi-telephone me-2 text-teal"></i> +91 98765 43210</p>
            <p className="small"><i className="bi bi-envelope me-2 text-teal"></i> support@petcare-system.com</p>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="text-center small">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} PetCare Management System. Built with MERN Stack (React, Node, Express & MongoDB) for Web Lab.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
