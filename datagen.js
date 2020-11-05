const axios = require("axios").default;

// bounding box settings to draw space between Ljubljana & Warszawa
const boxBottom = "46.0499"; // LJ latitide
const boxLeft = "14.5068"; // LJ longitude
const boxTop = "52.2337"; // WWA latitide
const boxRight = "21.0714"; // WWA longitude

const getData = (io) => {
  setInterval(async () => {
    const response = await axios({
      url: `https://opensky-network.org/api/states/all?lamin=${boxBottom}&lomin=${boxLeft}&lamax=${boxTop}&lomax=${boxRight}`,
      method: "get",
    });

    const flightData = parseData(response.data.states);

    io.emit("flight", flightData);
  }, 65000); // this value can be amended to refresh data, due to API limitations - example safe value is 65000
};

// responses (property & index) passed from https://opensky-network.org/apidoc/rest.html

const parseData = (data) => {
  return data.map((el) => {
    return {
      vehicleCallsign: el[1] || "no cs", // string (8 chars, can be null if no callsign has been received)
      vehicleCountry: el[2], // string (ICAO 24-bit address)
      vehicleSignal: el[3] || "signal: unknown", // int (Unix timestamp, seconds, for the last position update, can be null if position not responed within the past 15s)
      vehicleLongitude: el[5] || "longitude: unknown", // float (WGS-84 longitude in decimal degrees, can be null)
      vehicleLatitude: el[6] || "latitude: unknown", // as above, but for latitude
      vehicleStatus: el[8], // boolean (value which indicates if plane has landed)
      vehicleVelocity: el[9] || "velocity: unknown", // float (vehicleVelocity over ground in m/s, can be null)
      vehicleDirection: el[10] || "direction: unknown", // float (true track in decimal degrees, can be null)
    };
    // }
  });
};

module.exports = getData;
