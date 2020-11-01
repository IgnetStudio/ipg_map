const axios = require("axios").default;

const getData = (io) => {
  setInterval(async () => {
    const response = await axios({
      url:
        "https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226",
      method: "get",
    });

    const flightData = parseData(response.data.states);

    io.emit("flight", flightData);
    // console.log(); // velocity
  }, 15000);
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
