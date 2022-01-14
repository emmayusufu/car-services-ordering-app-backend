import { Router } from "express";

export interface AppRouter {
    path:string;
    router:Router
}