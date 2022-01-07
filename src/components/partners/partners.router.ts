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
    this.router.post("/phonenumber-verification",this.controller.verifyPhoneNumber)
    this.router.post("/otp-verification",this.controller.verifyOtp)
    this.router.put("/individual-profile-setup/:uuid",this.controller.individualProfileSetup)
    this.router.put("/company-profile-setup/:uuid",this.controller.companyProfileSetup)
    this.router.post("/service-registration/:uuid",this.controller.registerServices)
  }
}

export default PartnersRouter;
