import { z } from "zod/v4";

export function generatePrivateChannel(userId:string | undefined, channelName:string) {
    return `private-${userId}-${channelName}`;
}

const MESSAGE_UPDATE_EVENT = "new_chunk"
const MESSAGE_DONE_EVENT = "message_done"
const TITLE_UPDATED = "title_updated"
const NEW_CHAT = "new_chat"

const messageUpdateSchema = z.object({
    messageId: z.number(),
    type: z.enum(["text", "reasoning"]),
    text: z.string()
})


const messageDoneSchema = z.object({
    messageId: z.number()
})

const titleUpdatedSchema = z.object({
    id: z.string(),
    title: z.string()
})

const newChatSchema = z.object({
    id: z.string(),
    title: z.string()
})

type MessageUpdateSchema = z.infer<typeof messageUpdateSchema>
type MessageDoneSchema = z.infer<typeof messageDoneSchema>
type TitleUpdatedSchema = z.infer<typeof titleUpdatedSchema>
type NewChatSchema = z.infer<typeof newChatSchema>

export { MESSAGE_DONE_EVENT, MESSAGE_UPDATE_EVENT, TITLE_UPDATED, NEW_CHAT };
export type { MessageUpdateSchema, MessageDoneSchema, TitleUpdatedSchema, NewChatSchema };
