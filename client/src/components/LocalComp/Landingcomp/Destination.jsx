import React from 'react';
import './LandingStyles/destination.css';
import saharaImg from '../../../assets/destination_sahara.jpg';
import oasisImg from '../../../assets/destination_oasis.jpg';
import crimsonImg from '../../../assets/destination_crimson.jpg';
import alpineImg from '../../../assets/destination_alpine.jpg';

export default function Destination() {
  return (
    <section className="destination-section" id="top-destinations">
      <div className="destination-container">
        <div className="destination-bento-grid">
          {/* Column 1: Text Block & Card 1 */}
          <div className="bento-col col-left">
            <div className="destination-text-block">
              <h2 className="destination-heading">
                Your Journey to the Perfect
                <br className="heading-br" />
                Destination Begins Here
              </h2>
              <p className="destination-subtext">
                Explore our selected works that demonstrate our commitment to design
                excellence, innovation, and client satisfaction.
              </p>
            </div>
            <div className="destination-card card-sahara">
              <img src={saharaImg} alt="Jaipur" className="card-bg-img" />
              <div className="card-content-overlay">
                <span className="card-title">Jaipur</span>
              </div>
            </div>
          </div>

          {/* Column 2: Card 2 & Card 3 */}
          <div className="bento-col col-middle">
            <div className="destination-card card-oasis">
              <img src={oasisImg} alt="Goa" className="card-bg-img" />
              <div className="card-content-overlay">
                <span className="card-title">Goa</span>
              </div>
            </div>
            <div className="destination-card card-crimson">
              <img src={crimsonImg} alt="Rajasthan" className="card-bg-img" />
              <div className="card-content-overlay">
                <span className="card-title">Rajasthan</span>
              </div>
            </div>
          </div>

          {/* Column 3: Card 4 & See More Button */}
          <div className="bento-col col-right">
            <div className="destination-card card-alpine">
              <img src={alpineImg} alt="Kashmir" className="card-bg-img" />
              <div className="card-content-overlay">
                <span className="card-title">Kashmir</span>
              </div>
            </div>
            <a href="#flights" className="see-more-btn">
              <span>See More Destinations</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

