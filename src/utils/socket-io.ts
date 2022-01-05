import socket from "socket.io";
import http from "http";

class SocketIO {
  private IO = null;

  constructor(server: http.Server) {
    this.IO = new socket.Server(server, {
      cors: { origin: "*" },
    });
  }

  getIO = ():socket.Socket => {
    if (this.IO != null) return this.IO;
  };
}


export default SocketIO