import { INSERT_MESSAGE } from "@/lib/mutations/mutations";
import { GET_CHATBOT_BY_ID, GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/lib/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotById, MessagesByChatSessionIdResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Maximum number of previous messages to include in context
const MAX_CONTEXT_MESSAGES = 6; // Keeps last 3 exchanges (user+AI pairs)

export async function POST(req: NextRequest) {
    const { chat_session_id, chatbot_id, content, name } = await req.json();
    try {
        const { data } = await serverClient.query<GetChatbotById>({
            query: GET_CHATBOT_BY_ID,
            variables: { id: chatbot_id }
        });
        const chatbot = data.chatbots;
        if (!chatbot) {
            return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
        }

        const { data: messageData } = await serverClient.query<MessagesByChatSessionIdResponse>({
            query: GET_MESSAGES_BY_CHAT_SESSION_ID,
            variables: { chat_session_id },
            fetchPolicy: "no-cache",
        });

        const previousMessages = messageData.chat_sessions.messages;

        // Limit previous messages to prevent context overflow
        const limitedMessages = previousMessages.slice(-MAX_CONTEXT_MESSAGES);

        const formattedPreviousMessages = limitedMessages.map((message) => ({
            role: message.sender === "ai" ? "assistant" : "user", // Groq uses 'assistant' for AI responses
            name: message.sender === "ai" ? chatbot.name : name,
            content: message.content,
        }));

        const systemPrompt = chatbot.chatbot_characteristics.map((c) => c.content).join(" + ");
        const messages = [
            {
                role: "system",
                content: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in the same scope or domain as the points in mentioned in the key information section, kindly inform the user they're only allowed to search for the specified content. Use Emoji's where possible but don't fill the whole message(using 1-7 emoji per message is fine depending upon the message length). Also if the user ask for creating tables create it it boosts the user interaction(don't create any table that the user ask make sure it stays relevant with the conversation). Here is some key information that you need to be aware of, these are elements you may be asked about: ${systemPrompt}`,
            },
            ...formattedPreviousMessages,
            {
                role: "user",
                name: name,
                content: content,
            },
        ] as Groq.Chat.Completions.ChatCompletionMessageParam[];

        // First store the user's message
        const userMessageResult = await serverClient.mutate({
            mutation: INSERT_MESSAGE,
            variables: {
                chat_session_id,
                content,
                sender: "user",
                created_at: new Date().toISOString()
            }
        });

        const groqResponse = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 500,
        });

        const aiResponse = groqResponse?.choices?.[0]?.message?.content?.trim();
        if (!aiResponse) {
            return NextResponse.json({ error: "Error Failed to generate AI response" }, { status: 500 });
        }

        // Store AI response
        const aiMessageResult = await serverClient.mutate({
            mutation: INSERT_MESSAGE,
            variables: {
                chat_session_id,
                content: aiResponse,
                sender: "ai",
                created_at: new Date().toISOString()
            }
        });

        return NextResponse.json({
            id: aiMessageResult.data.insertMessages.id,
            content: aiResponse,
        });

    } catch (error) {
        console.log("Error sending message", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}