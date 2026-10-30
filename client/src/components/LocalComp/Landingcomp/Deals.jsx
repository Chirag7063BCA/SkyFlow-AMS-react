import React from 'react';
import './LandingStyles/deals.css';
import winterEscapeImg from '../../../assets/winter_escape.jpg';
import familyFunImg from '../../../assets/family_fun.jpg';
import saharaImg from '../../../assets/destination_sahara.jpg';
import alpineImg from '../../../assets/destination_alpine.jpg';
import azureImg from '../../../assets/destination_azure.jpg';
import canyonImg from '../../../assets/destination_canyon.jpg';
import oasisImg from '../../../assets/destination_oasis.jpg';
import crimsonImg from '../../../assets/destination_crimson.jpg';
import oasisMirageImg from '../../../assets/oasis_mirage.jpg';
import saharaDawnImg from '../../../assets/sahara_dawn.jpg';

export default function Deals() {
  const testimonials = [
    {
      avatar: saharaImg,
      name: 'Sarah Jenkins',
      title: 'HEAR FROM OUR HAPPY TRAVELERS.',
      quote: '"SkyFlow made my dream trip to Bali so easy. The deals were unbeatable."',
      rating: '★★★★★',
    },
    {
      avatar: alpineImg,
      name: 'David Miller',
      title: 'EXCELLENT SERVICE & FAST BOOKING.',
      quote: '"Booked round-trip flights for my family in under 2 minutes. Outstanding support!"',
      rating: '★★★★★',
    },
    {
      avatar: azureImg,
      name: 'Elena Rostova',
      title: 'BEST FLIGHT DISCOUNTS EVER.',
      quote: '"Saved over 30% on my holiday flight to Paris. Smooth, hassle-free experience!"',
      rating: '★★★★★',
    },
    {
      avatar: canyonImg,
      name: 'Marcus Vance',
      title: 'LUXURIOUS & RELIABLE TRAVEL.',
      quote: '"The flight status tracking and customer service kept my entire trip stress-free."',
      rating: '★★★★★',
    },
    {
      avatar: oasisImg,
      name: 'Priya Sharma',
      title: 'FLAWLESS BOOKING EXPERIENCE.',
      quote: '"SkyFlow made booking domestic & international flights effortlessly fast!"',
      rating: '★★★★★',
    },
    {
      avatar: crimsonImg,
      name: 'Alex Rivera',
      title: 'GREAT DEALS ON FIRST CLASS.',
      quote: '"Got a premium business class ticket at an incredible rate. Will book again!"',
      rating: '★★★★',
    },
    {
      avatar: oasisMirageImg,
      name: 'Sophia Chen',
      title: 'SUPER EASY RESCHEDULING.',
      quote: '"When my flight plans changed, their 24/7 support team resolved it in minutes."',
      rating: '★★★★★',
    },
    {
      avatar: saharaDawnImg,
      name: 'Michael Brown',
      title: 'UNBEATABLE PRICES & PERKS.',
      quote: '"Found flight options that saved me hundreds on my trip to Tokyo. Outstanding!"',
      rating: '★★★★★',
    },
    // Clone of first review for seamless infinite loop
    {
      avatar: saharaImg,
      name: 'Sarah Jenkins',
      title: 'HEAR FROM OUR HAPPY TRAVELERS.',
      quote: '"SkyFlow made my dream trip to Bali so easy. The deals were unbeatable."',
      rating: '★★★★★',
    },
  ];

  return (
    <section className="deals-section" id="special-deals">
      <div className="deals-container">
        {/* Row 1: Special Deals Header & 2 Cards */}
        <div className="deals-row">
          <h2 className="section-title-dark">Special Deals</h2>
          <div className="deals-cards-grid">
            {/* Card 1: Winter Escape */}
            <div className="deal-card">
              <img src={winterEscapeImg} alt="Winter Escape Deal" className="deal-bg-img" />
              <div className="deal-overlay">
                <h3 className="deal-title">
                  WINTER ESCAPE:
                  <br />
                  UP TO 35% OFF FLIGHTS
                </h3>
                <a href="#flights" className="deal-btn">
                  View Details
                </a>
              </div>
            </div>

            {/* Card 2: Family Fun Packages */}
            <div className="deal-card">
              <img src={familyFunImg} alt="Family Fun Package Deal" className="deal-bg-img" />
              <div className="deal-overlay">
                <h3 className="deal-title">
                  FAMILY FUN PACKAGES:
                  <br />
                  CHILD TRAVELS FREE
                </h3>
                <a href="#flights" className="deal-btn">
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Trust Features + Testimonials */}
        <div className="info-row-grid">
          {/* Left Column: TRUSTED. FAST. SECURE. */}
          <div className="info-col">
            <h3 className="info-heading">TRUSTED. FAST. SECURE.</h3>
            <div className="features-flex">
              <div className="feature-item">
                <div className="feature-icon green-badge">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Vetted Partners</h4>
                  <p>Vetted partners and shield business</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon blue-badge">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Easy Booking</h4>
                  <p>Get a seamless order/slot booking</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon purple-badge">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Secure Payments</h4>
                  <p>Secure payments & card payments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Testimonials */}
          <div className="info-col">
            <h3 className="info-heading">Customer Testimonials</h3>
            <div className="testimonial-slider-container">
              <div className="testimonial-track">
                {testimonials.map((item, index) => (
                  <div className="testimonial-card" key={index}>
                    <div className="testimonial-author">
                      <img src={item.avatar} alt={item.name} className="author-avatar" />
                      <span className="author-name">{item.name}</span>
                    </div>
                    <div className="testimonial-content">
                      <h4 className="testimonial-title">{item.title}</h4>
                      <p className="testimonial-quote">{item.quote}</p>
                      <div className="star-rating">{item.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

