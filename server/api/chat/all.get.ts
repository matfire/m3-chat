import { eq } from "drizzle-orm"
import { db } from "~/lib/db"
import { chat } from "~/lib/db/schemas"

export default defineEventHandler(async(event) => {
    if (!event.context.user) throw Error("unauthorized")

    const data = await db.select({id: chat.id, title: chat.title}).from(chat).where(eq(chat.userId, event.context.user.id))
    return data
})