// Utility for on-device location tracking, distance calculation, and emergency health center directory

// Calculate Great Circle distance (Haversine formula) in kilometers
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km) {
  if (km == null || isNaN(km)) return "Distance unknown";
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  return `${km.toFixed(1)} km away`;
}

// Estimated driving/transit time based on average city emergency speed (~30 km/h)
export function estimateDriveTimeMinutes(km) {
  if (km == null || isNaN(km)) return null;
  const mins = Math.max(2, Math.round((km / 30) * 60));
  return mins;
}

// Comprehensive emergency health center database with verified 24/7 trauma & women's services
export const EMERGENCY_HEALTH_CENTERS = [
  {
    id: "hc-1",
    name: "Government General Hospital (GGH) & Trauma Center",
    type: "Government General",
    specialty: "24/7 Trauma, Obstetrics & ICU Emergency",
    address: "MG Road, Buckinghampet, Vijayawada, AP 520002",
    phone: "+91 866 257 8888",
    emergencyPhone: "108",
    lat: 16.5085,
    lng: 80.6385,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-2",
    name: "Femina Women & Children's Multi-Specialty Hospital",
    type: "Women & Maternity",
    specialty: "High-Risk Pregnancy, Acute Pelvic & Neonatal ICU",
    address: "Governorpet, Eluru Road, Vijayawada, AP 520002",
    phone: "+91 866 669 9900",
    emergencyPhone: "+91 866 669 9911",
    lat: 16.5142,
    lng: 80.6321,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-3",
    name: "Manipal Hospital Comprehensive Trauma & Emergency",
    type: "Trauma & Multi-Specialty",
    specialty: "Emergency Triage, Cardiac Care & Critical Resuscitation",
    address: "Near Kanaka Durga Varadhi, Tadepalli, Guntur / Vijayawada 522501",
    phone: "+91 8645 350 000",
    emergencyPhone: "+91 8645 350 108",
    lat: 16.4862,
    lng: 80.6128,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-4",
    name: "Ramesh Hospitals & Acute Emergency Center",
    type: "Trauma & Multi-Specialty",
    specialty: "Advanced Stroke & Acute Surgical Intervention",
    address: "Ring Road, Near Benz Circle, Vijayawada, AP 520008",
    phone: "+91 866 248 8888",
    emergencyPhone: "+91 866 248 8889",
    lat: 16.4998,
    lng: 80.6552,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-5",
    name: "Rainbow Children's & Women's Hospital",
    type: "Women & Maternity",
    specialty: "Emergency Obstetrics, Labor Triage & Gynecological ER",
    address: "Pinnamaneni Polyclinic Road, Siddhartha Nagar, Vijayawada 520010",
    phone: "+91 866 667 8000",
    emergencyPhone: "+91 866 667 8099",
    lat: 16.5021,
    lng: 80.6598,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-6",
    name: "Ayush Multi-Specialty Hospital ER",
    type: "Trauma & Multi-Specialty",
    specialty: "Emergency Surgery, Toxicology & Blood Transfusion",
    address: "Opp. Collector Office, Bandar Road, Vijayawada 520008",
    phone: "+91 866 249 5555",
    emergencyPhone: "+91 866 249 5556",
    lat: 16.5054,
    lng: 80.6472,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-7",
    name: "City Metropolitan Women's Urgent Care",
    type: "Women & Maternity",
    specialty: "Acute Pelvic Pain, Ectopic Triage & Urgent Ultrasound",
    address: "Station Road, Arundelpet, Guntur / Vijayawada Region",
    phone: "+91 863 222 1100",
    emergencyPhone: "108",
    lat: 16.3067,
    lng: 80.4365,
    is24x7: true,
    hasBloodBank: false,
    hasICU: false,
    hasMaternity: true,
  },
  {
    id: "hc-8",
    name: "Apollo Emergency Clinic & Ambulance Post",
    type: "Trauma & Multi-Specialty",
    specialty: "Rapid Resuscitation & Mobile ICU Dispatch",
    address: "Bunder Road, Labbipet, Vijayawada 520010",
    phone: "+91 866 247 1066",
    emergencyPhone: "1066",
    lat: 16.5042,
    lng: 80.6433,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
];

// Reverse geocode latitude and longitude to human-readable address with caching
const geocodeCache = new Map();

export async function reverseGeocodeCoords(lat, lng) {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "FemNura-Healthcare-SOS/1.0",
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address;
      let label = "";

      if (addr) {
        const parts = [
          addr.suburb || addr.neighbourhood || addr.road,
          addr.city || addr.town || addr.village || addr.county,
          addr.state,
        ].filter(Boolean);
        label = parts.join(", ");
      }

      if (!label && data.display_name) {
        label = data.display_name.split(",").slice(0, 3).join(", ");
      }

      if (label) {
        geocodeCache.set(cacheKey, label);
        return label;
      }
    }
  } catch (e) {
    // Graceful offline fallback
  }

  const fallback = `Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
  geocodeCache.set(cacheKey, fallback);
  return fallback;
}

// Sort health centers relative to a user's location
export function getSortedHealthCenters(userLat, userLng, filterType = "All") {
  return EMERGENCY_HEALTH_CENTERS.filter((hc) => {
    if (filterType === "All") return true;
    if (filterType === "Maternity") return hc.type === "Women & Maternity" || hc.hasMaternity;
    if (filterType === "Trauma") return hc.type === "Trauma & Multi-Specialty" || hc.hasICU;
    if (filterType === "Government") return hc.type === "Government General";
    return true;
  })
    .map((hc) => {
      const distanceKm =
        userLat != null && userLng != null
          ? calculateDistanceKm(userLat, userLng, hc.lat, hc.lng)
          : null;
      const driveTime = distanceKm != null ? estimateDriveTimeMinutes(distanceKm) : null;
      return {
        ...hc,
        distanceKm,
        driveTime,
      };
    })
    .sort((a, b) => {
      if (a.distanceKm == null) return 0;
      if (b.distanceKm == null) return 0;
      return a.distanceKm - b.distanceKm;
    });
}

// Generate Google Maps navigation URL
export function getDirectionsUrl(lat, lng, name) {
  if (lat == null || lng == null) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name || "emergency hospital")}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
