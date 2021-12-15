import express from "express";
import http from "http";
import { AppRouter } from "./interfaces/interfaces";
import {createConnection} from "typeorm";
import morgan from "morgan";

class App {
  app = express();
  server = http.createServer(this.app);
  port = process.env.PORT || 5000;
  env = process.env.NODE_ENV || "development";

  constructor(routes: AppRouter[]) {
    this.initializeMiddleware();
    this.initializeRoutes(routes);
  }

  listen = () => {
    createConnection().then(async()=>{
        this.server.listen(this.port, () => {
            console.log(`Server is running on port http://localhost:${this.port}`);
        });
    })
  };

  initializeRoutes = (routes: AppRouter[]) => {
    routes.forEach(({ path, router }) => {
      return this.app.use(path, router);
    });
  };

  initializeMiddleware = () => {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("dev"))
  };
}

export default App;
