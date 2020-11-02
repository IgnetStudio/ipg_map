// code goes here

let map;
let markers = [];

// (returns: Array) filter markers array to get markers with title key matched to callsign

const getMarker = (callsign) => {
  const testMarker = (marker) => {
    const doMatch = marker.title === callsign;
    return doMatch;
  }; // returns Boolean; "true" if marker match to callsign

  const filtredArray = markers.filter(validator); // returns Array (0 / 1 markers)
  return filtredArray;
};

const handleMarker = (map, info) => {
  const existingMarker = getMarker(info.callsign);
  if (existingMarker.length == 0) {
    // console.log(`marker ${info.callsign} don't exist in marker array`);
    const marker = createMarker(map, info);
    markers.push(marker);
  } else {
    // console.log(`marker ${info.callsign} exists in marker array`);
    existingMarker[0] = createMarker(map, info);
  }
};

const createMarker = (map, info) => {
  const lj = { lat: info.latitude, lng: info.longitude };
  const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h1 id="firstHeading" class="firstHeading">${info.callsign}</h1>` +
    '<div id="bodyContent">' +
    `<p>latitude: ${info.latitude}</p>` +
    `<p>longitude: ${info.longitude}</p>` +
    `<p>velocity: ${info.velocity}</p>` +
    "</div>" +
    "</div>";

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });

  const marker = new google.maps.Marker({
    position: lj,
    map,
    title: info.callsign,
  });

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });

  console.log(marker);
  return marker;
};

function initMap() {
  const lj = { lat: 46.056946, lng: 14.505751 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: lj,
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
    li.innerHTML = `<b>${el.callsign}</b> ${el.longitude} ${el.latitude}`;
    fragment.appendChild(li);
    handleMarker(map, el);
  });
  list.appendChild(fragment);
};

let flightList = []; // this is the source of the assets list panel, to be displayed as an layer on the map

socket.on("flight", function (data) {
  createList(data);
  // update flights list placeholder
  // update markers on map placeholder
});
