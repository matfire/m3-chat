import { eq } from "drizzle-orm"
import { db } from "~/lib/db"
import { getOrCreateProfile } from "~/lib/db/helpers/profile"
import { profile } from "~/lib/db/schemas"

export default defineEventHandler(async(event) => {
    if (!event.context.user) throw Error("unauthorized")
    const pro = await getOrCreateProfile(event.context.user.id)
    return pro
})