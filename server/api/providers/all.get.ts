import { getOrCreateProfile } from "~/lib/db/helpers/profile";
import { AvailableProviders, availableProviders } from "~/lib/providers";

export default defineEventHandler(async(event) => {
    if (!event.context.user) throw Error("unauthorized")
    const userProfile = await getOrCreateProfile(event.context.user.id)
    if (!userProfile.data) throw Error("invalid profile")
    const res = []

    for (const key of Object.keys(availableProviders)) {
        const availableModels = await availableProviders[key as AvailableProviders].getModels();
        // filter if it should only show free models here (defaults to yes)
        res.push({
            provider: key as AvailableProviders,
            models: key in userProfile.data ? availableModels : availableModels.filter((e) => e.is_free)
        })
    }

    return res;
})