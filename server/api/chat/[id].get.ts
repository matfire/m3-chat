import { eq } from "drizzle-orm"
import { db } from "~/lib/db"
import { chat, message } from "~/lib/db/schemas"

export default defineEventHandler(async(event) => {
    if (!event.context.user) throw Error("unauthorized")
    const chatId = getRouterParam(event, "id")
    if (!chatId) throw Error("no chatId provided")
    const dbChat = await db.query.chat.findFirst({where: eq(chat.id, chatId)})
    if (dbChat?.userId !== event.context.user.id) throw Error("unauthorized")
    const dbMessages = await db.select().from(message).where(eq(message.chatId, chatId))
    return {
        chat: dbChat,
        messages: dbMessages
    }
})