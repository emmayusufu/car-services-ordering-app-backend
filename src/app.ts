import express, { NextFunction, Request, Response } from "express";
import http, { Server } from "http";
import { AppRouter } from "./interfaces/interfaces";
import { createConnection } from "typeorm";
import morgan from "morgan";
import { logger } from "./utils/logger";
import SocketIO from "./utils/socket-io";

class App {
  app = express();
  server: Server = http.createServer(this.app);
  port = process.env.PORT || 5000;
  env = process.env.NODE_ENV || "development";

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
        logger.info(`App listening on the port ${this.port}`);
        logger.info(`=================================`);
      });
    });
  };

  initializeRoutes = (routes: AppRouter[]) => {
    routes.map(({ path, router }) => {
      return this.app.use(path, router);
    });
  };

  initializeSocketIO = ()=>{
    const io = new SocketIO(this.server).getIO()
    io.on("connection",(socket)=>{
      console.log("A user has connected to the socket")
    })
    
  }

  initializeMiddleware = () => {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
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
