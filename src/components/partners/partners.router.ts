import { Router } from "express";
import { AppRouter } from "../../interfaces/interfaces";
import PartnersController from "./partners.controller";

class PartnersRouter implements AppRouter {
  router = Router();
  controller = new PartnersController();
  path = "/partners";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/",this.controller.getAll)
    this.router.get("/:uuid",this.controller.getOne)
    this.router.post("/verify-otp",this.controller.verifyOtp)
    // this.router.post("/profile-setup",this.controller.profileSetup)
    this.router.post("/verify-phonenumber",this.controller.verifyPhoneNumber)
  }
}

export default PartnersRouter;
