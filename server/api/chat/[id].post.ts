import { and, eq, isNotNull } from "drizzle-orm"
import { z } from "zod/v4"
import { generateMessage } from "~/lib/ai"
import { CHAT_BATCH_LENGTH, REASON_BATCH_LENGTH } from "~/lib/constants"
import { db } from "~/lib/db"
import { chat, message } from "~/lib/db/schemas"
import { getParser } from "~/lib/md/parser"
import { pusher } from "~/lib/pusher/server"
import { generatePrivateChannel, MESSAGE_DONE_EVENT, MESSAGE_UPDATE_EVENT, MessageDoneSchema, MessageUpdateSchema } from "~/lib/pusher/utils"
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler"

const requestSchema = z.object({
    lastMessage: z.string(),
    createMessage: z.boolean().optional().default(false)
})


export default defineAuthenticatedEventHandler(async (event) => {
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
        const responseStream = await generateMessage(chatHistory, chatInstance.modelId, event.context.user!.id, chatInstance.modelProvider)
        let text = ""
        let reasoning = ""
        let allIsGood = true;
        let tempText = "";
        let tempReasoning = "";
        for await (const chunk of responseStream) {
            switch (chunk.type) {
                case "text-delta": {
                    tempText += chunk.textDelta
                    break
                }
                case "reasoning": {
                    tempReasoning += chunk.textDelta
                    break
                }
                case "error": {
                    console.log("error: ", chunk.error)
                    allIsGood = false;
                    break
                }
            }
            if (tempText.length >= CHAT_BATCH_LENGTH) {
                text += tempText
                await db.update(message).set({
                    content: text
                }).where(eq(message.id, messageInstance[0].id))
                const textUpdateData: MessageUpdateSchema = {
                    messageId: messageInstance[0].id,
                    type: "text",
                    text: tempText
                }
                await pusher.trigger(generatePrivateChannel(event.context.user?.id, `chat-${chatInstance.id}`), MESSAGE_UPDATE_EVENT, textUpdateData)
                tempText = ""
            }
            if (tempReasoning.length >= REASON_BATCH_LENGTH) {
                reasoning += tempReasoning
                await db.update(message).set({
                    reasoning: reasoning
                }).where(eq(message.id, messageInstance[0].id))
                const reasoningUpdateData: MessageUpdateSchema = {
                    messageId: messageInstance[0].id,
                    type: "reasoning",
                    text: tempReasoning
                }
                await pusher.trigger(generatePrivateChannel(event.context.user?.id, `chat-${chatInstance.id}`), MESSAGE_UPDATE_EVENT, reasoningUpdateData)
                tempReasoning = ""
            }
        }
        if (tempReasoning.length > 0) {
            reasoning += tempReasoning
            await db.update(message).set({
                reasoning: reasoning
            }).where(eq(message.id, messageInstance[0].id))
            const reasoningUpdateData: MessageUpdateSchema = {
                messageId: messageInstance[0].id,
                type: "reasoning",
                text: tempReasoning
            }
            await pusher.trigger(generatePrivateChannel(event.context.user?.id, `chat-${chatInstance.id}`), MESSAGE_UPDATE_EVENT, reasoningUpdateData)
            tempReasoning = ""
        }
        if (tempText.length > 0) {
            text += tempText
            await db.update(message).set({
                content: text
            }).where(eq(message.id, messageInstance[0].id))
            const textUpdateData: MessageUpdateSchema = {
                messageId: messageInstance[0].id,
                type: "text",
                text: tempText
            }
            await pusher.trigger(generatePrivateChannel(event.context.user?.id, `chat-${chatInstance.id}`), MESSAGE_UPDATE_EVENT, textUpdateData)
            tempText = ""
        }
        if (allIsGood) {
            const rendererContent = await getParser().process(text)
            const rendererReasoning = reasoning ? await getParser().process(reasoning) : null
            await db.update(message).set({
                status: "done",
                rendererContent: rendererContent.toString(),
                rendererReasoning: rendererReasoning?.toString()
            }).where(eq(message.id, messageInstance[0].id))
        } else {
            await db.update(message).set({
                status: "error"
            }).where(eq(message.id, messageInstance[0].id))
        }
        const pusherData: MessageDoneSchema = {
            messageId: messageInstance[0].id
        }
        await pusher.trigger(generatePrivateChannel(event.context.user?.id, `chat-${chatInstance.id}`), MESSAGE_DONE_EVENT, pusherData)
        resolve()
    }))
    return messageInstance[0]
})