import { z } from "zod"
import { pusher } from "~/lib/pusher/server"

const requestSchema = z.object({
    socket_id: z.string(),
    channel_name: z.string()
})

export default defineEventHandler(async(event) => {
    if (!event.context.user) throw Error("unauthorized")
    const data = requestSchema.parse(await readBody(event))
    if (data.channel_name.split('-')[1] === event.context.user.id) {
        const authResponse = pusher.authorizeChannel(data.socket_id, data.channel_name)
        return authResponse
    }
})