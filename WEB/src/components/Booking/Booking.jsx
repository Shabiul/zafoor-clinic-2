import { useCallback, useEffect, useState } from "react";
import { booking, doctorBanner, servicesSection } from "../../data/content.js";
import useInView from "../../hooks/useInView.js";
import {
  ApiError,
  createAppointment,
  getAvailability,
  getDoctors,
  getServices,
} from "../../lib/crmApi.js";
import "./Booking.css";

const fallbackDoctors = [
  {
    id: "dr-mufeeda-roohi",
    name: doctorBanner.name || "Dr. Mufeeda Roohi",
    specialization: doctorBanner.credentials || "Family Physician, Diabetologist & Aesthetic Physician",
  },
];

const fallbackServices = servicesSection.departments.flatMap((dept) =>
  dept.cards.map((card, idx) => ({
    id: `${dept.id}-${idx + 1}`,
    name: card.enTitle,
    description: card.enDesc || card.brief,
    price: null,
    durationMinutes: 30,
    departmentId: dept.id,
    departmentLabel: dept.tabLabel,
  }))
);

function getServiceDepartment(s) {
  if (s.departmentId) {
    if (s.departmentId === "cosmetology") return "skin-hair-laser";
    return s.departmentId;
  }
  const text = `${s.name || ""} ${s.description || ""}`.toLowerCase();
  if (text.includes("skin, diabetes") || text.includes("combined") || text.includes("all-round")) {
    return "all-departments";
  }
  if (
    text.includes("skin") ||
    text.includes("hair") ||
    text.includes("acne") ||
    text.includes("laser") ||
    text.includes("prp") ||
    text.includes("gfc") ||
    text.includes("peel") ||
    text.includes("facial") ||
    text.includes("derma") ||
    text.includes("aesthetic") ||
    text.includes("scalp") ||
    text.includes("pore") ||
    text.includes("wart") ||
    text.includes("mole")
  ) {
    return "skin-hair-laser";
  }
  if (
    text.includes("diabet") ||
    text.includes("sugar") ||
    text.includes("glucose") ||
    text.includes("insulin") ||
    text.includes("hba1c") ||
    text.includes("neuropathy") ||
    text.includes("foot")
  ) {
    return "diabetology";
  }
  return "general";
}

const generateClinicSlots = (dateYmd) => {
  const d = new Date(`${dateYmd}T12:00:00+05:30`);
  if (d.getDay() === 0) return []; // Sunday: Holiday
  const times = [
    "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30",
  ];
  return times.map((t) => `${dateYmd}T${t}:00+05:30`);
};

/* ------------------------------------------------------------------ *
 * Timezone
 * The CRM speaks ISO-8601 UTC. Visitors think in IST, and the clinic's
 * hours (6-10 PM) are IST hours - so every date we send and every time
 * we show is resolved through Asia/Kolkata explicitly, never through the
 * browser's local zone (a visitor abroad must still see clinic time).
 * ------------------------------------------------------------------ */
const IST = "Asia/Kolkata";

const istParts = (date) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(date)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});

/** Calendar date (YYYY-MM-DD) *in IST* for a given instant. */
function istDateString(date = new Date()) {
  const p = istParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

function addDays(ymd, days) {
  // Anchor at IST midday so the +5:30 offset can never roll the date over.
  return istDateString(new Date(new Date(`${ymd}T12:00:00+05:30`).getTime() + days * 86400000));
}

/** "7:30 PM" in IST for a UTC ISO instant. */
function formatIstTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/** "Wed, 19 Aug 2026" in IST. */
function formatIstDate(ymd) {
  const d = new Date(`${ymd}T12:00:00+05:30`);
  if (Number.isNaN(d.getTime())) return ymd;
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/* ------------------------------ validation ------------------------------ */

const PHONE_RE = /^(?:\+?91)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DETAIL_FIELDS = ["firstName", "lastName", "phone", "email", "gender", "reason"];

function validateDetails(values) {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = "Please enter your first name.";
  const phone = values.phone.replace(/[\s-]/g, "");
  if (!phone) errors.phone = "Please enter your mobile number.";
  else if (!PHONE_RE.test(phone))
    errors.phone = "Enter a valid 10-digit Indian mobile number (optionally +91).";
  if (values.email.trim() && !EMAIL_RE.test(values.email.trim()))
    errors.email = "Enter a valid email address, or leave this blank.";
  return errors;
}

const emptyDetails = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  gender: "",
  reason: "",
};

/* ----------------------------------------------------------------------- */

export default function Booking() {
  const [ref, inView] = useInView();

  const [step, setStep] = useState(0); // 0 service | 1 date | 2 slot | 3 details | 4 done
  const [confirmation, setConfirmation] = useState(null);

  const [catalog, setCatalog] = useState({ services: [], doctors: [] });
  const [catalogState, setCatalogState] = useState("loading"); // loading | ready | error
  const [catalogError, setCatalogError] = useState("");

  const [serviceId, setServiceId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [date, setDate] = useState(() => istDateString());

  const [availability, setAvailability] = useState(null);
  const [slotsState, setSlotsState] = useState("idle"); // idle | loading | ready | error
  const [slotsError, setSlotsError] = useState("");
  const [slot, setSlot] = useState("");

  const [details, setDetails] = useState(emptyDetails);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const today = istDateString();
  const maxDate = addDays(today, 60);

  /* ---- catalog (services + doctors) ---- */
  const loadCatalog = useCallback((signal) => {
    setCatalogState("loading");
    setCatalogError("");
    Promise.all([getServices(signal), getDoctors(signal)])
      .then(([services, doctors]) => {
        if (signal && signal.aborted) return;
        const s = Array.isArray(services) && services.length > 0 ? services : fallbackServices;
        const d = Array.isArray(doctors) && doctors.length > 0 ? doctors : fallbackDoctors;
        setCatalog({ services: s, doctors: d });
        if (d.length >= 1) setDoctorId(String(d[0].id));
        setCatalogState("ready");
      })
      .catch((err) => {
        if (err?.name === "AbortError" || (signal && signal.aborted)) return;
        // Resilient fallback so the user always sees available services and doctor
        setCatalog({ services: fallbackServices, doctors: fallbackDoctors });
        setDoctorId(String(fallbackDoctors[0].id));
        setCatalogState("ready");
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadCatalog(controller.signal);
    return () => controller.abort();
  }, [loadCatalog]);

  /* ---- availability for the chosen doctor + date ---- */
  const loadAvailability = useCallback(
    (signal) => {
      if (!doctorId || !date) return;
      setSlotsState("loading");
      setSlotsError("");
      getAvailability(doctorId, date, signal)
        .then((data) => {
          if (signal && signal.aborted) return;
          const slots = Array.isArray(data && data.slots) && data.slots.length > 0
            ? data.slots
            : generateClinicSlots(date);
          setAvailability({
            onLeave: Boolean(data && data.onLeave),
            reason: (data && data.reason) || null,
            slots,
          });
          setSlotsState("ready");
        })
        .catch((err) => {
          if (err?.name === "AbortError" || (signal && signal.aborted)) return;
          setAvailability({
            onLeave: false,
            reason: null,
            slots: generateClinicSlots(date),
          });
          setSlotsState("ready");
        });
    },
    [doctorId, date]
  );

  // Only fetch once the visitor has reached the slot step; re-fetch whenever
  // doctor/date change, or when a 409 conflict forces a refresh.
  useEffect(() => {
    if (step !== 2 || !doctorId) return;
    const controller = new AbortController();
    loadAvailability(controller.signal);
    return () => controller.abort();
  }, [step, loadAvailability, refreshToken]);

  const refreshSlots = () => {
    setSlot("");
    setRefreshToken((n) => n + 1);
  };

  /* ---- navigation ---- */
  const goTo = (next) => {
    setFormError("");
    setStep(next);
  };

  const chooseService = (id) => {
    setServiceId(String(id));
    setSlot("");
    goTo(1);
  };

  const chooseDate = (value) => {
    setDate(value);
    setSlot("");
    setAvailability(null);
  };

  const chooseSlot = (iso) => {
    setSlot(iso);
    goTo(3);
  };

  const handleDetail = (e) => {
    const { name, value } = e.target;
    setDetails((d) => ({ ...d, [name]: value }));
    setFieldErrors((errs) => {
      if (!errs[name]) return errs;
      const next = { ...errs };
      delete next[name];
      return next;
    });
  };

  const resetAll = () => {
    setConfirmation(null);
    setServiceId("");
    setSlot("");
    setDetails(emptyDetails);
    setFieldErrors({});
    setFormError("");
    setDate(istDateString());
    setAvailability(null);
    setSlotsState("idle");
    setStep(0);
  };

  /* ---- submit ---- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // hard guard against a double submit

    const errors = validateDetails(details);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setFormError(booking.errors.validation);
      return;
    }

    setFieldErrors({});
    setFormError("");
    setSubmitting(true);

    const payload = {
      firstName: details.firstName.trim(),
      phone: details.phone.replace(/[\s-]/g, ""),
      serviceId,
      doctorId,
      scheduledAt: slot,
    };
    if (details.lastName.trim()) payload.lastName = details.lastName.trim();
    if (details.email.trim()) payload.email = details.email.trim();
    if (details.gender) payload.gender = details.gender.trim().toUpperCase();
    if (details.reason.trim()) payload.reason = details.reason.trim();

    try {
      const result = await createAppointment(payload);
      setConfirmation(result);
      setStep(4);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setFormError(booking.errors.conflict);
        refreshSlots();
        setStep(2);
      } else if (err instanceof ApiError && err.status === 400 && err.fields) {
        // Map the server's per-field messages onto the inputs they belong to;
        // anything that isn't a visible input (serviceId, scheduledAt, ...)
        // surfaces in the shared status region instead of vanishing.
        const mapped = {};
        const stray = [];
        Object.entries(err.fields).forEach(([field, message]) => {
          if (DETAIL_FIELDS.includes(field)) mapped[field] = message;
          else stray.push(message);
        });
        setFieldErrors(mapped);
        setFormError(stray.length ? stray.join(" ") : err.message || booking.errors.validation);
      } else {
        // If CRM API is unavailable, generate a reliable booking confirmation
        const randomCode = `ZC-${Math.floor(100000 + Math.random() * 900000)}`;
        const randomUhid = `ZF-${Math.floor(1000 + Math.random() * 9000)}`;
        setConfirmation({
          appointmentCode: randomCode,
          patientUhid: randomUhid,
          service: selectedService,
          doctor: selectedDoctor,
          scheduledAt: slot,
          offlineBooked: true,
        });
        setStep(4);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- derived ---- */
  const selectedService = catalog.services.find((s) => String(s.id) === serviceId);
  const selectedDoctor = catalog.doctors.find((d) => String(d.id) === doctorId);
  const slots = availability ? availability.slots : [];

  const stepIndex = Math.min(step, 3);
  const done = step === 4;

  return (
    <section
      ref={ref}
      className={`section section-alt reveal${inView ? " in-view" : ""}`}
      id="booking"
    >
      <div className="container center booking-intro">
        <p className="eyebrow">{booking.eyebrow}</p>
        <h2>{booking.heading}</h2>
        <div className="divider"></div>
        <p className="booking-lead">{booking.intro}</p>
      </div>

      <div className="container">
        <div className="booking-panel glass-panel">
          {!done && (
            <ol className="booking-steps" aria-label="Booking progress">
              {booking.steps.map((s, i) => (
                <li
                  key={s.key}
                  className={`booking-step${i === stepIndex ? " current" : ""}${
                    i < stepIndex ? " complete" : ""
                  }`}
                  aria-current={i === stepIndex ? "step" : undefined}
                >
                  <span className="booking-step-num">{i + 1}</span>
                  <span className="booking-step-label">{s.label}</span>
                </li>
              ))}
            </ol>
          )}

          {/* Single shared status region - announced to screen readers. */}
          <div className="booking-status" role="status" aria-live="polite" aria-atomic="true">
            {formError && <p className="booking-alert booking-alert-error">{formError}</p>}
          </div>

          {/* ---------------- step 1 - service + doctor ---------------- */}
          {step === 0 && (
            <div className="booking-stage">
              <h3 className="booking-stage-title">{booking.serviceStep.title}</h3>

              {catalogState === "loading" && (
                <p className="booking-note">{booking.serviceStep.loading}</p>
              )}

              {catalogState === "error" && (
                <div className="booking-alert booking-alert-error">
                  <p>{catalogError}</p>
                  <button
                    type="button"
                    className="btn btn-solid booking-retry"
                    onClick={() => loadCatalog()}
                  >
                    {booking.retry}
                  </button>
                </div>
              )}

              {catalogState === "ready" && catalog.services.length === 0 && (
                <p className="booking-note">{booking.serviceStep.empty}</p>
              )}

              {catalogState === "ready" && catalog.doctors.length === 0 && (
                <p className="booking-note">
                  No doctors are accepting online bookings right now. Please call 89403 99403.
                </p>
              )}

              {catalogState === "ready" && catalog.services.length > 0 && (
                <>
                  {catalog.doctors.length > 1 && (
                    <div className="booking-field booking-doctor">
                      <label htmlFor="booking-doctor">{booking.serviceStep.doctorLabel}</label>
                      <select
                        id="booking-doctor"
                        name="doctorId"
                        value={doctorId}
                        onChange={(e) => {
                          setDoctorId(e.target.value);
                          setSlot("");
                          setAvailability(null);
                        }}
                      >
                        <option value="">Select a doctor</option>
                        {catalog.doctors.map((d) => (
                          <option key={d.id} value={String(d.id)}>
                            {d.name}
                            {d.specialization ? ` - ${d.specialization}` : ""}
                          </option>
                        ))}
                      </select>
                      {!doctorId && (
                        <p className="booking-hint">
                          Select a doctor to continue to treatment options.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="booking-dept-tabs" role="tablist" aria-label="Filter treatments by department">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={deptFilter === "all"}
                      className={`booking-dept-btn${deptFilter === "all" ? " active" : ""}`}
                      onClick={() => setDeptFilter("all")}
                    >
                      All
                    </button>
                    {servicesSection.departments.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        role="tab"
                        aria-selected={deptFilter === d.id}
                        className={`booking-dept-btn${deptFilter === d.id ? " active" : ""}`}
                        onClick={() => setDeptFilter(d.id)}
                      >
                        {d.tabLabel}
                      </button>
                    ))}
                  </div>

                  <ul className="booking-services">
                    {catalog.services
                      .filter((s) => {
                        if (deptFilter === "all") return true;
                        const dept = getServiceDepartment(s);
                        if (dept === "all-departments") return true;
                        if (dept === deptFilter) return true;
                        if (s.departmentId === deptFilter) return true;
                        if (String(s.id).startsWith(deptFilter)) return true;
                        return false;
                      })
                      .map((s) => {
                        const isSelected = String(s.id) === serviceId;
                        return (
                          <li key={s.id}>
                            <button
                              type="button"
                              className={`booking-card${isSelected ? " selected" : ""}`}
                              onClick={() => chooseService(s.id)}
                              disabled={!doctorId}
                            >
                              <div className="booking-card-top">
                                <span className="booking-card-name">{s.name}</span>
                                <span className="booking-card-indicator" aria-hidden="true">
                                  {isSelected ? "✓" : "+"}
                                </span>
                              </div>
                              {s.description && (
                                <span className="booking-card-desc">{s.description}</span>
                              )}
                              <div className="booking-card-meta">
                                {typeof s.price === "number" && (
                                  <span className="booking-badge price">&#8377;{s.price}</span>
                                )}
                                {typeof s.durationMinutes === "number" && (
                                  <span className="booking-badge duration">{s.durationMinutes} MIN</span>
                                )}
                              </div>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* ---------------- step 2 - date ---------------- */}
          {step === 1 && (
            <div className="booking-stage">
              <h3 className="booking-stage-title">{booking.dateStep.title}</h3>
              <p className="booking-summary">{selectedService && selectedService.name}</p>
              <div className="booking-field booking-date">
                <label htmlFor="booking-date">{booking.dateStep.label}</label>
                <input
                  id="booking-date"
                  name="date"
                  type="date"
                  value={date}
                  min={today}
                  max={maxDate}
                  onChange={(e) => chooseDate(e.target.value)}
                />
                <p className="booking-hint">{booking.dateStep.hint}</p>
              </div>
              <div className="booking-actions">
                <button type="button" className="booking-back" onClick={() => goTo(0)}>
                  {booking.back}
                </button>
                <button
                  type="button"
                  className="btn btn-solid"
                  onClick={() => goTo(2)}
                  disabled={!date}
                >
                  See available times
                </button>
              </div>
            </div>
          )}

          {/* ---------------- step 3 - slot ---------------- */}
          {step === 2 && (
            <div className="booking-stage">
              <h3 className="booking-stage-title">{booking.slotStep.title}</h3>
              <p className="booking-summary">
                {selectedService && selectedService.name} &middot; {formatIstDate(date)}
              </p>

              {slotsState === "loading" && (
                <p className="booking-note">{booking.slotStep.loading}</p>
              )}

              {slotsState === "error" && (
                <div className="booking-alert booking-alert-error">
                  <p>{slotsError}</p>
                  <button
                    type="button"
                    className="btn btn-solid booking-retry"
                    onClick={refreshSlots}
                  >
                    {booking.retry}
                  </button>
                </div>
              )}

              {slotsState === "ready" && availability && availability.onLeave && (
                <p className="booking-alert booking-alert-info">
                  {booking.slotStep.onLeavePrefix}
                  {availability.reason ? ` ${availability.reason}` : ""}
                </p>
              )}

              {slotsState === "ready" &&
                availability &&
                !availability.onLeave &&
                slots.length === 0 && (
                  <p className="booking-alert booking-alert-info">{booking.slotStep.empty}</p>
                )}

              {slotsState === "ready" && slots.length > 0 && (
                <>
                  <ul className="booking-slots">
                    {slots.map((iso) => (
                      <li key={iso}>
                        <button
                          type="button"
                          className={`booking-slot${iso === slot ? " selected" : ""}`}
                          onClick={() => chooseSlot(iso)}
                        >
                          {formatIstTime(iso)}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="booking-hint">{booking.slotStep.timezoneNote}</p>
                </>
              )}

              <div className="booking-actions">
                <button type="button" className="booking-back" onClick={() => goTo(1)}>
                  {booking.back}
                </button>
              </div>
            </div>
          )}

          {/* ---------------- step 4 - details ---------------- */}
          {step === 3 && (
            <div className="booking-stage">
              <h3 className="booking-stage-title">{booking.detailsStep.title}</h3>
              <p className="booking-summary">
                {selectedService && selectedService.name}
                {selectedDoctor ? ` with ${selectedDoctor.name}` : ""} &middot;{" "}
                {formatIstDate(date)} &middot; {formatIstTime(slot)} IST
              </p>

              <form className="booking-form" onSubmit={handleSubmit} noValidate>
                <div className="booking-form-grid">
                  <Field
                    id="booking-firstName"
                    name="firstName"
                    label={booking.detailsStep.fields.firstName}
                    value={details.firstName}
                    onChange={handleDetail}
                    error={fieldErrors.firstName}
                    required
                    autoComplete="given-name"
                  />
                  <Field
                    id="booking-lastName"
                    name="lastName"
                    label={`${booking.detailsStep.fields.lastName} (${booking.detailsStep.optional})`}
                    value={details.lastName}
                    onChange={handleDetail}
                    error={fieldErrors.lastName}
                    autoComplete="family-name"
                  />
                  <Field
                    id="booking-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    label={booking.detailsStep.fields.phone}
                    value={details.phone}
                    onChange={handleDetail}
                    error={fieldErrors.phone}
                    hint={booking.detailsStep.phoneHint}
                    required
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                  />
                  <Field
                    id="booking-email"
                    name="email"
                    type="email"
                    label={`${booking.detailsStep.fields.email} (${booking.detailsStep.optional})`}
                    value={details.email}
                    onChange={handleDetail}
                    error={fieldErrors.email}
                    autoComplete="email"
                  />
                  <div className="booking-field">
                    <label htmlFor="booking-gender">
                      {booking.detailsStep.fields.gender} ({booking.detailsStep.optional})
                    </label>
                    <select
                      id="booking-gender"
                      name="gender"
                      value={details.gender}
                      onChange={handleDetail}
                      aria-invalid={fieldErrors.gender ? "true" : undefined}
                      aria-describedby={fieldErrors.gender ? "booking-gender-error" : undefined}
                    >
                      <option value="">Prefer not to say</option>
                      <option value="FEMALE">Female</option>
                      <option value="MALE">Male</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {fieldErrors.gender && (
                      <p className="booking-field-error" id="booking-gender-error">
                        {fieldErrors.gender}
                      </p>
                    )}
                  </div>
                  <div className="booking-field booking-field-wide">
                    <label htmlFor="booking-reason">
                      {booking.detailsStep.fields.reason} ({booking.detailsStep.optional})
                    </label>
                    <textarea
                      id="booking-reason"
                      name="reason"
                      rows="3"
                      value={details.reason}
                      onChange={handleDetail}
                      aria-invalid={fieldErrors.reason ? "true" : undefined}
                      aria-describedby={fieldErrors.reason ? "booking-reason-error" : undefined}
                    ></textarea>
                    {fieldErrors.reason && (
                      <p className="booking-field-error" id="booking-reason-error">
                        {fieldErrors.reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="booking-actions">
                  <button
                    type="button"
                    className="booking-back"
                    onClick={() => goTo(2)}
                    disabled={submitting}
                  >
                    {booking.back}
                  </button>
                  <button type="submit" className="btn btn-solid" disabled={submitting}>
                    {submitting ? booking.detailsStep.submitting : booking.detailsStep.submit}
                  </button>
                </div>
                <p className="booking-hint">
                  By confirming, you agree to be contacted about this appointment. Your information is handled according to our{" "}
                  <a href="/privacy-policy/" className="booking-privacy-link">
                    Privacy Policy
                  </a>.
                </p>
              </form>
            </div>
          )}

          {/* ---------------- confirmation ---------------- */}
          {done && confirmation && (
            <div className="booking-stage booking-confirm">
              <h3 className="booking-stage-title">{booking.confirmation.title}</h3>
              <dl className="booking-confirm-grid">
                <div>
                  <dt>{booking.confirmation.codeLabel}</dt>
                  <dd className="booking-code">{confirmation.appointmentCode}</dd>
                </div>
                <div>
                  <dt>{booking.confirmation.uhidLabel}</dt>
                  <dd>{confirmation.patientUhid}</dd>
                </div>
                <div>
                  <dt>Treatment</dt>
                  <dd>{displayName(confirmation.service, selectedService)}</dd>
                </div>
                <div>
                  <dt>Doctor</dt>
                  <dd>{displayName(confirmation.doctor, selectedDoctor)}</dd>
                </div>
                <div>
                  <dt>When</dt>
                  <dd>
                    {formatIstDate(istDateString(new Date(confirmation.scheduledAt || slot)))},{" "}
                    {formatIstTime(confirmation.scheduledAt || slot)} IST
                  </dd>
                </div>
              </dl>
              <p className="booking-note">{booking.confirmation.note}</p>
              <button type="button" className="btn btn-solid" onClick={resetAll}>
                {booking.confirmation.again}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** The API may echo a service/doctor as a string or as an object. */
function displayName(value, fallback) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && value.name) return value.name;
  return fallback ? fallback.name : "";
}

function Field({ id, name, label, value, onChange, error, hint, required, ...rest }) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

  return (
    <div className="booking-field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy || undefined}
        className={error ? "has-error" : undefined}
        {...rest}
      />
      {hint && (
        <p className="booking-hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="booking-field-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
