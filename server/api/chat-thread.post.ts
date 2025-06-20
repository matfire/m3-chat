import { eq } from "drizzle-orm"
import { z } from "zod/v4"
import { generateChatTitle } from "~/lib/ai"
import { db } from "~/lib/db"
import { chat, message } from "~/lib/db/schemas"
import { pusher } from "~/lib/pusher/server"
import { generatePrivateChannel, TITLE_UPDATED, TitleUpdatedSchema } from "~/lib/pusher/utils"
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler"

const requestSchema = z.object({
    chatId: z.string()
})

export default defineAuthenticatedEventHandler(async (event) => {
    const user = event.context.user
    const data = requestSchema.parse(await readBody(event))
    const chatInstance = await db.select().from(chat).where(eq(chat.id, data.chatId))
    if (chatInstance[0].userId !== user.id) throw Error("unauthorized")
    const chatMessages = await db.select().from(message).where(eq(message.chatId, data.chatId))
    if (chatMessages.length < 1 || !chatMessages[0].content) throw Error("invalid content")
    const chatTitle = await generateChatTitle(chatMessages[0].content!)
    await db.update(chat).set({ title: chatTitle }).where(eq(chat.id, data.chatId))
    const pusherData: TitleUpdatedSchema = {
        id: data.chatId,
        title: chatTitle
    }
    await pusher.trigger(generatePrivateChannel(user.id, "titles"), TITLE_UPDATED, pusherData)
})