import type { User } from "better-auth";

declare module "h3" {
    interface H3EventContext {
        user?: User
    }
}