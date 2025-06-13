export const useChatStore = defineStore("chatsStore", () => {
    const loading = ref(false)

    const setIsLoading = (v: boolean) => loading.value = v

    return {loading, setIsLoading}
})