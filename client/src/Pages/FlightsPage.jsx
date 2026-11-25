import { useState } from 'react';
import airportsData from '../dummydata/airports.json';
import flightsData from '../dummydata/flights.json';
import FlightHeader from '../components/LocalComp/flightscomps/FlightHeader';
import FlightResults from '../components/LocalComp/flightscomps/FlightResults';

export default function FlightsPage({
  flights = flightsData,
  airports = airportsData,
} = {}) {
  const [search, setSearch] = useState(null);

  return (
    <>
      <FlightHeader airports={airports} onSearch={setSearch} />
      <FlightResults flights={flights} search={search} />
    </>
  );
}