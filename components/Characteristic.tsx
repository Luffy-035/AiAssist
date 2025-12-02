"use client"
import { ChatbotCharacteristic } from '@/types/types'
import { OctagonX } from 'lucide-react'
import { useMutation } from '@apollo/client'
import React from 'react'
import { REMOVE_CHARACTERISTIC } from '@/lib/mutations/mutations'
import { toast } from 'sonner'

const Characteristic = ({characteristic}:{characteristic:ChatbotCharacteristic}) => {

  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC,{
      refetchQueries: ["GetChatbotById"]
  })
  const handleRemoveCharacteristic = async ()=>{
    try {
      await removeCharacteristic({
        variables:{
          characterisitcId: characteristic.id
        }
      })
    } catch (error) {
      console.log(error)
    }

  }


  return (
    <li key={characteristic.id} className='relative p-10 bg-white border rounded-md'>
        {characteristic.content}

        <OctagonX onClick={()=>{
          const promise = handleRemoveCharacteristic();
          toast.promise(promise,{
            loading: 'Removing...',
            success: 'Characteristic removed',
            error: 'An error occurred while removing characteristic'
          })
        }} className='w-6 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50'/>
    </li>
  )
}

export default Characteristic
