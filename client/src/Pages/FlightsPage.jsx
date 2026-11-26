import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import airportsData from '../dummydata/airports.json';
import flightsData from '../dummydata/flights.json';
import FlightHeader from '../components/LocalComp/flightscomps/FlightHeader';
import FlightResults from '../components/LocalComp/flightscomps/FlightResults';

export default function FlightsPage({
  flights = flightsData,
  airports = airportsData,
} = {}) {
  const location = useLocation();
  const [search, setSearch] = useState(() => location.state?.search || null);

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