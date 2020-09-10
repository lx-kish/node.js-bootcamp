/* eslint-disable */

//DOM elements
const mapBox = document.getElementById('map');

//MAPBOX SECTION
let locations;
if (mapBox) {
  locations = JSON.parse(mapBox.dataset.locations);
  // displayMap(locations);
  console.log(locations);

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

//LOGIN SECTION
const loginForm = document.querySelector('.form');

const login = async (email, password) => {
  // export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:5050/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      console.log(res);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }

  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//DELEGATION
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

//LOGOUT SECTION
const logOutBtn = document.querySelector('.nav__el--logout');

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:5050/api/v1/users/logout'
    });
    console.log('from logout btn ===> ')

    if(res.data.status === 'success') location.reload(true);
  } catch(err) {
    console.log(err);
    showAlert('error', 'Error logging out, try again!')
  }
};

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

//ALERT SECTION
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};