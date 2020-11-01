const axios = require("axios").default;

const getData = async (io) => {
  const response = await axios({
    url:
      "http://api.aviationstack.com/v1/flights?access_key=01137c29af69dbeda0fd1e1a57c07aff&limit=3&flight_status=active",
    method: "get",
  });

  // console.log(response.data.data[1]);

  setInterval(function () {
    io.emit("flight", response.data.data[1]);
  }, 1000);
};

module.exports = getData;
