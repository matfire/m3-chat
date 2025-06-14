export function generatePrivateChannel(userId:string | undefined, channelName:string) {
    return `private-${userId}-${channelName}`;
}

const MESSAGE_UPDATE_EVENT = "new_chunk"
const MESSAGE_DONE_EVENT = "message_done"

export {MESSAGE_DONE_EVENT, MESSAGE_UPDATE_EVENT}