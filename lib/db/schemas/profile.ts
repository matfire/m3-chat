import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const profile = sqliteTable("profile", {
    id: text().primaryKey().$default(() => crypto.randomUUID()),
    userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
    data: text({mode:"json"}).$type<Record<string, string>>()
})