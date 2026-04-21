/**
 * Date Utilities
 * ---------------
 * Reusable functions for formatting date and time strings.
 */

/**
 * Formats a raw date string (e.g., "2026-10-21") into a human-readable format.
 * Example: "2026-10-21" -> "Oct 21, 2026"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "No Date Set";
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
};

/**
 * Formats a raw time string (e.g., "14:30") into a human-readable 12-hour format.
 * Example: "14:30" -> "02:30 PM"
 */
export const formatTime = (timeString: string | null): string => {
  if (!timeString) return "No Time Set";

  try {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error("Time formatting error:", error);
    return timeString;
  }
};
