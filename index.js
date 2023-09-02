const server = app.listen(process.env.PORT || 5000);
const io = require("./socket").init(server);
io.on("connection", (socket) => {
  console.log("SOCKET IO CONNECTED");
});
