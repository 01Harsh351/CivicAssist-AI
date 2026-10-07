/**
 * Calendar utilities for Google Calendar deep-linking and RFC 5545 .ICS file generation.
 */

export interface CalendarEventPayload {
  title: string;
  description: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm (default '10:00')
  durationMinutes?: number; // default 60
  portalUrl?: string;
}

/**
 * Format date and time into UTC string format: YYYYMMDDTHHmmssZ
 */
function toUtcIsoCompact(dateStr: string, timeStr: string = '10:00', durationMinutes: number = 60) {
  const [hours, minutes] = timeStr.split(':').map((n) => parseInt(n, 10) || 0);
  const [year, month, day] = dateStr.split('-').map((n) => parseInt(n, 10));

  const start = new Date(year, month - 1, day, hours, minutes, 0);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const formatUtc = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  return {
    startUtc: formatUtc(start),
    endUtc: formatUtc(end),
    startDateObj: start,
    endDateObj: end,
  };
}

/**
 * Escape text for RFC 5545 iCalendar standard
 */
function escapeIcsText(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\n');
}

/**
 * Generates a direct Google Calendar Web event creation URL.
 * Opens pre-filled Google Calendar event in 1 click without requiring OAuth.
 */
export function generateGoogleCalendarUrl(payload: CalendarEventPayload): string {
  const { startUtc, endUtc } = toUtcIsoCompact(
    payload.startDate,
    payload.startTime || '10:00',
    payload.durationMinutes || 60
  );

  let details = payload.description || '';
  if (payload.portalUrl) {
    details += `\n\nOfficial Portal Link: ${payload.portalUrl}`;
  }
  details += '\n\n— Tracked via CivicAssist AI (Smart Public Service Navigator)';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: payload.title,
    dates: `${startUtc}/${endUtc}`,
    details: details,
  });

  if (payload.location) {
    params.set('location', payload.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an RFC 5545 compliant .ICS file string for Apple Calendar,
 * Outlook, Thunderbird, and Mobile calendars, with embedded alarms.
 */
export function generateIcsContent(payload: CalendarEventPayload): string {
  const { startUtc, endUtc } = toUtcIsoCompact(
    payload.startDate,
    payload.startTime || '10:00',
    payload.durationMinutes || 60
  );

  const nowUtc = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `civicassist-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@civicassist.in`;

  let fullDescription = payload.description || '';
  if (payload.portalUrl) {
    fullDescription += `\n\nOfficial Portal: ${payload.portalUrl}`;
  }
  fullDescription += '\n\nCreated with CivicAssist AI — Independent Citizen Service Navigator.';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CivicAssist AI//Indian Citizen Public Service Navigator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${escapeIcsText(payload.title)}`,
    `DESCRIPTION:${escapeIcsText(fullDescription)}`,
    payload.location ? `LOCATION:${escapeIcsText(payload.location)}` : 'LOCATION:Official Government Portal / Citizen Seva Kendra',
    payload.portalUrl ? `URL:${payload.portalUrl}` : '',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    // 1-Day Prior Alarm Notification
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: 1 day until ${escapeIcsText(payload.title)}`,
    'END:VALARM',
    // 2-Hours Prior Alarm Notification
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Urgent: ${escapeIcsText(payload.title)} deadline today!`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.join('\r\n');
}

/**
 * Triggers a download of the .ics calendar file in the user's browser.
 */
export function downloadIcsFile(filename: string, icsContent: string): void {
  const safeFilename = filename.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.setAttribute('download', `${safeFilename}.ics`);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
