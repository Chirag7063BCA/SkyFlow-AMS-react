// Convert "09:10 AM" or "06:30 PM" into total minutes from midnight (0 to 1439)
export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return null;

  const parts = timeStr.trim().split(' '); // ["09:10", "AM"]
  if (parts.length !== 2) return null;

  const timeParts = parts[0].split(':'); // ["09", "10"]
  let hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const amPm = parts[1].toUpperCase();

  if (isNaN(hours) || isNaN(minutes)) return null;

  if (amPm === 'PM' && hours !== 12) hours += 12;
  if (amPm === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

// Check if a flight is currently in the air at `now` and calculate its % progress
export function evaluateAirborneFlight(flight, now = new Date()) {
  const depMin = parseTimeToMinutes(flight.departureTime);
  const arrMin = parseTimeToMinutes(flight.arrivalTime);

  if (depMin === null || arrMin === null) {
    return { ...flight, isAirborne: false, airborneProgress: 0, minutesRemaining: 0 };
  }

  const nowMin = now.getHours() * 60 + now.getMinutes();

  // If arrival time is smaller than departure time, the flight crosses midnight
  const crossesMidnight = arrMin <= depMin;
  const totalMinutes = crossesMidnight
    ? 1440 - depMin + arrMin
    : arrMin - depMin;

  if (totalMinutes <= 0) {
    return { ...flight, isAirborne: false, airborneProgress: 0, minutesRemaining: 0 };
  }

  let isInAir = false;
  let elapsedMinutes = 0;

  if (!crossesMidnight) {
    if (nowMin >= depMin && nowMin < arrMin) {
      isInAir = true;
      elapsedMinutes = nowMin - depMin;
    }
  } else {
    if (nowMin >= depMin || nowMin < arrMin) {
      isInAir = true;
      elapsedMinutes = nowMin >= depMin ? nowMin - depMin : 1440 - depMin + nowMin;
    }
  }

  if (!isInAir) {
    return { ...flight, isAirborne: false, airborneProgress: 0, minutesRemaining: 0 };
  }

  // Keep progress between 4% and 96% while in the air
  let progress = elapsedMinutes / totalMinutes;
  if (progress < 0.04) progress = 0.04;
  if (progress > 0.96) progress = 0.96;

  const minutesRemaining = Math.max(1, totalMinutes - elapsedMinutes);

  return {
    ...flight,
    isAirborne: true,
    airborneProgress: progress,
    minutesRemaining,
  };
}

// Return all flights that are currently in the air at `now`
export function scanAirborneFlights(flights, now = new Date()) {
  const inAirList = [];

  for (let i = 0; i < flights.length; i += 1) {
    const checked = evaluateAirborneFlight(flights[i], now);
    if (checked.isAirborne) {
      inAirList.push(checked);
    }
  }

  // Show "On Time" flights first, then "Delayed" / others
  inAirList.sort((a, b) => {
    if (a.status === 'On Time' && b.status !== 'On Time') return -1;
    if (b.status === 'On Time' && a.status !== 'On Time') return 1;
    return b.airborneProgress - a.airborneProgress;
  });

  return inAirList;
}
