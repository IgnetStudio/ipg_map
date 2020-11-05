// code goes here

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
  }; // returns Boolean; "true" if marker match to vehicleCallsign
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
};

const infoWindowContent = (info) => {
  // date format settings
  const date = new Date(info.vehicleSignal * 1000);
  let hours = date.getHours();
  hours = hours < 10 ? "0" + hours : hours;
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let seconds = date.getSeconds();
  seconds = seconds < 10 ? "0" + seconds : seconds;
  const vehicleResponse = `${hours}:${minutes}:${seconds}`;
  // Google Maps info window content
  return (
    '<div id="content" class="info-window-wrapper">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h1 id="firstHeading" class="info-window-title">${info.vehicleCallsign}</h1>` +
    '<div id="bodyContent" class="info-window-content">' +
    `<h2>Vehicle data</h2>` +
    `<p>Status: <strong>${
      info.vehicleStatus ? "grounded" : "active"
    }</strong></p>` +
    `<p>Last update: ${vehicleResponse}</p>` +
    `<p>Flight from ${info.vehicleCountry}</p>` +
    `<p>Direction: ${info.vehicleDirection}°</p>` +
    `<p>Velocity: ${info.vehicleVelocity} m/s</p>` +
    `<p>Latitude: ${info.vehicleLatitude}</p>` +
    `<p>Longitude: ${info.vehicleLongitude}</p>` +
    "</div>" +
    "</div>"
  );
};

const createMarker = (map, info) => {
  const mapPosition = { lat: info.vehicleLatitude, lng: info.vehicleLongitude };
  const contentString = infoWindowContent(info);
  const plane = "img/plane.svg";

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
    mapTypeControl: false,
    zoomControl: true,
    scaleControl: true,
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
    li.appendChild(a);
    fragment.appendChild(li);
    // set asset list content
    a.innerHTML = `<span>${el.vehicleCallsign}</span>`;
  });
  list.appendChild(fragment);
};

// toggle navigation & summary with checkbox

const assetSidebar = document.querySelector(".asset-sidebar");
const assetCheckbox = document.getElementById("asset-checkbox");
assetCheckbox.addEventListener("change", function () {
  assetSidebar.classList.toggle("hide-element");
});

// toggle dark mode

const body = document.querySelector("body");
const toggleBtn = document.querySelector(".contrast-toggle");

toggleBtn.addEventListener("click", function () {
  body.classList.toggle("dark-mode");
});

// WebSocket initialize

const socket = io();
let flightList = []; // this is the source of the assets list panel, to be displayed as an layer on the map

socket.on("flight", function (data) {
  createList(data);
  data.forEach((el) => {
    handleMarker(map, el); // create or update marker
  });
});
