// Calendar utilities for Google Calendar & iCal / Outlook (.ics)

export function getGoogleCalendarUrl() {
  const title = encodeURIComponent("Akanksha's Twilight Toast 🎀");
  const details = encodeURIComponent("Join us as we shower our Cheri Cheri Bride with love, laughter & happiness! Akanksha Manhas");
  const location = encodeURIComponent("Manhas Residence");
  // 2026-11-21 19:00 IST is 13:30 UTC
  const dates = "20261121T133000Z/20261121T183000Z";

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

export function downloadIcsFile() {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Akanksha Twilight Toast//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:akanksha-twilight-toast-2026@celebration.com
DTSTAMP:20261109T000000Z
DTSTART:20261121T133000Z
DTEND:20261121T183000Z
SUMMARY:Akanksha's Twilight Toast 🎀
DESCRIPTION:Join us as we shower our Cheri Cheri Bride with love, laughter & happiness!
LOCATION:Manhas Residence
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'Akanksha-Twilight-Toast.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

