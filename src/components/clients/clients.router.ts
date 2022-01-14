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
        this.router.put("/otp-verification",this.controller.verifyOtp)
        this.router.put("/profile-setup/:uuid",this.controller.profileSetup)
        this.router.post("/phone-number-verification",this.controller.verifyPhoneNumber)
    }
}

export default ClientsRouter 