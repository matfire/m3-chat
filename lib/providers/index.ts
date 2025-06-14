import { GoogleProvider } from "./google";
import {OpenRouterProvider} from "./openrouter";

export const availableProviders = {
    "openrouter": OpenRouterProvider,
    "google": GoogleProvider
}

export type AvailableProviders = keyof typeof availableProviders;