import { createClient } from "@libsql/client/web"; 
import 'dotenv/config'

const client = createClient({
    url: "libsql://now-bot-stealsocks.turso.io",
    authToken: process.env.TURSO_TOKEN
});

export default client 