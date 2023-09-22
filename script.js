const statusDiv = document.getElementById("status");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const disconnectButton = document.getElementById("disconnect-button");
const notificationsDiv = document.getElementById("notifications");
const wsUrl = "wss://socketsbay.com/wss/v2/1/demo/";
let socket;

const displayNotification = (message) => {
  const notification = document.createElement("div");
  notification.textContent = message;
  notificationsDiv.appendChild(notification);
};

const connectWebSocket = () => {
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    statusDiv.textContent = "Connected";
    messageInput.disabled = false;
    sendButton.disabled = false;
  };

  socket.onmessage = (event) => {
    const message = event.data;
    displayNotification(message);
  };

  socket.onclose = () => {
    statusDiv.textContent = "Disconnected";
    messageInput.disabled = true;
    sendButton.disabled = true;

    // Automatically attempt to reconnect after 10 seconds
    setTimeout(() => {
      statusDiv.textContent = "Reconnecting...";
      connectWebSocket();
    }, 10000);
  };
};

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message !== "") {
    socket.send(message);
    messageInput.value = "";
  }
});

disconnectButton.addEventListener("click", () => {
  if (socket) {
    socket.close();
    statusDiv.textContent = "Disconnecting...";
  }
});

connectWebSocket();
