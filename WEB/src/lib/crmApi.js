/**
 * Thin client for the CRM's public booking API.
 *
 * The base URL lives in exactly one place. Override it per-environment with
 * VITE_CRM_API_URL (see .env.example).
 */
const getBaseUrl = () => {
  if (import.meta.env.VITE_CRM_API_URL) {
    return import.meta.env.VITE_CRM_API_URL;
  }
  if (
    import.meta.env.DEV &&
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ) {
    return "http://localhost:3000/api/public";
  }
  return "";
};

export const CRM_API_URL = getBaseUrl();

/** Thrown for anything the caller may want to render differently per status. */
export class ApiError extends Error {
  constructor(message, { status = 0, fields = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

const NETWORK_MESSAGE =
  "We couldn't reach our booking system. Please check your connection or call the clinic on 89403 99403.";

async function request(path, { method = "GET", body, signal } = {}) {
  if (!CRM_API_URL) {
    throw new ApiError(NETWORK_MESSAGE, { status: 0 });
  }

  const options = { method, signal };
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${CRM_API_URL}${path}`, options);
  } catch (err) {
    // AbortError is a deliberate cancellation (stale request) — let it through
    // untouched so callers can ignore it rather than showing an error.
    if (err?.name === "AbortError") throw err;
    throw new ApiError(NETWORK_MESSAGE, { status: 0 });
  }

  // The CRM may answer with an HTML error page (e.g. a 404 route) rather than
  // JSON, so never assume the body parses.
  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      (data && data.error) ||
        (response.status >= 500
          ? "Our booking system is having trouble right now. Please try again shortly."
          : NETWORK_MESSAGE),
      { status: response.status, fields: (data && data.fields) || null }
    );
  }

  return data;
}

export const getServices = (signal) => request("/services", { signal });

export const getDoctors = (signal) => request("/doctors", { signal });

export const getAvailability = (doctorId, date, signal) =>
  request(
    `/availability?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}`,
    { signal }
  );

export const createAppointment = (payload) =>
  request("/appointments", { method: "POST", body: payload });
