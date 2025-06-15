import { eq } from "drizzle-orm"
import { db } from "~/lib/db"
import { getOrCreateProfile } from "~/lib/db/helpers/profile"
import { profile } from "~/lib/db/schemas"
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler"

export default defineAuthenticatedEventHandler(async(event) => {
    const pro = await getOrCreateProfile(event.context.user.id)
    return pro
})