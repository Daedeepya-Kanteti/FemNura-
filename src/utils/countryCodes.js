export const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳", label: "+91 (India)" },
  { code: "+1", country: "US / Canada", flag: "🇺🇸", label: "+1 (US/CA)" },
  { code: "+44", country: "UK", flag: "🇬🇧", label: "+44 (UK)" },
  { code: "+61", country: "Australia", flag: "🇦🇺", label: "+61 (Australia)" },
  { code: "+971", country: "UAE", flag: "🇦🇪", label: "+971 (UAE)" },
  { code: "+65", country: "Singapore", flag: "🇸🇬", label: "+65 (Singapore)" },
  { code: "+49", country: "Germany", flag: "🇩🇪", label: "+49 (Germany)" },
  { code: "+33", country: "France", flag: "🇫🇷", label: "+33 (France)" },
  { code: "+81", country: "Japan", flag: "🇯🇵", label: "+81 (Japan)" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", label: "+966 (Saudi Arabia)" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾", label: "+60 (Malaysia)" },
  { code: "+977", country: "Nepal", flag: "🇳🇵", label: "+977 (Nepal)" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩", label: "+880 (Bangladesh)" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰", label: "+94 (Sri Lanka)" },
  { code: "+27", country: "South Africa", flag: "🇿🇦", label: "+27 (South Africa)" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭", label: "+41 (Switzerland)" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿", label: "+64 (New Zealand)" },
  { code: "+353", country: "Ireland", flag: "🇮🇪", label: "+353 (Ireland)" },
  { code: "+34", country: "Spain", flag: "🇪🇸", label: "+34 (Spain)" },
  { code: "+39", country: "Italy", flag: "🇮🇹", label: "+39 (Italy)" },
];

/**
 * Format or prepend a phone number with the chosen country code.
 * If the number already has an international prefix, replaces it or strips it cleanly.
 */
export function formatPhoneNumberWithCode(phone, selectedCode = "+91") {
  if (!phone) return selectedCode;
  const trimmed = phone.trim();

  // If already starts with the exact selectedCode, return as is
  if (trimmed.startsWith(selectedCode)) {
    return trimmed;
  }

  // If starts with another +code (e.g. +1, +44, +91)
  if (trimmed.startsWith("+")) {
    // Strip leading + and up to 3 digits of existing code, or just keep body
    const match = trimmed.match(/^\+\d{1,4}\s*(.*)$/);
    if (match && match[1]) {
      return `${selectedCode} ${match[1].trim()}`;
    }
  }

  // If standard local number without +, prepend selected code
  return `${selectedCode} ${trimmed}`;
}

/**
 * Get dialable number for tel: or sms: links
 */
export function getDialableNumber(phone, selectedCode = "+91") {
  const full = formatPhoneNumberWithCode(phone, selectedCode);
  // Remove spaces, parentheses, dashes, keeping + and digits
  return full.replace(/[^\d+]/g, "");
}
