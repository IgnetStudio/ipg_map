const axios = require("axios").default;

const getData = (io) => {
  setInterval(async () => {
    const response = await axios({
      // get bounding box covering Slovenija
      url:
        "https://opensky-network.org/api/states/all?lamin=45.4782&lomin=13.5868&lamax=46.8614&lomax=16.2991",
      method: "get",
    });

    const flightData = parseData(response.data.states);

    io.emit("flight", flightData);
  }, 4000);
};

const parseData = (data) => {
  return data.map((el) => {
    return {
      callsign: el[1],
      longitude: el[5],
      latitude: el[6],
      velocity: el[9],
    };
  });
};

module.exports = getData;
