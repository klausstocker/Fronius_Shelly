const ip_inverter = "192.168.1.40"; // ip of inverter
const interval_s = 300; // minimal turn on/off time
const thresholdPower_W = 800;  // minimal available power (grid + battery)
const SOC_min_percent = 30; // minimum state of charge of battery to allow load to be turned on (ignored if there is no battery)

function findNextComma(str, start) {
    for (let i = start; i < str.length; i++) {
        if (str[i] === ',') {
            return i; // Return the index of the next comma
        }
    }
    return -1; // Return -1 if no comma is found
}

function extractValue(str, pattern)
{
  const start = str.match(pattern).index + pattern.length;
  const end = findNextComma(str, start);
  const value = parseFloat(str.slice(start, end));
  if (isNaN(value))
    return 0.;
  return value;
}


function checkPower(){
Shelly.call(
  "HTTP.GET", {
    "url": "http://"+ip_inverter+"/solar_api/v1/GetPowerFlowRealtimeData.fcgi",
  },
  function(result) {
    print("parsing fronius result");
    const gridPower_W = extractValue(result.body, "\"P_Grid\" : ");
    const pvPower_W = extractValue(result.body, "\"P_PV\" : ");
    akkuPower_W = 0.0;
    SOC_percent = 100.0;
    try {
        akkuPower_W = extractValue(result.body, "\"P_Akku\" : ");
        SOC_percent = extractValue(result.body, "\"SOC\" : ");
    }
    catch(err) {
      // no battery found
    }
    const availablePower_W = -(akkuPower_W + gridPower_W);
    print("available power: " + parseFloat(availablePower_W).toFixed(0) + " W, " + "SOC: " + parseFloat(SOC_percent ).toFixed(0) + " %");
    if (availablePower_W >= thresholdPower_W && SOC_percent >= SOC_min_percent)
      Shelly.call("Switch.set", {'id': 0, 'on': true});
    if (availablePower_W < 0 || SOC_percent < SOC_min_percent)
      Shelly.call("Switch.set", {'id': 0, 'on': false});
  }
);
}

var _timerHandle;
function startTimer() {
  print("fronius script started");
  _timerHandle = Timer.set(interval_s * 1000, true, checkPower);
}

startTimer();