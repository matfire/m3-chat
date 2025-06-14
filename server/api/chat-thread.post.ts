import { type } from "arktype"
import { eq } from "drizzle-orm"
import { generateChatTitle } from "~/lib/ai"
import { db } from "~/lib/db"
import { chat, message } from "~/lib/db/schemas"
import { pusher } from "~/lib/pusher/server"
import { generatePrivateChannel, TITLE_UPDATED } from "~/lib/pusher/utils"

const requestSchema = type({
    chatId: "string"
})

export default defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) {
        throw Error("unauthorized")
    }
    const data = requestSchema.assert(await readBody(event))
    const chatInstance = await db.select().from(chat).where(eq(chat.id, data.chatId))
    if (chatInstance[0].userId !== user.id) throw Error("unauthorized")
    const chatMessages = await db.select().from(message).where(eq(message.chatId, data.chatId))
    if (chatMessages.length < 1 || !chatMessages[0].content) throw Error("invalid content")
    const chatTitle = await generateChatTitle(chatMessages[0].content!)
    await db.update(chat).set({ title: chatTitle }).where(eq(chat.id, data.chatId))
    await pusher.trigger(generatePrivateChannel(user.id, "titles"), TITLE_UPDATED, {chatId: data.chatId, title: chatTitle})
})