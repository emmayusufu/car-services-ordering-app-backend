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
    this.router.post("/phone-number-verification",this.controller.verifyPhoneNumber)
    this.router.post("/otp-verification",this.controller.verifyOtp)
    this.router.post("/individual-profile-setup/:uuid",this.controller.individualProfileSetup)
    this.router.post("/company-profile-setup/:uuid",this.controller.companyProfileSetup)
    this.router.put("/service-registration/:uuid",this.controller.registerServices)
  }
}

export default PartnersRouter;
