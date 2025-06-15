import { eq } from "drizzle-orm"
import { db } from "~/lib/db"
import { chat } from "~/lib/db/schemas"
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler"

export default defineAuthenticatedEventHandler(async(event) => {
    const chatId = getRouterParam(event, "id")
    if (!chatId) throw Error("missing chatId")
    await db.delete(chat).where(eq(chat.id, chatId))
})