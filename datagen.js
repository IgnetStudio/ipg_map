const axios = require("axios").default;

const getData = (io) => {
  setInterval(async () => {
    const response = await axios({
      // get bounding box covering Slovenija & neighbourhood
      url:
        "https://opensky-network.org/api/states/all?lamin=45.4782&lomin=13.5868&lamax=46.8614&lomax=16.2991",
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
      vehicleCallsign: el[1], // string (8 chars, can be null if no callsign has been received)
      vehicleCountry: el[2], // string (ICAO 24-bit address)
      vehicleSignal: el[3], // int (Unix timestamp, seconds, for the last position update, can be null if position not responed within the past 15s)
      vehicleLongitude: el[5], // float (WGS-84 longitude in decimal degrees, can be null)
      vehicleLatitude: el[6], // as above, but for latitude
      vehicleStatus: el[8], // boolean (value which indicates if plane has landed)
      vehicleVelocity: el[9], // float (vehicleVelocity over ground in m/s, can be null)
    };
  });
};

module.exports = getData;
