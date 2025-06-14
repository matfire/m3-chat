import { type } from "arktype"
import { and, eq, isNotNull, ne } from "drizzle-orm"
import { generateMessage } from "~/lib/ai"
import { db } from "~/lib/db"
import { chat, message } from "~/lib/db/schemas"
import { pusher } from "~/lib/pusher/server"
import { generatePrivateChannel, MESSAGE_DONE_EVENT, MESSAGE_UPDATE_EVENT } from "~/lib/pusher/utils"

const requestSchema = type({
    lastMessage: "string",
    createMessage: "boolean?"
})

export default defineEventHandler(async(event) => {
    if (!event.context.user) throw Error("unauthorized")
    const data = requestSchema.assert(await readBody(event))
    const chatId = getRouterParam(event, "id")
    if (!chatId) throw Error("no chatId provided")
    const chatInstance = await db.query.chat.findFirst({where: eq(chat.id, chatId)})
    if (!chatInstance) throw Error("no chat found")
    if (chatInstance.userId !== event.context.user.id) throw Error("unauthorized")
        // add new message
    if (data.createMessage) {
        await db.insert(message).values({
            chatId,
            content: data.lastMessage,
            sender: "user",
            status: "done"
        })
    }
    const chatHistory = await db.select().from(message).where(and(eq(message.chatId, chatId), isNotNull(message.content)))
    event.waitUntil(new Promise<void>(async(resolve) => {
        const responseStream = await generateMessage(chatHistory, chatInstance.modelId)
        const messageInstance = await db.insert(message).values({
            chatId,
            sender: "assistant",
            status: "generating"
        }).returning()
        let text = ""
        for await (const chunk of responseStream) {
            text += chunk
            console.log(chunk)
            await db.update(message).set({
                content: text
            }).where(eq(message.id, messageInstance[0].id))
            console.log(await pusher.trigger(generatePrivateChannel(event.context.user?.id, `chat-${chatInstance.id}`), MESSAGE_UPDATE_EVENT, {messageId: messageInstance[0].id, text: chunk}))
        }
        await db.update(message).set({
            status: "done",
        }).where(eq(message.id, messageInstance[0].id))
        await pusher.trigger(generatePrivateChannel(event.context.user?.id, `chat-${chatInstance.id}`), MESSAGE_DONE_EVENT, {messageId: messageInstance[0].id})
        resolve()
    }))
    return {}
})