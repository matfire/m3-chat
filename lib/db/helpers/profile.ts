import { eq } from "drizzle-orm";
import { db } from "..";
import { profile } from "../schemas";

export async function getOrCreateProfile(userId: string) {
    const existingProfile = await db.query.profile.findFirst({where: eq(profile.userId, userId)})
    if (existingProfile) return existingProfile
    const newProfile = await db.insert(profile).values({
        userId,
        data: {}
    }).returning()
    return newProfile[0]
}