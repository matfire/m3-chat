export function generatePrivateChannel(userId:string | undefined, channelName:string) {
    return `private-${userId}-${channelName}`;
}

const MESSAGE_UPDATE_EVENT = "new_chunk"
const MESSAGE_DONE_EVENT = "message_done"
const TITLE_UPDATED = "title_updated"
const NEW_CHAT = "new_chat"

export {MESSAGE_DONE_EVENT, MESSAGE_UPDATE_EVENT, TITLE_UPDATED, NEW_CHAT}