mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://style/mapbox/streets-v12", //style url
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

// Create marker wrapper
const markerWrapper = document.createElement("div");
markerWrapper.className = "marker-wrapper";

// Create pulsing circle element
const pulseCircle = document.createElement("div");
pulseCircle.className = "pulse-circle";

// Create Font Awesome house icon element
const faIcon = document.createElement("i");
faIcon.className = "fa-solid fa-house fa-marker";

// Append pulse and icon to wrapper
markerWrapper.appendChild(pulseCircle);
markerWrapper.appendChild(faIcon);

// Add marker with popup
const marker = new mapboxgl.Marker({ element: markerWrapper })
  .setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${listing.title}</h5><p>Exact Location provided after booking.</p>`
    )
  )
  .addTo(map);
