import { GET_CHAT_SESSION_MESSAGES } from '@/lib/queries/queries'
import { serverClient } from '@/lib/server/serverClient'
import { GetChatSessionMessagesResponse, GetChatSessionMessagesVariables } from '@/types/types'
import React from 'react'
import Messages from '@/components/Messages'
export const dynamic = "force-dynamic"


interface PageProps {
  params: {
    id: string
  }
}

const Page = async ({ params }: any) => {
  const id = parseInt(params.id)


  const {data:{chat_sessions:{
    id: chatSessionId,
    created_at,
    messages,
    chatbots:{name},
    guests:{name:guestName,email},
  }}} = await serverClient.query<GetChatSessionMessagesResponse,GetChatSessionMessagesVariables>({
    query:GET_CHAT_SESSION_MESSAGES,
    variables:{id}
  })
  
  return (
    <div className='flex-1 p-10 pb-24'>
      <h1 className='text-xl lg:text-3xl font-semibold'>Session Review</h1>
      <h1>
        <p className='font-light text-xs text-gray-400 mt-2'>Started at {new Date(created_at).toLocaleString()}</p>
      </h1>
      <h2 className='font-light mt-2'>
        Between {name} & {" "}
        <span className='font-light mt-2'>
          {guestName} ({email})
        </span>
      </h2>

      <hr className='my-10'/>

      <Messages
        messages={messages}
        chatbotName={name}/>
    </div>
  )
}

export default Page
