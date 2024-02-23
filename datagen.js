const axios = require("axios").default;

// bounding box settings to draw space between Ljubljana & Warszawa
const boxBottom = "46.0499"; // LJ latitide
const boxLeft = "14.5068"; // LJ longitude
const boxTop = "52.2337"; // WWA latitide
const boxRight = "21.0714"; // WWA longitude

const init = {
  DELAY: 30,
};

const state = {
  delay: init.DELAY,
  timeoutId: 0,
  connectionCount: 0,
};

async function refresh(io) {
  console.log(`refresh started`);
  try {
    const response = await axios({
      url: `https://opensky-network.org/api/states/all?lamin=${boxBottom}&lomin=${boxLeft}&lamax=${boxTop}&lomax=${boxRight}`,
      method: "get",
    });
    console.log(`response received`);
    const flightData = parseData(response.data.states);
    state.delay = init.DELAY;
    state.timeoutId = setTimeout(async () => await refresh(io), state.delay * 1000);
    io.emit("delay", { delay: state.delay });
    io.emit("flight", flightData);
  } catch (e) {
    console.log(`response error`);
    const retryDelay = e?.response?.headers["x-rate-limit-retry-after-seconds"];
    if (!retryDelay) return;
    console.log(`retry delay ${retryDelay}`);
    state.delay = parseInt(retryDelay);
    state.timeoutId = setTimeout(async () => await refresh(io), state.delay * 1000);
    io.emit("delay", { delay: state.delay });
  }
};

function start(io) {
  console.log(`ws started (total: ${state.connectionCount})`);
  io.on("connection", (socket) => {
    state.connectionCount += 1;
    console.log(`user connected (total: ${state.connectionCount})`);
    socket.on("disconnect", () => {
      state.connectionCount -= 1;
      console.log(`user disconnected (total: ${state.connectionCount})`);
      if (state.connectionCount) return;
      if (!state.timeoutId) return;
      clearTimeout(state.timeoutId);
      state.timeoutId = 0;
    });
    if (state.timeoutId) return;
    state.timeoutId = setTimeout(async () => await refresh(io), 1000);
  });
}

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
  });
};

module.exports = start;
