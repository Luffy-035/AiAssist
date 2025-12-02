"use client"
import React, { FormEvent } from 'react'
import { redirect, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Copy } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { BASE_URL } from '@/graphql/apolloClient'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useQuery } from '@apollo/client'
import Avatar from '@/components/Avatar'
import { GET_CHATBOT_BY_ID } from '@/lib/queries/queries'
import { GetChatbotById, GetChatbotByIdVariables } from '@/types/types'
import Characteristic from '@/components/Characteristic'
import { DELETE_CHATBOT, UPDATE_CHATBOT } from '@/lib/mutations/mutations'
import { ADD_CHARACTERISTIC } from '@/lib/mutations/mutations'
import { useMutation } from '@apollo/client'

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const [url, setUrl] = useState<string>('')
  const [newCharacteristics, setNewCharacteristics] = useState<string>('')
  const [chatbotName, setChatbotName] = useState<string>('')

  const { data, loading, error } = useQuery<GetChatbotById, GetChatbotByIdVariables>(GET_CHATBOT_BY_ID, {
    variables: { id }
  })

  const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
    awaitRefetchQueries: true
  })

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  })

  const [updateChatbot] = useMutation(UPDATE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
  })

  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots.name)
    }
  }, [data])

  useEffect(() => {
    const u = `${BASE_URL}/chatbot/${id}`
    setUrl(u)
  }, [id])

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this chatbot?")
    if (!isConfirmed) return
    try {
      const promise = deleteChatbot({ variables: { id } })
      toast.promise(promise, {
        loading: 'Deleting...',
        success: 'Chatbot deleted',
        error: 'An error occurred while deleting chatbot'
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateChatbot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const promise = updateChatbot({
        variables: {
          id: Number(id),
          name: chatbotName
        }
      })

      toast.promise(promise, {
        loading: 'Updating...',
        success: 'Chatbot Name Successfully updated!',
        error: 'An error occurred while updating chatbot'
      })
    } catch (error) {
      console.log(error)
    }

  }


  const handleAddCharacteristic = async (content: string) => {
    try {
      const promise = addCharacteristic({
        variables: {
          chatbotId: Number(id),
          content,
          created_at: new Date().toISOString(),
        }
      })

      toast.promise(promise, {
        loading: 'Adding...',
        success: 'Characteristic added',
        error: 'An error occurred while adding characteristic'
      })

    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return (

      <div className='mx-auto animate-spin p-10'>
        <Avatar seed='One Piece' />
      </div>
    );
  }

  if (!loading && !data?.chatbots) return redirect("/view-chatbots")

  return (
    <div className='px-0 md:p-10'>
      <div className='md:sticky md:top-0 z-50 sm:max-w-sm ml-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2991EE]'>
        <h2 className='text-white text-sm font-bold'>Link to Chat</h2>
        <p className='text-sm italic text-white'>Share this link with your customers to start converstations with yout Chatbot</p>
        <div className='flex items-center space-x-2'>
          <Link href={url} className='w-full cursor-pointer
          hover:opacity-50'>
            <Input value={url} readOnly className='cursor-pointer bg-white' />
          </Link>
          <Button
            size="sm"
            className='px-3'
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success("Copied to Clipboard")
            }}>
            <span className='sr-only'>Copy</span>
            <Copy className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <section className='relative mt-5 bg-white p-5 md:p-10 rounded-lg'>
        <Button variant="destructive" className='absolute top-2 right-2 h-8 w-2' onClick={() => { handleDelete(id) }}>X</Button>
        <div className='flex space-x-4'>
          <Avatar seed={chatbotName} />
          <form
            onSubmit={handleUpdateChatbot}
            className='flex flex-1 space-x-2 items-center'>
            <Input
              value={chatbotName}
              placeholder={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              className='w-full bg-transparent border-none text-xl font-bold'
              required />

            <Button type='submit' disabled={!chatbotName}>
              Update
            </Button>
          </form>

        </div>
        <h2 className='text-xl font-bold mt-10'>Here's what your AI knows...</h2>
        <p>Your chatbot is equipped with the following information to assist you
          in your conversations with your customers and users
        </p>
        <div className='bg-gray-200 p-5 md:p-5 rounded-md mt-5'>
          <form className='flex space-x-2 mb-5' onSubmit={(e) => {
            e.preventDefault();
            handleAddCharacteristic(newCharacteristics);
            setNewCharacteristics('');
          }}>
            <Input
              type='text'
              placeholder='Example: If customer asks for prices, provide pricing page: www.example.com/pricing'
              value={newCharacteristics}
              onChange={(e) => { setNewCharacteristics(e.target.value) }} />
            <Button type='submit' disabled={!newCharacteristics}>Add</Button>
          </form>
          <ul className='flex flex-wrap-reverse gap-5'>
            {data?.chatbots?.chatbot_characteristics?.map((characteristics) => (
              <Characteristic key={characteristics.id} characteristic={characteristics} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Page
