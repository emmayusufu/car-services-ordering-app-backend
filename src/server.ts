import "reflect-metadata";
import dotenv from "dotenv"
import App from "./app"
dotenv.config()

import ClientsRouter from "./components/clients/clients.router";
import PartnersRouter from "./components/partners/partners.router";

const app = new App([new ClientsRouter(), new PartnersRouter()])

app.listen()


