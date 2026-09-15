/* =========================================
   COSMOS — A LIVING MAP OF THE SKY
   Main script
========================================= */

/* ---------- Mobile nav ---------- */

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton?.addEventListener("click", () => navLinks.classList.toggle("open"));

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* ---------- Active nav on scroll ---------- */

const sections = document.querySelectorAll("section[id]");
const navigationLinks = document.querySelectorAll(".nav-links a");

function updateActiveNav() {
  let current = "";
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) current = section.id;
  });
  navigationLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}
window.addEventListener("scroll", updateActiveNav);

/* ---------- Shared scroll lock ---------- */

const searchOverlay = document.getElementById("searchOverlay");
const targetModal = document.getElementById("targetModal");
let lastFocusedElement = null;
let lastTargetTrigger = null;

function updateScrollLock() {
  const locked = searchOverlay.classList.contains("active") || targetModal.classList.contains("active");
  document.body.classList.toggle("no-scroll", locked);
}

function restoreFocus() {
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  lastFocusedElement = null;
}

/* ---------- Search ---------- */

const openSearch = document.getElementById("openSearch");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

openSearch?.addEventListener("click", () => {
  lastFocusedElement = document.activeElement;
  searchOverlay.classList.add("active");
  searchOverlay.setAttribute("aria-hidden", "false");
  updateScrollLock();
  setTimeout(() => searchInput.focus(), 100);
});

closeSearch?.addEventListener("click", closeSearchOverlay);

searchOverlay?.addEventListener("click", event => {
  if (event.target === searchOverlay) closeSearchOverlay();
});

function closeSearchOverlay() {
  searchOverlay.classList.remove("active");
  searchOverlay.setAttribute("aria-hidden", "true");
  searchInput.value = "";
  searchResults.innerHTML = "";
  updateScrollLock();
  restoreFocus();
}

const searchableContent = [
  { title: "Solar System", description: "The live orbit visual and the eight planets.", target: "#solar-system" },
  { title: "Tonight's sky", description: "Dark-sky window, moon phase, and seeing conditions.", target: "#tonight" },
  { title: "Dark-sky window", description: "When the sun is far enough below the horizon for faint objects.", target: "#tonight" },
  { title: "Moon phase", description: "Current illumination and the next full moon.", target: "#tonight" },
  { title: "Twilight", description: "Sunset, civil, nautical, and astronomical dusk.", target: "#tonight" },
  { title: "ISS", description: "Current position of the International Space Station.", target: "#tonight" },
  { title: "Meteor", description: "The shooting stars drifting across the background.", target: "#top" },
  { title: "Mercury", description: "Closest planet to the Sun.", target: "#targets" },
  { title: "Venus", description: "The brightest planet in the sky.", target: "#targets" },
  { title: "Earth", description: "Our observing platform.", target: "#targets" },
  { title: "Mars", description: "The Red Planet.", target: "#targets" },
  { title: "Jupiter", description: "The largest planet; four moons visible in binoculars.", target: "#targets" },
  { title: "Saturn", description: "Famous for its rings.", target: "#targets" },
  { title: "Uranus", description: "An ice giant tilted on its side.", target: "#targets" },
  { title: "Neptune", description: "The most distant planet, telescope required.", target: "#targets" },
  { title: "Orion", description: "This month's featured constellation.", target: "#constellation" },
  { title: "Ecosystem", description: "The wider COSMOS set of sites and apps.", target: "#ecosystem" },
  { title: "Contact", description: "Get in touch with Yogesh.", target: "#contact" }
];

searchResults?.addEventListener("click", event => {
  if (event.target.closest(".search-result")) closeSearchOverlay();
});

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) { searchResults.innerHTML = ""; return; }

  const matches = searchableContent.filter(item =>
    item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  );

  if (!matches.length) {
    searchResults.innerHTML = `<div class="search-result"><strong>No results found.</strong><small>Try a planet name, or "moon", "meteor", "orion".</small></div>`;
    return;
  }

  searchResults.innerHTML = matches.slice(0, 6).map(item => `
    <a href="${item.target}" class="search-result">
      <strong>${item.title}</strong>
      <small>${item.description}</small>
    </a>
  `).join("");
});

/* ---------- Escape key ---------- */

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeSearchOverlay();
    hideTargetDetails();
    navLinks.classList.remove("open");
  }
});

/* ---------- Target card tilt ---------- */

document.querySelectorAll(".target-card").forEach(card => {
  card.addEventListener("mousemove", event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - .5) * -7;
    const rotateY = ((x / rect.width) - .5) * 7;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

/* ---------- Target (planet) profiles ---------- */

const targetProfiles = {
  mercury: { name: "Mercury", description: "The smallest planet and the closest world to the Sun, with a surface shaped by impact craters.", fact: "Best viewed within a couple of weeks of greatest elongation, low in twilight.", distance: "57.9 million km", orbit: "87.97 Earth days", magnitude: "−1.9 to 5.7", instrument: "Naked eye, near horizon" },
  venus: { name: "Venus", description: "A bright, cloud-covered world with a crushing atmosphere and the hottest surface of any planet.", fact: "Shows phases like the Moon when viewed through even a small telescope.", distance: "108.2 million km", orbit: "224.70 Earth days", magnitude: "−4.6", instrument: "Naked eye" },
  earth: { name: "Earth", description: "Our ocean world, and the platform every other observation on this page is made from.", fact: "The only planet in the Solar System with liquid water oceans on its surface.", distance: "149.6 million km", orbit: "365.25 Earth days", magnitude: "—", instrument: "You're standing on it" },
  mars: { name: "Mars", description: "The Red Planet is a cold desert world with ancient valleys, giant volcanoes, and polar ice.", fact: "Brightest and best-observed near opposition, roughly every 26 months.", distance: "227.9 million km", orbit: "686.98 Earth days", magnitude: "−2.9 to 1.8", instrument: "Naked eye; telescope for surface detail" },
  jupiter: { name: "Jupiter", description: "A gas giant with powerful storms, dozens of moons, and a magnetic field larger than any planet's.", fact: "Even basic binoculars will show the four Galilean moons as points of light.", distance: "778.5 million km", orbit: "11.86 Earth years", magnitude: "−2.9 to −1.6", instrument: "Naked eye; binoculars for moons" },
  saturn: { name: "Saturn", description: "A low-density gas giant surrounded by a spectacular system of bright icy rings.", fact: "A 50mm telescope at modest magnification is enough to split the rings from the disc.", distance: "1.43 billion km", orbit: "29.45 Earth years", magnitude: "0.5 average", instrument: "Small telescope for rings" },
  uranus: { name: "Uranus", description: "An ice giant with a blue-green atmosphere and an extreme sideways tilt.", fact: "Technically naked-eye under very dark skies, but binoculars make it far easier to find.", distance: "2.87 billion km", orbit: "84 Earth years", magnitude: "5.7", instrument: "Binoculars recommended" },
  neptune: { name: "Neptune", description: "A distant, dynamic ice giant with deep blue clouds and the fastest winds in the Solar System.", fact: "Discovered by calculation before it was ever seen, from irregularities in Uranus's orbit.", distance: "4.50 billion km", orbit: "164.8 Earth years", magnitude: "7.8", instrument: "Telescope required" }
};

const modalPlanet = document.getElementById("modalPlanet");
const closeTargetModal = document.getElementById("closeTargetModal");

function showTargetDetails(key) {
  const target = targetProfiles[key];
  if (!target || !targetModal) return;

  document.getElementById("targetModalCategory").textContent = `${target.name.toUpperCase()} · TARGET PROFILE`;
  document.getElementById("targetModalTitle").textContent = target.name;
  document.getElementById("targetModalDescription").textContent = target.description;
  document.getElementById("targetModalFact").textContent = target.fact;
  document.getElementById("targetDistance").textContent = target.distance;
  document.getElementById("targetOrbit").textContent = target.orbit;
  document.getElementById("targetMagnitude").textContent = target.magnitude;
  document.getElementById("targetInstrument").textContent = target.instrument;

  modalPlanet.className = `planet modal-planet ${key}`;
  targetModal.classList.add("active");
  targetModal.setAttribute("aria-hidden", "false");
  updateScrollLock();
  closeTargetModal.focus();
}

function hideTargetDetails() {
  if (!targetModal) return;
  targetModal.classList.remove("active");
  targetModal.setAttribute("aria-hidden", "true");
  updateScrollLock();
  if (lastTargetTrigger) { lastTargetTrigger.focus(); lastTargetTrigger = null; }
}

document.querySelectorAll(".target-card[data-target]").forEach(card => {
  const open = () => { lastTargetTrigger = card; showTargetDetails(card.dataset.target); };
  card.addEventListener("click", open);
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
  });
});

closeTargetModal?.addEventListener("click", hideTargetDetails);
targetModal?.addEventListener("click", event => { if (event.target === targetModal) hideTargetDetails(); });

/* =========================================
   LIVE CLOCK
========================================= */

const localTimeEl = document.getElementById("localTime");

function tickClock() {
  if (localTimeEl) localTimeEl.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
tickClock();
setInterval(tickClock, 1000);

/* =========================================
   LIGHT-DISTANCE COUNTER
========================================= */

const LIGHT_SPEED_KM_S = 299792.458;
const pageLoadTime = performance.now();
const lightDistanceEl = document.getElementById("lightDistance");

function tickLightCounter() {
  if (!lightDistanceEl) return;
  const elapsedSeconds = (performance.now() - pageLoadTime) / 1000;
  const km = Math.round(elapsedSeconds * LIGHT_SPEED_KM_S);
  lightDistanceEl.textContent = km.toLocaleString();
}
setInterval(tickLightCounter, 200);

/* =========================================
   MOON PHASE
========================================= */

const SYNODIC_MONTH = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

function moonPhaseFraction(date) {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  let phase = (days % SYNODIC_MONTH) / SYNODIC_MONTH;
  if (phase < 0) phase += 1;
  return phase;
}

function phaseName(phase) {
  if (phase < 0.02 || phase > 0.98) return "New Moon";
  if (phase < 0.24) return "Waxing Crescent";
  if (phase < 0.26) return "First Quarter";
  if (phase < 0.49) return "Waxing Gibbous";
  if (phase < 0.51) return "Full Moon";
  if (phase < 0.74) return "Waning Gibbous";
  if (phase < 0.76) return "Last Quarter";
  return "Waning Crescent";
}

function nextFullMoonDate(from) {
  const phase = moonPhaseFraction(from);
  let daysUntilFull = (((0.5 - phase) + 1) % 1) * SYNODIC_MONTH;
  if (daysUntilFull < 0.5) daysUntilFull += SYNODIC_MONTH;
  return new Date(from.getTime() + daysUntilFull * 86400000);
}

function renderMoon() {
  const now = new Date();
  const phase = moonPhaseFraction(now);
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const name = phaseName(phase);
  const percent = Math.round(illumination * 100);

  const moonHeadline = document.getElementById("moonHeadline");
  if (moonHeadline) moonHeadline.textContent = name;

  const moonPercent = document.getElementById("moonPercent");
  if (moonPercent) moonPercent.textContent = `${percent}%`;

  const moonHud = document.getElementById("moonHud");
  if (moonHud) moonHud.textContent = `${name} · ${percent}%`;

  const nextFull = document.getElementById("nextFull");
  if (nextFull) nextFull.textContent = nextFullMoonDate(now).toLocaleDateString([], { month: "short", day: "numeric" });
}
renderMoon();
setInterval(renderMoon, 60000);

/* =========================================
   COSMIC FACTS
========================================= */

const cosmicFacts = [
  "Light from the Sun takes about eight minutes to reach Earth.",
  "A day on Venus is longer than its year.",
  "Jupiter is the fastest-spinning planet in the Solar System.",
  "Neutron stars can rotate hundreds of times every second.",
  "The footprints on the Moon can last for millions of years — there's no wind to erase them.",
  "Saturn is less dense than water; it would float in a bath large enough to hold it.",
  "One million Earths could fit inside the Sun."
];

const cosmicFactEl = document.getElementById("cosmicFact");
document.getElementById("newFact")?.addEventListener("click", () => {
  const current = cosmicFactEl.textContent;
  const choices = cosmicFacts.filter(fact => fact !== current);
  cosmicFactEl.textContent = choices[Math.floor(Math.random() * choices.length)];
});

/* =========================================
   METEOR SHOWER
========================================= */

const meteorLayer = document.getElementById("meteorLayer");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function spawnMeteor() {
  if (!meteorLayer || prefersReducedMotion) return;

  const meteor = document.createElement("div");
  meteor.className = "meteor";
  meteor.style.top = `${Math.random() * 60}%`;
  meteor.style.left = `${Math.random() * 70}%`;

  const duration = 1.1 + Math.random() * 0.9;
  meteor.style.animationDuration = `${duration}s`;

  meteorLayer.appendChild(meteor);
  requestAnimationFrame(() => meteor.classList.add("run"));

  setTimeout(() => meteor.remove(), duration * 1000 + 200);
}

function scheduleMeteor() {
  const delay = 3500 + Math.random() * 6000;
  setTimeout(() => { spawnMeteor(); scheduleMeteor(); }, delay);
}
if (!prefersReducedMotion) scheduleMeteor();

/* =========================================
   CONSTELLATION REVEAL
========================================= */

const orionLines = document.getElementById("orionLines");
if (orionLines) {
  orionLines.querySelectorAll("line").forEach(line => {
    const length = Math.hypot(line.x2.baseVal.value - line.x1.baseVal.value, line.y2.baseVal.value - line.y1.baseVal.value);
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
  });

  const constellationObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      orionLines.querySelectorAll("line").forEach((line, index) => {
        line.style.transition = `stroke-dashoffset 1s ease ${index * 0.12}s`;
        line.style.strokeDashoffset = 0;
      });
      constellationObserver.disconnect();
    });
  }, { threshold: 0.4 });

  constellationObserver.observe(orionLines);
}

/* =========================================
   LOCATION-BASED DATA
========================================= */

function formatCoordinate(value, positive, negative) {
  return `${Math.abs(value).toFixed(2)}° ${value >= 0 ? positive : negative}`;
}

function distanceBetween(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371;
  const radians = value => (value * Math.PI) / 180;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatLocalTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

let observerLocation = null;
const enableLocationButton = document.getElementById("enableLocation");

function setLocationButtonState(label, disabled = false) {
  if (!enableLocationButton) return;
  enableLocationButton.textContent = label;
  enableLocationButton.disabled = disabled;
}

function handleObserverLocation(position) {
  observerLocation = position.coords;
  setLocationButtonState("Live location enabled");
  loadTwilight(position.coords.latitude, position.coords.longitude);
  loadWeather(position.coords.latitude, position.coords.longitude);
  updateISSPosition();
}

function handleLocationError(error) {
  const message = error.code === 1 ? "Location access blocked — allow it in site settings" : "Location unavailable — try again";
  setLocationButtonState(message);
}

function requestObserverLocation() {
  if (!navigator.geolocation) {
    setLocationButtonState("Location is not supported");
    return;
  }

  setLocationButtonState("Requesting location…", true);
  navigator.geolocation.getCurrentPosition(handleObserverLocation, handleLocationError, {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 300000
  });
}

enableLocationButton?.addEventListener("click", requestObserverLocation);

async function loadTwilight(lat, lon) {
  const twilightRow = document.getElementById("twilightRow");
  try {
    const todayRes = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`);
    if (!todayRes.ok) throw new Error("Twilight service unavailable");
    const today = (await todayRes.json()).results;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    const tomorrowRes = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0&date=${tomorrowStr}`);
    const tomorrowData = tomorrowRes.ok ? (await tomorrowRes.json()).results : null;

    document.getElementById("tSunset").textContent = formatLocalTime(today.sunset);
    document.getElementById("tCivil").textContent = formatLocalTime(today.civil_twilight_end);
    document.getElementById("tNautical").textContent = formatLocalTime(today.nautical_twilight_end);
    document.getElementById("tAstro").textContent = formatLocalTime(today.astronomical_twilight_end);

    const darkWindow = document.getElementById("darkWindow");
    const darkStart = formatLocalTime(today.astronomical_twilight_end);
    if (darkWindow) {
      darkWindow.textContent = tomorrowData
        ? `${darkStart} — ${formatLocalTime(tomorrowData.astronomical_twilight_begin)}`
        : `Begins ${darkStart}`;
    }
    if (twilightRow) twilightRow.hidden = false;
  } catch (error) {
    const darkWindow = document.getElementById("darkWindow");
    if (darkWindow) darkWindow.textContent = "Twilight data unavailable";
  }
}

async function loadWeather(lat, lon) {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,cloud_cover&timezone=auto`);
    if (!response.ok) throw new Error("Weather service unavailable");
    const current = (await response.json()).current;
    const clouds = Math.round(current.cloud_cover);

    document.getElementById("wClouds").textContent = `${clouds}%`;
    document.getElementById("wWind").textContent = `${Math.round(current.wind_speed_10m)} km/h`;

    const seeingHeadline = document.getElementById("seeingHeadline");
    const seeingNote = document.getElementById("seeingNote");
    if (seeingHeadline) {
      seeingHeadline.textContent = clouds < 20 ? "Clear — good night to observe" : clouds < 60 ? "Partly clear — worth a look" : "Mostly clouded over";
    }
    if (seeingNote) seeingNote.textContent = `Roughly ${clouds}% cloud cover at your coordinates right now.`;
  } catch (error) {
    const seeingHeadline = document.getElementById("seeingHeadline");
    if (seeingHeadline) seeingHeadline.textContent = "Conditions unavailable";
  }
}

async function updateISSPosition() {
  const endpoints = [
    { url: "https://api.wheretheiss.at/v1/satellites/25544", read: data => [data.latitude, data.longitude] },
    { url: "https://api.open-notify.org/iss-now.json", read: data => [data.iss_position?.latitude, data.iss_position?.longitude] }
  ];

  try {
    let coordinates;
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        if (!response.ok) throw new Error("ISS service unavailable");
        const data = await response.json();
        const [lat, lon] = endpoint.read(data).map(Number);
        if (Number.isFinite(lat) && Number.isFinite(lon)) { coordinates = { lat, lon }; break; }
      } catch (error) { /* try next endpoint */ }
    }
    if (!coordinates) throw new Error("All ISS services unavailable");

    document.getElementById("issLat").textContent = formatCoordinate(coordinates.lat, "N", "S");
    document.getElementById("issLon").textContent = formatCoordinate(coordinates.lon, "E", "W");
    document.getElementById("issUpdated").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    document.getElementById("issLocation").textContent = `${coordinates.lat.toFixed(2)}°, ${coordinates.lon.toFixed(2)}°`;

    if (observerLocation) {
      const distance = distanceBetween(observerLocation.latitude, observerLocation.longitude, coordinates.lat, coordinates.lon);
      document.getElementById("issDistance").textContent = `Approximately ${Math.round(distance).toLocaleString()} km from your location right now.`;
    }
  } catch (error) {
    const issLocation = document.getElementById("issLocation");
    if (issLocation) issLocation.textContent = "Signal unavailable";
  }
}

requestObserverLocation();

updateISSPosition();
setInterval(updateISSPosition, 15000);

/* =========================================
   NASA ASTRONOMY PICTURE OF THE DAY
========================================= */

// Uses NASA's shared public demo key — swap in your own free key from
// https://api.nasa.gov if you outgrow the demo rate limit.
const NASA_API_KEY = "DEMO_KEY";

async function loadAPOD() {
  const title = document.getElementById("apodTitle");
  const image = document.getElementById("apodImage");
  const description = document.getElementById("apodDescription");
  const link = document.getElementById("apodLink");
  if (!title || !image || !description || !link) return;

  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(NASA_API_KEY)}`);
    if (!response.ok) throw new Error("NASA service unavailable");
    const data = await response.json();

    title.textContent = data.title || "Astronomy Picture of the Day";
    description.textContent = data.explanation || "NASA's daily view of the universe.";
    link.href = data.url || "https://apod.nasa.gov/apod/astropix.html";
    link.hidden = false;

    if (data.media_type === "image" && data.url) {
      image.src = data.url;
      image.alt = data.title || "NASA Astronomy Picture of the Day";
      image.hidden = false;
    }
  } catch (error) {
    title.textContent = "Image unavailable right now";
    description.textContent = "NASA's feed couldn't be reached. Everything else on this page runs independently.";
  }
}
loadAPOD();

/* =========================================
   FOOTER YEAR + INIT
========================================= */

const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = `© ${new Date().getFullYear()} COSMOS`;

updateActiveNav();
