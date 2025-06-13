import { eq } from "drizzle-orm"
import { db } from "~/lib/db"
import { chat } from "~/lib/db/schemas"

export default defineEventHandler(async(event) => {
    if (!event.context.user) throw Error("unauthorized")
    const chatId = getRouterParam(event, "id")
    if (!chatId) throw Error("missing chatId")
    await db.delete(chat).where(eq(chat.id, chatId))
})