import React from 'react';
import './LandingStyles/wanderlust.css';
import beachImg from '../../../assets/wanderlust_beach.jpg';

export default function Wanderlust() {
  return (
    <section className="wanderlust-section" id="wanderlust-cta">
      <div className="wanderlust-container">
        <div className="wanderlust-cta-banner">
          <div className="cta-left-content">
            <span className="cta-badge">ADVENTURE AWAITS</span>
            <h2 className="cta-title">
              UNLEASH YOUR WANDERLUST.
              <br />
              EXPLORE WITH SKYFLOW.
            </h2>
            <p className="cta-desc">
              Traveling & Adventure is A to Z tailored for your trip in new places.
              Discover top domestic & international destinations with exclusive flight perks.
            </p>
            <div className="cta-btn-group">
              <a href="#flights" className="cta-pill-btn">
                <span>EXPLORE FLIGHTS NOW</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
          <div className="cta-right-img-box">
            <img src={beachImg} alt="Explore Wanderlust Beach" className="cta-img" />
            <div className="cta-img-badge">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Top Rated Deals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

