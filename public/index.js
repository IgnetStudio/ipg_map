// code goes here

let map;
let markers = [];
let infoWindows = [];

const onFlightClick = (callsign) => {
  infoWindows.forEach((el) => el.close());
  const markerIndex = getArrayIndex(callsign, markers);
  const infoWindowIndex = getArrayIndex(callsign, infoWindows);
  infoWindows[infoWindowIndex].open(map, markers[markerIndex]);
};

const getArrayIndex = (callsign, arrayToSearch) => {
  const testMarker = (marker) => {
    const doMatch = marker.title === callsign;
    return doMatch;
  }; // returns Boolean; "true" if marker match to callsign
  const obj = arrayToSearch.find(testMarker);
  const index = arrayToSearch.indexOf(obj);
  return index;
};

const handleMarker = (map, info) => {
  const markerIndex = getArrayIndex(info.callsign, markers);
  if (markerIndex === -1) {
    // console.log(`marker ${info.callsign} don't exist in marker array`);
    const marker = createMarker(map, info);
    markers.push(marker);
  } else {
    // console.log(`marker ${info.callsign} exists in marker array`);
    const mapPosition = { lat: info.latitude, lng: info.longitude };
    markers[markerIndex].setPosition(mapPosition);
    const infoWindowIndex = getArrayIndex(info.callsign, infoWindows);
    infoWindows[infoWindowIndex].setContent(infoWindowContent(info));
  }
};

const infoWindowContent = (info) => {
  return (
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h1 id="firstHeading" class="firstHeading">${info.callsign}</h1>` +
    '<div id="bodyContent">' +
    `<p>latitude: ${info.latitude}</p>` +
    `<p>longitude: ${info.longitude}</p>` +
    `<p>velocity: ${info.velocity}</p>` +
    "</div>" +
    "</div>"
  );
};

const createMarker = (map, info) => {
  const mapPosition = { lat: info.latitude, lng: info.longitude };
  const contentString = infoWindowContent(info);

  const infoWindow = new google.maps.InfoWindow({
    content: contentString,
  });

  const marker = new google.maps.Marker({
    position: mapPosition,
    map,
    title: info.callsign,
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  infoWindow.title = info.callsign;
  infoWindows.push(infoWindow);
  return marker;
};

function initMap() {
  const mapPosition = { lat: 46.056946, lng: 14.505751 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: mapPosition,
  });
}

// WebSocket initialize & asset list render

const socket = io();
const list = document.querySelector(".asset-list");
const createList = (data) => {
  list.innerHTML = "";
  const fragment = document.createDocumentFragment();
  data.forEach((el) => {
    const li = document.createElement("li");
    li.innerHTML = `<a onclick="onFlightClick('${el.callsign}')"><b>${el.callsign}</b> ${el.longitude} ${el.latitude}</a>`;
    fragment.appendChild(li);
  });
  list.appendChild(fragment);
};

let flightList = []; // this is the source of the assets list panel, to be displayed as an layer on the map

socket.on("flight", function (data) {
  createList(data);
  data.forEach((el) => {
    handleMarker(map, el); // create or update marker
  });
});
