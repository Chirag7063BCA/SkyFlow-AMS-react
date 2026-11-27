import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getAirports,
  getAirportsSync,
  getFlights,
  getFlightsSync,
} from '../services/flightApi';
import FlightHeader from '../components/LocalComp/flightscomps/FlightHeader';
import FlightResults from '../components/LocalComp/flightscomps/FlightResults';

export default function FlightsPage() {
  const location = useLocation();
  const [search, setSearch] = useState(() => location.state?.search || null);
  const [flights, setFlights] = useState(() => getFlightsSync());
  const [airports, setAirports] = useState(() => getAirportsSync());

  useEffect(() => {
    let active = true;
    getAirports().then((data) => active && setAirports(data));
    getFlights().then((data) => active && setFlights(data));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <FlightHeader
        airports={airports}
        initialSearch={location.state?.search}
        onSearch={setSearch}
      />
      <FlightResults flights={flights} search={search} />
    </>
  );
}
