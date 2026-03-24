import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.join(__dirname, "../../.env")
})

export const config = {
    port_api: Number(process.env.PORT_API),
    db: String(process.env.DB_URI),
    port_vite:Number(process.env.PORT_VITE)
}

console.log(config);
