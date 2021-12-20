import { Router } from "express";
import { AppRouter } from "../../interfaces/interfaces";
import EmergencyRescueController from "./emergency_rescue.controller";

class EmergencyRescueRouter implements AppRouter {
  path = "/emergency-rescue";
  router = Router();
  controller = new EmergencyRescueController();
}

export default EmergencyRescueRouter;
