mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [121.0437, 14.6760], // Biñan, Laguna
  zoom: 11
});

// Controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: "Search exact location, address, or coordinates"
  })
);

// Base map switcher
map.on("load", () => {
  map.addSource("infrastructure", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-streets-v8"
  });

  map.addLayer({
    id: "roads",
    type: "line",
    source: "infrastructure",
    "source-layer": "road",
    paint: {
      "line-color": "#facc15",
      "line-width": 1.5
    }
  });
});

// Click interaction
map.on("click", async (e) => {
  const lat = e.lngLat.lat;
  const lng = e.lngLat.lng;
  const panel = document.getElementById("details");

  panel.innerHTML = `<p>Analyzing location...</p>`;

  // Weather
  const weatherKey = "YOUR_OPENWEATHER_API_KEY";
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${weatherKey}`;

  try {
    const res = await fetch(weatherURL);
    const weather = await res.json();

    // Simulated vulnerability assessment
    const floodRisk = Math.random() > 0.6 ? "High" : "Medium";
    const motionStatus = Math.random() > 0.5 ? "In Motion" : "At Rest";

    panel.innerHTML = `
      <strong>Coordinates</strong>
      <p>${lat.toFixed(5)}, ${lng.toFixed(5)}</p>

      <strong>Live Weather</strong>
      <p>${weather.weather[0].description}, ${weather.main.temp} °C</p>

      <strong>Motion Status</strong>
      <p>${motionStatus}</p>

      <strong>Disaster Vulnerability</strong>
      <p class="${floodRisk === "High" ? "alert-high" : "alert-medium"}">
        Flood Risk: ${floodRisk}
      </p>

      <strong>Infrastructure Notes</strong>
      <ul>
        <li>Road network accessible</li>
        <li>Suitable for monitoring & evacuation planning</li>
        <li>Potential camera / IoT deployment zone</li>
      </ul>
    `;
  } catch {
    panel.innerHTML = `<p>Data unavailable.</p>`;
  }
});
