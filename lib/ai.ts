import { generateText, streamText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

import env from './env';
import type { MessageSender } from './types/chat';
import { availableProviders, type AvailableProviders } from './providers';

const threadTitleModel = "google/gemma-3n-e4b-it:free"

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});


export const generateChatTitle = async(initialMessage:string) => {
    const {text} = await generateText({model: openrouter(threadTitleModel), prompt: `
            You are an expert at crafting concise and engaging thread titles.
                Your task is to generate a thread title based on the following initial message.

                The title should be:
                - **Concise:** No more than 10 words.
                - **Clear:** Immediately convey the main topic or question.
                - **Engaging:** Encourage clicks and further discussion.
                - **Relevant:** Directly reflect the content of the initial message.

                Initial Message:
                """
                ${initialMessage}
                """
            Only return your idea of a thread title and nothing else
        `})
    return text
}

interface Message {
    sender: MessageSender,
    content: string | null
}

export const generateMessage = async(messageHistory: Message[], modelId: string, provider: AvailableProviders = 'openrouter') => {
    
    const {textStream} = streamText({
        model: availableProviders[provider].getProvider(modelId),
        messages: messageHistory.map((e) => ({
            content: e.content,
            role: e.sender
        }))
    })
    return textStream
}