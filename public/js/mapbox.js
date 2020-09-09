/* eslint-disable */

//DOM elements
const mapBox = document.getElementById('map');

//DELEGATION
let locations;
if (mapBox) {
  locations = JSON.parse(mapBox.dataset.locations);
  // displayMap(locations);
  console.log(locations);

  // export const displayMap = locations => {

  mapboxgl.accessToken = 'pk.eyJ1IjoibHhuZGEiLCJhIjoiY2tldDh0Zzl1MWN2OTJwdDg5cnhhcTN2OCJ9.pe7wjLc6ZXMDT4rWHTgYCg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lxnda/cketbj3us611g19qh8sn7370h',
    scrollZoom: false
    // center: [174.7214229,-36.9150067],
    // zoom: 15
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
  // }
}