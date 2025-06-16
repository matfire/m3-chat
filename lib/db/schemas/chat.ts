import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import type { MessageSender, MessageStatus } from "~/lib/types/chat";
import type { AvailableProviders } from "~/lib/providers";
import type { InferSelectModel } from "drizzle-orm";

export const chat = sqliteTable("chat", {
    id: text().primaryKey().$default(() => crypto.randomUUID()),
    title: text(),
    userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
    modelId: text('model_id').notNull(),
    modelProvider: text('model_provider').$type<AvailableProviders>().notNull(),
    createdAt: int('created_at').notNull().$default(() => Date.now()),
    updatedAt: int('updated_at').notNull().$default(() => Date.now()).$onUpdate(() => Date.now())
})

export const message = sqliteTable("message", {
    id: int().primaryKey({autoIncrement:true}),
    chatId: text('chat_id').notNull().references(() => chat.id, {onDelete: 'cascade'}),
    sender: text().$type<MessageSender>().notNull(),
    status: text().$type<MessageStatus>().notNull(),
    content: text(),
    reasoning: text(),
    rendererReasoning: text(),
    rendererContent: text()
})

export type Message = InferSelectModel<typeof message>