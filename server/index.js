import connectdb from "./mongoDB/index.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "http://65.1.144.216:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(" A user connected:", socket.id);

  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId); 
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  socket.on("sendLikeNotification", ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveNotification", { senderId });
      console.log(` Notification sent from ${senderId} to ${receiverId}`);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) onlineUsers.delete(key);
    });
    console.log(" User disconnected:", socket.id);
  });
});
app.set("io", io);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

connectdb()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(` Server running at port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log(" MONGO DB connection failed:", err);
  });
  export { io };