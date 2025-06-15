import { availableProviders } from "~/lib/providers"
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler"

export default defineAuthenticatedEventHandler(async (event) => {
    const res: Record<string, unknown> = {}

    for (const provider of Object.values(availableProviders)) {
        res[provider.getName()] = [] 
    }
})