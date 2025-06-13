import Pusher from "pusher-js"

export const usePusher = () => {

    const runtimeConfig = useRuntimeConfig()
    const transports = []
    if (runtimeConfig.public.pusherSecure) {
        transports.push("wss")
    } else {
        transports.push("ws")
    }

    const pusher = new Pusher(runtimeConfig.public.pusherKey, {
        wsHost: runtimeConfig.public.pusherHost,
        wsPort: parseInt(runtimeConfig.public.pusherPort),
        forceTLS: runtimeConfig.public.pusherSecure,
        enabledTransports: transports,
        cluster: runtimeConfig.public.pusherCluster,
    });

    return pusher
}