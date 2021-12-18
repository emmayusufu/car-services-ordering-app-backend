import {Router} from "express"
import { AppRouter } from "../../interfaces/interfaces"
import ClientsController from "./clients.controller"

class ClientsRouter implements AppRouter {
    router = Router()
    controller = new ClientsController()
    path = "/clients"

    constructor () {
        this.initializeRoutes()
    }

    initializeRoutes(){
        this.router.get("/",this.controller.getAll)
        this.router.get("/:uuid",this.controller.getOne)
        this.router.post("/verify-otp",this.controller.verifyOtp)
        this.router.post("/verify-phonenumber",this.controller.verifyPhoneNumber)
        this.router.delete("/:id",this.controller.delete)
        this.router.put("/:id",this.controller.update)
    }
}

export default ClientsRouter 