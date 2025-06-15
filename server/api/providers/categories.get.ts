import { availableProviders, AvailableProviders } from "~/lib/providers";

export default defineEventHandler(async(event) => {
        if (!event.context.user) throw Error("unauthorized")
    
        const res = []
    
        for (const key of Object.keys(availableProviders)) {
            res.push({
                provider: key as AvailableProviders,
                byok: availableProviders[key as AvailableProviders].byok()
            })
        }
    
        return res;
})