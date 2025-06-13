import { type } from "arktype"
import { generateChatTitle } from "~/lib/ai"

const bodySchema = type({
    message: "string"
})

export default defineEventHandler(async(event) => {
    const body = bodySchema.assert(await readBody(event))

    const text = await generateChatTitle(body.message)

    return {
        text
    }
})