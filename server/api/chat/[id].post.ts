import { and, eq, isNotNull } from "drizzle-orm"
import { z } from "zod/v4"
import { generateMessage } from "~/lib/ai"
import { db } from "~/lib/db"
import { chat, message } from "~/lib/db/schemas"
import { getParser } from "~/lib/md/parser"
import { pusher } from "~/lib/pusher/server"
import { generatePrivateChannel, MESSAGE_DONE_EVENT, MESSAGE_UPDATE_EVENT, MessageDoneSchema, MessageUpdateSchema } from "~/lib/pusher/utils"

const requestSchema = z.object({
    lastMessage: z.string(),
    createMessage: z.boolean().optional().default(false)
})

export default defineEventHandler(async (event) => {
    if (!event.context.user) throw Error("unauthorized")
    const data = requestSchema.parse(await readBody(event))
    const chatId = getRouterParam(event, "id")
    if (!chatId) throw Error("no chatId provided")
    const chatInstance = await db.query.chat.findFirst({ where: eq(chat.id, chatId) })
    if (!chatInstance) throw Error("no chat found")
    if (chatInstance.userId !== event.context.user.id) throw Error("unauthorized")
    let chatHistory = await db.select().from(message).where(and(eq(message.chatId, chatId), isNotNull(message.content)))
    if (chatHistory.length && chatHistory[chatHistory.length - 1].status !== "done") throw Error("cannot generate another message while the last one is not finished")
    if (data.createMessage) {
        await db.insert(message).values({
            chatId,
            content: data.lastMessage,
            sender: "user",
            status: "done"
        })
    }
    chatHistory = await db.select().from(message).where(and(eq(message.chatId, chatId), isNotNull(message.content)))
    const messageInstance = await db.insert(message).values({
        chatId,
        sender: "assistant",
        status: "generating"
    }).returning()
    event.waitUntil(new Promise<void>(async (resolve) => {
        const responseStream = await generateMessage(chatHistory, chatInstance.modelId, chatInstance.modelProvider)
        let text = ""
        for await (const chunk of responseStream) {
            text += chunk
            await db.update(message).set({
                content: text
            }).where(eq(message.id, messageInstance[0].id))
            const pusherData: MessageUpdateSchema = {
                messageId: messageInstance[0].id,
                text: chunk
            }
            await pusher.trigger(generatePrivateChannel(event.context.user?.id, `chat-${chatInstance.id}`), MESSAGE_UPDATE_EVENT, pusherData)
        }
        const rendererContent = await getParser().process(text)
        await db.update(message).set({
            status: "done",
            rendererContent: rendererContent.toString()
        }).where(eq(message.id, messageInstance[0].id))
        const pusherData: MessageDoneSchema = {
            messageId: messageInstance[0].id
        }
        await pusher.trigger(generatePrivateChannel(event.context.user?.id, `chat-${chatInstance.id}`), MESSAGE_DONE_EVENT, pusherData)
        resolve()
    }))
    return messageInstance[0]
})