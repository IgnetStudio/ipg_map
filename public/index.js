// This example displays a marker at Ljubljana, Slovenija.
// When the user clicks the marker, an info window opens.
function initMap() {
  const lj = { lat: 46.056946, lng: 14.505751 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: lj,
  });
  const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">Ljubljana</h1>' +
    '<div id="bodyContent">' +
    "<p><b>Slovenija</b>" +
    "</div>" +
    "</div>";
  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });
  const marker = new google.maps.Marker({
    position: lj,
    map,
    title: "Ljubljana, Slovenija",
  });
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
}

// WebSocket initialize
const socket = io();

let flightList = []; // this is the source of the assets list panel, to be displayed as an layer on the map

socket.on("flight", function (msg) {
  console.log(msg);
  flightList = msg;
  // update flights list placeholder
  // update markers on map placeholder
});
