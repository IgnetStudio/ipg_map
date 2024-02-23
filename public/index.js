let map;
let markers = [];
let infoWindows = [];

const onFlightClick = (vehicleCallsign) => {
  infoWindows.forEach((el) => el.close());
  const markerIndex = getArrayIndex(vehicleCallsign, markers);
  const infoWindowIndex = getArrayIndex(vehicleCallsign, infoWindows);
  infoWindows[infoWindowIndex].open(map, markers[markerIndex]);
};

const getArrayIndex = (vehicleCallsign, arrayToSearch) => {
  const testMarker = (marker) => {
    const doMatch = marker.title === vehicleCallsign;
    return doMatch;
  }; // returns Boolean; "true" if marker match to callsign
  const obj = arrayToSearch.find(testMarker);
  const index = arrayToSearch.indexOf(obj);
  return index;
};

const handleMarker = (map, info) => {
  const markerIndex = getArrayIndex(info.vehicleCallsign, markers);
  if (markerIndex === -1) {
    // console.log(`marker ${info.vehicleCallsign} don't exist in marker array`);
    const marker = createMarker(map, info);
    markers.push(marker);
  } else {
    // console.log(`marker ${info.vehicleCallsign} exists in marker array`);
    const mapPosition = {
      lat: info.vehicleLatitude,
      lng: info.vehicleLongitude,
    };
    markers[markerIndex].setPosition(mapPosition);
    const infoWindowIndex = getArrayIndex(info.vehicleCallsign, infoWindows);
    infoWindows[infoWindowIndex].setContent(infoWindowContent(info));
  }
  // Add a marker clusterer to manage the markers
  // const markerCluster = new MarkerClusterer(map, markers, {
  //   imagePath:
  //     "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  // });
};

const infoWindowContent = (info) => {
  // time & units settings
  const date = new Date(info.vehicleSignal * 1000);
  let hours = date.getHours();
  hours = hours < 10 ? "0" + hours : hours;
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let seconds = date.getSeconds();
  seconds = seconds < 10 ? "0" + seconds : seconds;
  const vehicleResponse = `${hours}:${minutes}:${seconds}`;
  const formatDirection = info.vehicleDirection.toString().split(".")[0];
  const formatVelocity = info.vehicleVelocity.toString().split(".")[0];
  // info window content
  return (
    '<div id="content" class="info-window-wrapper">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h1 id="firstHeading" class="info-window-title">${info.vehicleCallsign}</h1>` +
    '<div id="bodyContent" class="info-window-content">' +
    `<h2>Vehicle data</h2>` +
    `<p>Status: <strong>${info.vehicleStatus ? "grounded" : "active"
    }</strong></p>` +
    `<p>Last update: ${vehicleResponse}</p>` +
    `<p>Flight from ${info.vehicleCountry}</p>` +
    `<p>Direction: ${formatDirection}°</p>` +
    `<p>Velocity: ${formatVelocity} m/s</p>` +
    `<p>Latitude: ${info.vehicleLatitude}</p>` +
    `<p>Longitude: ${info.vehicleLongitude}</p>` +
    "</div>" +
    "</div>"
  );
};

const createMarker = (map, info) => {
  const mapPosition = { lat: info.vehicleLatitude, lng: info.vehicleLongitude };
  const contentString = infoWindowContent(info);
  const vehicleAngle = info.vehicleDirection - 90;
  const plane = {
    path:
      "M34.531,16.322H25.81l-2.193-3.655H26c0.368,0,0.667-0.299,0.667-0.667S26.368,11.333,26,11.333h-3.184l-4.954-8.255    c-0.282-0.47-0.778-0.751-1.326-0.751h-1.965c-0.338,0-0.642,0.144-0.856,0.405c-0.214,0.262-0.295,0.589-0.229,0.918    l2.535,12.671H8.557l-2.734-3.416c-0.298-0.376-0.728-0.583-1.209-0.583H3.621c-0.352,0-0.674,0.161-0.881,0.438    c-0.213,0.279-0.279,0.634-0.183,0.973l1.644,5.753l-1.644,5.752c-0.097,0.337-0.031,0.692,0.181,0.972    c0.211,0.279,0.533,0.439,0.883,0.439h0.993c0.48,0,0.91-0.206,1.208-0.58l2.735-3.418h7.464l-2.534,12.669    c-0.067,0.333,0.015,0.66,0.226,0.916c0.214,0.263,0.519,0.408,0.858,0.408h1.965c0.549,0,1.044-0.281,1.326-0.75l4.938-8.229    h3.143c0.368,0,0.667-0.299,0.667-0.667s-0.298-0.667-0.667-0.667h-2.343l2.208-3.68h8.721c1.745,0,3.166-1.42,3.166-3.167    C37.696,17.741,36.276,16.322,34.531,16.322z M34.531,21.32h-9.476l-8.336,13.89c-0.042,0.071-0.099,0.103-0.183,0.103h-1.688    l2.799-13.993H7.917L4.78,25.239c-0.045,0.057-0.092,0.079-0.166,0.079H3.922l1.666-5.831l-1.666-5.831h0.692    c0.075,0,0.12,0.021,0.167,0.08l3.136,3.918h9.731L14.849,3.661h1.688c0.083,0,0.14,0.032,0.183,0.104l8.336,13.891h9.476    c1.01,0,1.832,0.822,1.832,1.833S35.541,21.32,34.531,21.32z",
    fillColor: "#5f4b8b",
    fillOpacity: 0.95,
    anchor: new google.maps.Point(0, 0),
    strokeWeight: 0,
    scale: 0.95,
    rotation: vehicleAngle,
  };

  const infoWindow = new google.maps.InfoWindow({
    content: contentString,
  });

  const marker = new google.maps.Marker({
    position: mapPosition,
    icon: plane,
    map,
    title: info.vehicleCallsign,
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  infoWindow.title = info.vehicleCallsign;
  infoWindows.push(infoWindow);
  return marker;
};

function initMap() {
  const mapPosition = { lat: 49.188156, lng: 17.583896 }; // Ljubljana & Warszawa middle point
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: mapPosition,
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: true,
    scaleControl: true,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
  });
}

// asset list render
const list = document.querySelector(".asset-list");
const createList = (data) => {
  list.innerHTML = "";
  const fragment = document.createDocumentFragment();
  data.forEach((el) => {
    // prepare asset list link
    const a = document.createElement("a");
    a.classList.add("asset-button");
    a.setAttribute("role", "button");
    a.addEventListener("click", () => {
      onFlightClick(el.vehicleCallsign);
    });
    // prepare asset list item
    const li = document.createElement("li");
    li.classList.add("asset-item");
    li.setAttribute("tabindex", "0");
    li.appendChild(a);
    fragment.appendChild(li);
    // set asset list content
    a.innerHTML = '<span>' + el.vehicleCallsign + '</span>';
  });
  list.appendChild(fragment);
};

// toggle navigation & summary with checkbox

const assetWrapper = document.querySelector(".asset-wrapper");
const assetSidebar = document.querySelector(".asset-sidebar");
const assetCheckbox = document.getElementById("asset-checkbox");
assetCheckbox.addEventListener("change", function () {
  assetWrapper.classList.toggle("asset-mobile");
  assetSidebar.classList.toggle("hide-element");
});

// toggle dark mode

const body = document.querySelector("body");
const contrastToggle = document.querySelector(".contrast-toggle");

contrastToggle.addEventListener("click", function () {
  body.classList.toggle("dark-mode");
});

// WebSocket initialize

const socket = io();

socket.on("flight", function (data) {
  createList(data);
  data.forEach((el) => {
    handleMarker(map, el); // create or update marker
  });
  const error = document.querySelector('.error');
  error.innerHTML = '';
});

socket.on("delay", function (data) {
  const error = document.querySelector('.error');
  error.innerHTML = `<span style="color:red;">Next update in ${data.delay} seconds.</span>`;
});