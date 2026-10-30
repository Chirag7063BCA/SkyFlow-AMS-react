import React from 'react';
import Hero from '../components/LocalComp/Landingcomp/Hero';
import Destination from '../components/LocalComp/Landingcomp/Destination';
import Deals from '../components/LocalComp/Landingcomp/Deals';
import Wanderlust from '../components/LocalComp/Landingcomp/Wanderlust';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Hero />
      <Destination />
      <Deals />
      <Wanderlust />
    </div>
  );
}

