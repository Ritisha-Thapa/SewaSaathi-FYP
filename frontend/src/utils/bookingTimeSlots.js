/** Hourly booking slots (24h "HH:mm"). */
export const BOOKING_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export const BOOKING_BUFFER_HOURS = 1;

/** Local calendar date as YYYY-MM-DD (avoids UTC shift from toISOString). */
export function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseTimeSlot(slot) {
  const [hours, minutes] = slot.split(":").map(Number);
  return { hours, minutes };
}

/** Combine a local date string and slot into a local Date. */
export function slotToDate(selectedDate, slot) {
  const { hours, minutes } = parseTimeSlot(slot);
  const [y, mo, d] = selectedDate.split("-").map(Number);
  return new Date(y, mo - 1, d, hours, minutes, 0, 0);
}

export function getMinBookingDatetime(referenceDate = new Date()) {
  return new Date(
    referenceDate.getTime() + BOOKING_BUFFER_HOURS * 60 * 60 * 1000
  );
}

/**
 * A slot is selectable when:
 * - selected date is not today → always allowed
 * - selected date is today → slot start >= now + 1 hour
 */
export function isSlotSelectable(slot, selectedDate, referenceDate = new Date()) {
  if (!selectedDate) return false;
  if (selectedDate !== getLocalDateString(referenceDate)) return true;
  const slotDate = slotToDate(selectedDate, slot);
  return slotDate >= getMinBookingDatetime(referenceDate);
}

export function isTimeSelectionValid(time, date, referenceDate = new Date()) {
  if (!time || !date) return false;
  return isSlotSelectable(time, date, referenceDate);
}
