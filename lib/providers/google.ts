import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Provider, type ProviderModel } from "./base"
import env from "../env";
import type { LanguageModelV1 } from "ai";

export class GoogleProvider extends Provider {
    public static override getName(): string {
        return "Google"
    }
    public static override async getModels(): Promise<ProviderModel[]> {
        return [
            {
                id: 'gemini-2.0-flash',
                name: 'Gemini Flash',
                is_free: true
            }
        ]
    }

    public static override byok(): boolean {
        return false
    }

    public static override getProvider(modelId: string): LanguageModelV1 {
        return createGoogleGenerativeAI({
            apiKey: env.GOOGLE_API_KEY
        })(modelId);
    }
}