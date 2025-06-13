import { type } from "arktype";
import { Provider, type ProviderModel } from "./base";

const ModelSchema = type({
    "id": "string",
    "name": "string"
})

export class OpenRouterProvider extends Provider {
    public static override getName(): string {
        return "OpenRouter"
    }
    public static override async getModels(): Promise<ProviderModel[]> {
        const data = await (await fetch("https://openrouter.ai/api/v1/models")).json()
        const models = ModelSchema.array().assert(data.data)
        return models.map((m) => ({
            name: m.name,
            id: m.id,
            is_free: m.id.endsWith(":free")
        }))
    }

    public static override byok(): boolean {
        return true
    }

}