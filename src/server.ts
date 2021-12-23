import "reflect-metadata";
import dotenv from "dotenv";
import App from "./app";
dotenv.config();

import ClientsRouter from "./components/clients/clients.router";
import PartnersRouter from "./components/partners/partners.router";
import EmergencyRescueRouter from "./components/emergency_rescue/emergency_rescue.router";
import CarServicingRouter from "./components/car_servicing/car_servicing.router";
import CarWashRouter from "./components/car_wash/car_wash.router";

const app = new App([
  new ClientsRouter(),
  new PartnersRouter(),
  new EmergencyRescueRouter(),
  new CarServicingRouter(),
  new CarWashRouter(),
]);

app.listen();
