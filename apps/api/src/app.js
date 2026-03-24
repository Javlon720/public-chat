import Fastify from 'fastify';
import cors from "@fastify/cors"
import mongoose from "mongoose"

import routes from "./routes/index.js"
import { config } from '../../../packages/shared/config.js';



const buildApp = async () => {
    const app = Fastify({ logger: true })
    await app.register(cors, {
        origin: "*",
        methods : ["GET , POST"]
    })
    await app.register(routes)
    await mongoose.connect(config.db)

    app.decorate('mongoose', mongoose)
    return app
}

export default buildApp