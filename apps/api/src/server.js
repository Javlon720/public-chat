import { config } from "../../../packages/shared/config.js";
import buildApp from "./app.js";


const start = async () => {
    const app = await buildApp()
    await app.listen({ port: config.port_api })
    console.log((`Server running on ${config.port_api}`));
}
start()


