import { type } from "arktype"
import { eq } from "drizzle-orm"
import { generateChatTitle } from "~/lib/ai"
import { db } from "~/lib/db"
import { chat, message } from "~/lib/db/schemas"
import { pusher } from "~/lib/pusher/server"

const requestSchema = type({
    chatId: "string"
})

export default defineEventHandler(async (event) => {
    console.log("creating thread")
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
    const res = await pusher.trigger('thread_titles', 'title_updated', {chatId: data.chatId, title: chatTitle})
})