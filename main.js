var connectedStatus = false;
var reconnectTimeout = 2000;
var host = "";
var port = 8080;
var userName = "";
var password = "";

client = new Paho.Client(host, Number(port), "id_" + parseInt(Math.random() * 1000, 10));

var options = {
  useSSL: true,
  timeout: 10,
  userName: userName,
  password: password,
  cleanSession: true,
  onSuccess: onConnect,
  onFailure: onConnectionFailed,
};

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect(options);

function onConnect() {

  client.subscribe("tsensor/#");
  document.getElementById("status").innerHTML = "Verbonden";
  document.getElementById("status").classList.add("online");
  // message = new Paho.Message("occupied");
  // message.destinationName = "tsensor/2";
  // client.send(message);
}

function onConnectionLost(responseObject) {

  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
    document.getElementById("status").innerHTML = "Verbinding verbroken / Error";
    document.getElementById("status").classList.add("fail");
    onConnect();
  }
}

function onConnectionFailed(responseObject) {

  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
    document.getElementById("status").innerHTML = "Geen verbinding";
    document.getElementById("status").classList.add("offline");
  }
}

function onMessageArrived(message) {

  var topic = message.destinationName.split("/");
  if (topic.length == 2) {
    var sensor = topic[1];
  } else {
    return false;
  }
  var sensor = message.destinationName = "tsensor/" + sensor;
  
  var messagePayload = message.payloadString;
  switch (messagePayload) {
    case "occupied":
      displayClass = "occupied";
      console.log()
      UpdateElement(sensor, displayClass);
      break;
    case "free":
      displayClass = "free";
      UpdateElement(sensor, displayClass);
      break;
    default:
      displayClass = "unknown"; 
      UpdateElement(sensor, displayClass);
      break;
  }
}

function UpdateElement(sensor, displayClass) {
  console.log(sensor);
  console.log(displayClass);
  var cell = document.getElementById(sensor);
  if (cell) {
    cell.className = displayClass;
  }
}