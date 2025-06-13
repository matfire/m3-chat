import { authClient } from "~/lib/auth-client"

export const useAuthStore = defineStore('authStore', () => {
    const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null)
    const clientLoading = ref(false)

    async function init() {
        const data = await authClient.useSession(useFetch)
        session.value = data 
    }
    const user = computed(() => session.value?.data?.user)
    const loading = computed(() => session.value?.isPending || clientLoading.value)
    const signOut = async() => {
        await authClient.signOut()
        navigateTo("/login")
    }
    const signInSocial = async(name: "google" | "github") => {
        clientLoading.value = true
        await authClient.signIn.social({provider: name, callbackURL: '/chat'})
    }
    return {loading, user, signOut, init, signInSocial}
})