const token = localStorage.getItem('accessToken');
const refreshtoken = localStorage.getItem('refreshToken');
(function () {
  let socket = io('http://localhost:8080', {
    query: { token, refreshtoken },
  });
console.log(token)
  socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Đối tượng toàn cục để tương tác với WebSocket
  window.appSocket = {
    socket: socket,
  };
})();
