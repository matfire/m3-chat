import { auth } from "~/lib/auth"
import { availableProviders } from "~/lib/providers"

export default defineEventHandler(async (event) => {
    const user = await auth.api.getSession({headers: event.headers})

    if (!user) {
        throw new Error("unauthorized")
    }

    const res: Record<string, unknown> = {}

    for (const provider of Object.values(availableProviders)) {
        res[provider.getName()] = [] 
    }
})