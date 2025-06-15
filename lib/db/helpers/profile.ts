import { eq } from "drizzle-orm";
import { db } from "..";
import { profile } from "../schemas";

export async function getOrCreateProfile(userId: string) {
    return await db.transaction(async(tx) => {
        const existingProfile = await tx.query.profile.findFirst({where: eq(profile.userId, userId)})
        if (existingProfile) return existingProfile
        const newProfile = await tx.insert(profile).values({
            userId,
            data: {}
        }).onConflictDoNothing().returning()
        return newProfile[0]
    })
}