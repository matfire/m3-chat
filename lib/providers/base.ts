import type { LanguageModelV1 } from "ai";

export interface ProviderModel {
    id: string;
    name: string;
    is_free: boolean
}


export abstract class Provider {
    public static getName(): string {
        throw new Error("getName is not implemented")
    }

    public static getModels(): Promise<ProviderModel[]> {
        throw new Error("getModels is not implemented")
    }

    public static byok(): boolean {
        throw new Error("byok is not implemented")
    }

    public static getProvider(modelId: string, providerKey:string): LanguageModelV1 {
        throw new Error("getProvider not implemented")
    }
}