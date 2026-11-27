const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export async function submitSupportTicket(ticketData) {
  try {
    const res = await fetch(`${API_BASE_URL}/support/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    const data = await res.json().catch(() => null);
    return res.ok
      ? { success: true, ticketId: data?.ticketId, status: data?.status || 'OPEN' }
      : { success: false, message: data?.message || 'Failed to submit support ticket.' };
  } catch {
    return { success: false, message: 'Cannot connect to Spring Boot server on port 8080.' };
  }
}

export async function fetchUserTickets(email) {
  try {
    const res = await fetch(`${API_BASE_URL}/support/tickets/user/${encodeURIComponent(email)}`);
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}
