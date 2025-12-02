import client from "@/graphql/apolloClient"
import { INSERT_CHAT_SESSION, INSERT_GUEST, INSERT_MESSAGE } from "./mutations/mutations"

export const startNewChat = async (guestName:string,guestEmail:string,chatbotId:number) => {
    try {
        const guestResult = await client.mutate({
            mutation:INSERT_GUEST,
            variables:{name:guestName,email:guestEmail,created_at: new Date().toISOString()}
            
        })
        const guestId = guestResult.data.insertGuests.id;
        const chatSessionResult = await client.mutate({
            mutation: INSERT_CHAT_SESSION,
            variables:{
                chatbot_id:chatbotId,
                guest_id:guestId,
                created_at: new Date().toISOString()
            }
        })
        const chatSessionId = chatSessionResult.data.insertChat_sessions.id;
        await client.mutate({
            mutation:INSERT_MESSAGE,
            variables:{
                chat_session_id: chatSessionId,
                sender:"ai",
                content:`Welcome ${guestName}!\n How can i assist you today?😊`,
                created_at: new Date().toISOString()
            }
        })
        return chatSessionId
    } catch (error) {
        console.log("Error creating chat,",error)
    }

}