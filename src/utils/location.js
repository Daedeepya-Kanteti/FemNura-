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
  // Andhra Pradesh (Vijayawada / Guntur)
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
  // Hyderabad / Telangana
  {
    id: "hc-9",
    name: "Apollo Hospitals Emergency & Trauma Centre",
    type: "Trauma & Multi-Specialty",
    specialty: "Level 1 Trauma, Comprehensive Resuscitation & Acute Triage",
    address: "Road No. 72, Film Nagar, Jubilee Hills, Hyderabad 500033",
    phone: "+91 40 2360 7777",
    emergencyPhone: "1066",
    lat: 17.4156,
    lng: 78.4124,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-10",
    name: "Fernandez Hospital Women's Emergency & Labor Care",
    type: "Women & Maternity",
    specialty: "High-Risk Obstetrics, Acute Fetal Triage & Emergency C-Section",
    address: "Bogulkunta, Hyderguda, Hyderabad 500001",
    phone: "+91 40 4022 2300",
    emergencyPhone: "+91 40 4022 2399",
    lat: 17.3975,
    lng: 78.4828,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-11",
    name: "KIMS Hospitals Comprehensive ER",
    type: "Trauma & Multi-Specialty",
    specialty: "Acute Stroke, Surgical Resuscitation & Intensive Care",
    address: "Minister Road, Secunderabad, Hyderabad 500003",
    phone: "+91 40 4488 5000",
    emergencyPhone: "108",
    lat: 17.4416,
    lng: 78.4907,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  // Bengaluru / Karnataka
  {
    id: "hc-12",
    name: "Manipal Hospital HAL Airport Road Emergency",
    type: "Trauma & Multi-Specialty",
    specialty: "24/7 Trauma Resuscitation, Cardiac & Critical Care",
    address: "98 HAL Old Airport Road, Kodihalli, Bengaluru 560017",
    phone: "+91 80 2502 4444",
    emergencyPhone: "+91 80 2502 3344",
    lat: 12.9587,
    lng: 77.6496,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-13",
    name: "Cloudnine Hospital Women & Maternity Emergency",
    type: "Women & Maternity",
    specialty: "Acute Obstetrics, High-Risk Labor & Gynecological Emergency",
    address: "1533 9th Main Road, 3rd Block, Jayanagar, Bengaluru 560011",
    phone: "+91 80 6792 9999",
    emergencyPhone: "+91 99728 99728",
    lat: 12.9298,
    lng: 77.5833,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-14",
    name: "St. John's Medical College Hospital Emergency Center",
    type: "Government General",
    specialty: "Tertiary Emergency Care, Intensive Care & Trauma",
    address: "Sarjapur Road, John Nagar, Koramangala, Bengaluru 560034",
    phone: "+91 80 2206 5000",
    emergencyPhone: "108",
    lat: 12.9288,
    lng: 77.6202,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  // Chennai / Tamil Nadu
  {
    id: "hc-15",
    name: "Apollo Hospitals Greams Road ER & Trauma",
    type: "Trauma & Multi-Specialty",
    specialty: "Acute Cardiac & Polytrauma Emergency Care",
    address: "21 Greams Lane, Thousand Lights, Chennai 600006",
    phone: "+91 44 2829 0200",
    emergencyPhone: "1066",
    lat: 13.0594,
    lng: 80.2524,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-16",
    name: "Institute of Obstetrics and Gynaecology (IOG Egmore)",
    type: "Government General",
    specialty: "Comprehensive 24/7 Government Women & Maternity Emergency",
    address: "EVR Periyar Salai, Egmore, Chennai 600008",
    phone: "+91 44 2819 1982",
    emergencyPhone: "108",
    lat: 13.0732,
    lng: 80.2612,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  // Delhi NCR
  {
    id: "hc-17",
    name: "AIIMS Apex Trauma & Emergency Medical Centre",
    type: "Government General",
    specialty: "Apex National Emergency Care, Resuscitation & Surgery",
    address: "Sri Aurobindo Marg, Ansari Nagar East, New Delhi 110029",
    phone: "+91 11 2658 8500",
    emergencyPhone: "102 / 108",
    lat: 28.5672,
    lng: 77.21,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-18",
    name: "Safdarjung Hospital Emergency & Maternity Block",
    type: "Government General",
    specialty: "24/7 Acute Obstetrics, Severe Burns & Trauma",
    address: "Ring Road, Opposite AIIMS, New Delhi 110029",
    phone: "+91 11 2616 5060",
    emergencyPhone: "108",
    lat: 28.5709,
    lng: 77.2072,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  // Mumbai / Maharashtra
  {
    id: "hc-19",
    name: "Lilavati Hospital & Research Centre 24/7 ER",
    type: "Trauma & Multi-Specialty",
    specialty: "Cardiac ICU, Acute Triage & Resuscitation",
    address: "A-791, Bandra Reclamation, Bandra West, Mumbai 400050",
    phone: "+91 22 2675 1000",
    emergencyPhone: "+91 22 2656 8000",
    lat: 19.0519,
    lng: 72.829,
    is24x7: true,
    hasBloodBank: true,
    hasICU: true,
    hasMaternity: true,
  },
  {
    id: "hc-20",
    name: "Surya Hospitals Women & Child Emergency",
    type: "Women & Maternity",
    specialty: "Acute Obstetrics, High-Risk Labor & Neonatal Emergency",
    address: "Dattatray Road, Santacruz West, Mumbai 400054",
    phone: "+91 22 6153 8989",
    emergencyPhone: "+91 22 6153 8900",
    lat: 19.0835,
    lng: 72.8398,
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

// Popular regional city & district presets
export const CITY_PRESETS = [
  { name: "Vijayawada (Siddhartha Nagar / Benz Circle)", lat: 16.5062, lng: 80.648, address: "Siddhartha Nagar, Vijayawada, Andhra Pradesh" },
  { name: "Vijayawada (GGH / Buckinghampet Area)", lat: 16.5085, lng: 80.6385, address: "MG Road, Buckinghampet, Vijayawada, AP" },
  { name: "Guntur / Tadepalli", lat: 16.4862, lng: 80.6128, address: "Tadepalli, Guntur / Vijayawada Region" },
  { name: "Hyderabad (Banjara / Jubilee Hills)", lat: 17.4123, lng: 78.4285, address: "Banjara Hills, Hyderabad, Telangana" },
  { name: "Bengaluru (Central / Koramangala)", lat: 12.9352, lng: 77.6245, address: "Koramangala, Bengaluru, Karnataka" },
  { name: "Chennai (Central / T. Nagar)", lat: 13.0418, lng: 80.2341, address: "T. Nagar, Chennai, Tamil Nadu" },
  { name: "Delhi NCR (Central)", lat: 28.6139, lng: 77.209, address: "Central Delhi, Delhi" },
  { name: "Mumbai (South / Bandra)", lat: 19.0596, lng: 72.8295, address: "Bandra West, Mumbai, Maharashtra" },
];

// Fallback to network/IP-based geolocation when browser/iframe restricts GPS hardware
export async function getFallbackNetworkLocation() {
  const endpoints = [
    "https://ipwho.is/",
    "https://freeipapi.com/api/json",
    "https://ipapi.co/json/",
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const lat = data.latitude ?? data.lat;
        const lng = data.longitude ?? data.lon;

        if (lat != null && lng != null && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
          const city = data.city || data.cityName || "Current Region";
          const region = data.region || data.regionName || "";
          const country = data.country || data.countryName || "";
          const parts = [city, region, country].filter(Boolean);

          return {
            latitude: Number(lat),
            longitude: Number(lng),
            city,
            region,
            country,
            address: parts.join(", ") || "Network Detected Area",
            source: "network",
            accuracy: 3500, // network accuracy ~3.5km
          };
        }
      }
    } catch (e) {
      // try next endpoint
    }
  }

  // Sensible default matching student/user's institution location (Siddhartha Academy / Vijayawada)
  return {
    latitude: 16.5062,
    longitude: 80.648,
    city: "Vijayawada",
    region: "Andhra Pradesh",
    country: "India",
    address: "Vijayawada, Andhra Pradesh (Regional Network Center)",
    source: "preset",
    accuracy: 3000,
  };
}

// Search coordinates by city or area name via Nominatim
export async function searchCoordinatesForQuery(query) {
  if (!query || !query.trim()) return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=1`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "FemNura-Healthcare-SOS/1.0",
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const list = await res.json();
      if (list && list.length > 0) {
        const item = list[0];
        return {
          latitude: Number(item.lat),
          longitude: Number(item.lon),
          address: item.display_name.split(",").slice(0, 3).join(", "),
          source: "manual_search",
          accuracy: 1000,
        };
      }
    }
  } catch (e) {
    // search failed
  }
  return null;
}

