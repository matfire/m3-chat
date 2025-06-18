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
        return [
            {
                id: "google/gemma-3-12b-it:free",
                name: "Gemma 3 12B",
                is_free: true
            },
            {
                id: "meta-llama/llama-4-maverick:free",
                name: "LLama 4 Maverick",
                is_free: true
            },
            {
                id: "google/gemini-2.5-flash",
                name: "Gemini 2.5 Flash",
                is_free: false
            },
            {
                id: "google/gemini-2.5-pro",
                name: "Gemini 2.5 Pro",
                is_free: false
            },
            {
                id: "openai/o4-mini",
                name: "o4 Mini",
                is_free: false
            },
            {
                id: "mistralai/magistral-small-2506",
                name: "Magistral Small",
                is_free: false
            },
            {
                id: "openai/o3-mini",
                name: "o3 Mini",
                is_free: false
            },
            {
                id: "anthropic/claude-3.7-sonnet:thinking",
                name: "Claude 3.7 Sonnet",
                is_free: false
            }
        ]
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