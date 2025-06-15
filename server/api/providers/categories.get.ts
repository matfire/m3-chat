import { availableProviders, AvailableProviders } from "~/lib/providers";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async() => {   
        const res = []
    
        for (const key of Object.keys(availableProviders)) {
            res.push({
                provider: key as AvailableProviders,
                byok: availableProviders[key as AvailableProviders].byok()
            })
        }
    
        return res;
})