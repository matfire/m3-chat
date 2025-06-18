import { desc, eq } from "drizzle-orm"
import { db } from "~/lib/db"
import { chat } from "~/lib/db/schemas"
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler"

export default defineAuthenticatedEventHandler(async(event) => {

    const data = await db.select({id: chat.id, title: chat.title}).from(chat).where(eq(chat.userId, event.context.user.id)).orderBy(desc(chat.updatedAt))
    return data
})