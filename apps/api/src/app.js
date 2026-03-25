import Fastify from 'fastify';
import cors from "@fastify/cors"
import mongoose from "mongoose"
import { Server as SocketIOServer } from 'socket.io'

import routes from "./routes/index.js"
import { config } from '../../../packages/shared/config.js';

const buildApp = async () => {
    const app = Fastify({ logger: true })

    await app.register(cors, {
        origin: "*",
        methods : ["GET", "POST"]
    })

    await app.register(routes)
    await mongoose.connect(config.db)
    app.decorate('mongoose', mongoose)

    const io = new SocketIOServer(app.server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        app.log.info(`Socket connected: ${socket.id}`)

        socket.on('send_message', (payload) => {
            const message = {
                id: Date.now(),
                text: payload.text,
                author: payload.author || 'Anonymous',
                ts: new Date().toISOString()
            }
            io.emit('new_message', message)
        })

        socket.on('disconnect', () => {
            app.log.info(`Socket disconnected: ${socket.id}`)
        })
    })

    app.decorate('io', io)
    return app
}

export default buildApp