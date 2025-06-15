import { eq } from "drizzle-orm"
import { z } from "zod/v4"
import { db } from "~/lib/db"
import { getOrCreateProfile } from "~/lib/db/helpers/profile"
import { profile } from "~/lib/db/schemas"
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler"

const requestData = z.object({
    profileId: z.string(),
    keys: z.record(z.string(), z.string())
})

export default defineAuthenticatedEventHandler(async (event) => {
    const data = requestData.parse(await readBody(event))
    const userProfile = await getOrCreateProfile(event.context.user.id)
    if (!userProfile) throw Error("profile not found")
    await db.update(profile).set({data: data.keys}).where(eq(profile.id, userProfile.id))
    return;
})