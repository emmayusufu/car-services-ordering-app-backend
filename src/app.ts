import express, { json, NextFunction, Request, Response } from "express";
import http, { Server } from "http";
import { AppRouter } from "./interfaces/interfaces";
import { createConnection } from "typeorm";
import morgan from "morgan";
import { logger } from "./utils/logger";
import SocketIO from "./utils/socket-io";
import { Socket } from "socket.io";
import colors from "colors/safe"
import Redis from "./utils/redis-manager";

interface RedisPartner {
  socketId: string
}


class App {
  private app = express();
  private server: Server = http.createServer(this.app);
  private port = process.env.PORT || 5000;
  private env = process.env.NODE_ENV || "development";
  private io = new SocketIO(this.server).getIO()
  private redisClient = Redis.getInstance().client;

  constructor(routes: AppRouter[]) {
    this.initializeMiddleware();
    this.initializeRoutes(routes);
    this.initializeSocketIO()
  }

  listen = () => {
    createConnection().then(() => {
      this.server.listen(this.port, () => {
        logger.info(`=================================`);
        logger.info(`======= ENV: ${this.env} =======`);
        logger.info(`App listening on the port http://localhost:${this.port}`);
        logger.info(`=================================`);
      });
    });
  };

  initializeRoutes = (routes: AppRouter[]) => {
    routes.map(({ path, router }) => {
      return this.app.use(path, router);
    });
  };

  initializeSocketIO = () => {

    if (this.io) {
      this.io.on("connection", (socket: Socket) => {
        const auth = socket.handshake.auth as { uuid: string, role: string }
        const socketId: string = socket.id
        // console.log(colors.green(`A ${auth.role} with uuid : ${auth.uuid} and socket id ${socketId} has connected`))

        //   this.redisClient.json.set(`${role}:${uuid}`, '.', {
        //     socketId
        //   }).then((value: string) => {
        //     if (value === "OK") {
        //       console.log(colors.green(`A user with uuid : ${uuid} and socket id ${socketId} has connected`))
        //     } else {
        //       console.log(colors.red("Failed to set user hash"))
        //     }
        //   }).catch((error)=>{
        //     console.log(colors.red(`location update error ${error}`))
        //   })

        // socket.on("locationUpdates", (data: any) => {
        //   const { latitude, longitude, uuid }: { latitude: string, longitude: string, uuid: string } = JSON.parse(data)
        //   this.redisClient.geoAdd("partnerLoctions", { latitude: latitude, longitude: longitude, member: uuid }).then((value: number) => {
        //     if (value) {
        //       console.log("position update success")
        //     } else {
        //       console.log("position update failed")
        //     }
        //   }).catch((error)=>{
        //     console.log(colors.red(`location update error ${error}`))
        //   })
        // })
        // socket.on("disconnect", () => {
        //   this.redisClient.del(uuid).then((value: number) => {
        //     if (value) {
        //       console.log(colors.red(`A user with uuid : ${uuid} and socket id : ${socketId} has disconnected`))
        //     } else {
        //       console.log("Failed to remove disconnected user")
        //     }
        //   })
        // })

      })
    } else {
      console.log(colors.red("IO object not initialised"))
    }

  }

  initializeMiddleware = () => {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
    this.app.get("/", (req, res) => {
      res.json({ message: `Server is up and running on port : ${this.port}` })
    })
  };

  initializeErrorHandling() {
    this.app.use(
      (error: Error, req: Request, res: Response, _next: NextFunction) => {
        //   const status = error.status || 500;
        const message = error.message || "Something went wrong";
        logger.error(
          `[${req.method}] ${req.path} >> StatusCode:: {status}, Message:: ${message}`
        );
        res.status(500).json({ message });
      }
    );
  }
}

export default App;


