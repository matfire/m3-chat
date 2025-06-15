import { z } from "zod/v4";
import { Provider, type ProviderModel } from "./base";
import type { LanguageModelV1 } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import env from "../env";

const ModelSchema = z.object({
    "id": z.string(),
    "name": z.string()
})

export class OpenRouterProvider extends Provider {
    public static override getName(): string {
        return "OpenRouter"
    }
    public static override async getModels(): Promise<ProviderModel[]> {
        const data = await (await fetch("https://openrouter.ai/api/v1/models")).json()
        const models = ModelSchema.array().parse(data.data)
        return models.map((m) => ({
            name: m.name,
            id: m.id,
            is_free: m.id.endsWith(":free")
        }))
    }

    public static override byok(): boolean {
        return true
    }

    public static override getProvider(modelId: string, providerKey = env.OPENROUTER_API_KEY): LanguageModelV1 {
        return createOpenRouter({
            apiKey: providerKey,
        })(modelId)
    }

}