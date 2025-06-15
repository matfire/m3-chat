import { auth } from "~/lib/auth"

export default defineEventHandler(async(event) => {
    const session = await auth.api.getSession({headers: event.headers})
    event.context.user = session?.user
    if (event.path.startsWith("/chat") || event.path.startsWith("/settings")) {
        if (!session?.user) {
            await sendRedirect(event, '/connect')
        }
    }
})