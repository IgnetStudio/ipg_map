const axios = require("axios").default;

const getData = (io) => {
  setInterval(async () => {
    const response = await axios({
      url:
        "https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226",
      method: "get",
    });
    io.emit("flight", response.data.states);
    console.log(response.data.states[0][0]);
  }, 2000);
};

module.exports = getData;
