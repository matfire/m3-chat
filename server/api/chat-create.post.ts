import { type } from "arktype"
import { db } from "~/lib/db"
import { chat, message } from "~/lib/db/schemas"
import { pusher } from "~/lib/pusher/server"
import { generatePrivateChannel, NEW_CHAT } from "~/lib/pusher/utils"

const requestSchema = type({
    modelId: "string",
    message: "string"
})

export default defineEventHandler(async(event) => {
    const user  = event.context.user
    if (!user) {
        throw Error("unauthorized")
    }
    const body = await readBody(event)
    const data = requestSchema.assert(body)
    const newChat = await db.insert(chat).values({
        userId: user.id,
        modelId: data.modelId,
        title: "New Chat"
    }).returning()
    await db.insert(message).values({
        content: data.message,
        sender: "user",
        status: "done",
        chatId: newChat[0].id
    })
    await pusher.trigger(generatePrivateChannel(user.id, "titles"), NEW_CHAT, {id: newChat[0].id, title: "New Chat"})
    event.$fetch("/api/chat-thread", {
        method:"POST",
        body: {
            chatId: newChat[0].id
        }
    })
    event.$fetch(`/api/chat/${newChat[0].id}`, {
        method: "POST",
        body: {
            lastMessage: data.message
        }
    })
    return {
        chatId: newChat[0].id
    }

})