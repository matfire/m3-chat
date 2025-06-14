import Pusher from "pusher-js"
import type { Transport } from "pusher-js/types/src/core/config"

export const usePusher = () => {
    const client = useState("pusher_client_instance", () => {
    const runtimeConfig = useRuntimeConfig()
    const transports: Transport[] = []
    if (runtimeConfig.public.pusherSecure) {
        transports.push("wss")
    } else {
        transports.push("ws")
    }

    const pusher = new Pusher(runtimeConfig.public.pusherKey, {
        wsHost: runtimeConfig.public.pusherHost ?? undefined,
        wsPort: runtimeConfig.public.pusherPort ? parseInt(runtimeConfig.public.pusherPort) : undefined,
        forceTLS: process.env.NUXT_PUBLIC_PUSHER_SECURE === "true",
        //enabledTransports: transports,
        cluster: runtimeConfig.public.pusherCluster,
        authEndpoint: '/api/pusher/auth'
    });
    return pusher
    })

    return client.value
}