import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';

class Server {
    private app: express.Application;
    private port: string;
    private apiPaths = '/api';

    constructor() {
        this.port = process.env.PORT || '3000';
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors())
        //params en body como urlencoded, ó bien, middleware para leer datos de formularios
        this.app.use(express.urlencoded({ extended: true }));
        this.routes();
        
    }

    public start(): void {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server corriendo en el puerto ${process.env.PORT}`);
        });
    }

    public routes(): void {
        this.app.use(this.apiPaths, routes);
    }
}

export default Server;