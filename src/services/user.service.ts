import { AppDataSource } from '../config/database.js';
import { User } from './../entities/user.js';


export class UserService {
    private repo = AppDataSource.getRepository(User);

    async getUserById(id: number): Promise<User | null> {
        const user = await this.repo.findOneBy({ id: id });
        return user;
    }
    async getAllUsers(): Promise<User[]> {
        // Lógica para obtener todos los usuarios desde la base de datos
        const users = await this.repo.find();
        console.log("users: ", users);
        return users;
    }
}