import "reflect-metadata";
import dotenv from "dotenv"
import App from "./app"
dotenv.config()

import ClientsRouter from "./components/clients/clients.router";

const app = new App([new ClientsRouter()])

app.listen()


