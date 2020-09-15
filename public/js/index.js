/* eslint-disable */

//MAPBOX SECTION

//DOM elements
const mapBox = document.getElementById('map');

let locations;
if (mapBox) {
  locations = JSON.parse(mapBox.dataset.locations);
  // displayMap(locations);

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
}

//LOGIN SECTION
const loginForm = document.querySelector('.form--login');

const login = async (email, password) => {
  // export const login = async (email, password) => {

  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');

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
      url: '/api/v1/users/logout'
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log('error from logout of index.js ===> ', err);
    showAlert('error', 'Error logging out, try again!')
  }
};

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

//SAVE SETTINGS SECTION
const userDataForm = document.querySelector('.form-user-data');
const userSettingsForm = document.querySelector('.form-user-settings');

//type is either 'password' or 'data'
const updateUserData = async (data, type) => {
  // export const login = async (email, password) => {
  try {
    const url = type === 'password'
      ? `/api/v1/users/updatePassword`
      : `/api/v1/users/updateMe`;

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);

      location.reload(true);
    }

  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    // BEFORE ADDING SENDING PHOTO (OR ANY FILE)
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    // updateUserData({name, email}, 'data');

    // AFTER ADDING SENDING PHOTO 
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateUserData(form, 'data');
  });
}

if (userSettingsForm) {
  userSettingsForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateUserData({ passwordCurrent, password, passwordConfirm }, 'password');

    document.querySelector('.btn--save-password').textContent = 'Save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
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

// PAYMENT SECTION
const stripe = Stripe('pk_test_51HR5N6DzgybG5RjQ2306mDQTCG60SFwiWogwlM8efdl20KIVamLQw0koFePZnhed05zpUgam2xJ2EBC3vAP3dt7z00ihpWlRL2');

const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API endpoint
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // 2) Create checkout form  + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });

  } catch (err) {
    console.log('error from bookTour of index.js ===> ', err);
    showAlert('error', err);
  }
};

const bookBtn = document.getElementById('book-tour');

if(bookBtn) {
  bookBtn.addEventListener('click', async e => {
    e.target.textContent = 'Processing...';

    const { tourId } = e.target.dataset;
    bookTour(tourId);

    e.target.textContent = 'Book tour now!';
  });
}