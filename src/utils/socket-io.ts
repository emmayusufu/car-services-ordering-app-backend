import { Server } from "socket.io";
import http from "http";

class SocketIO {
  private IO: Server | null = null;

  constructor(server: http.Server) {
    this.IO = new Server(server, {
      cors: { origin: "*" },
    });
  }

  getIO = (): Server | null => {
    if(this.IO){
      return this.IO
    }
    return this.IO;
  };
}


export default SocketIO