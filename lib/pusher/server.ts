import Pusher from "pusher";
import env from "../env";

export const pusher = new Pusher({
    host: env.PUSHER_HOST,
    port: env.PUSHER_PORT,
    secret: env.PUSHER_SECRET,
    appId: env.PUSHER_APP,
    cluster: env.PUSHER_CLUSTER,
    key: env.PUSHER_KEY
})