import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

const userService = new UserService();
export class UserController {
    
    async getUsers(req: Request, res: Response): Promise<void> {
      try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({ message: "Error al obtener los usuarios" });
      }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
      try {
        if (!req.params.id) {
          res.status(400).json({ message: "ID de usuario es requerido" });
          return;
        }
        
        const userId = Number(req.params.id);

        const user = await userService.getUserById(userId);
        res.status(200).json(user);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ message: "Error al obtener el usuario" });
      }
    }
}