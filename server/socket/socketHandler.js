// Socket.io real-time event handlers
const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // User joins their personal room to receive targeted notifications
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    // Technician joins the "technicians" room to receive new job broadcasts
    socket.on('join:technicians', () => {
      socket.join('technicians');
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initSocket };
