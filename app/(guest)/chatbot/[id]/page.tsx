"use client"
import { useParams } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useRef, useState } from "react" // Added useRef
import { GetChatbotById, Message, MessagesByChatSessionIdResponse, MessagesByChatSessionIdVariables } from "@/types/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { startNewChat } from "@/lib/startNewChat"
import Avatar from "@/components/Avatar"
import { useQuery } from "@apollo/client"
import { GET_CHATBOT_BY_ID, GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/lib/queries/queries"
import Messages from "@/components/Messages"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, useForm, FormProvider } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  message: z.string().min(2, "Your message is too short!"),
})

const Page = () => {
  const params = useParams()
  const { id } = params
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isOpen, setIsOpen] = useState(true)
  const [chatId, setChatId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const { data: chatBotData } = useQuery<GetChatbotById>(GET_CHATBOT_BY_ID, {
    variables: { id }
  })

  // Ref for the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ""
    }
  })

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      // Smooth scroll to the bottom
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // Add smooth scrolling
      });
    }
  }, [messages]) // Triggered whenever messages are updated

  const handleInformationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const chatId = await startNewChat(name, email, Number(id))

    setLoading(false)
    setIsOpen(false)
    setChatId(chatId)
  }

  const { loading: loadingQuery, error, data } = useQuery<MessagesByChatSessionIdResponse, MessagesByChatSessionIdVariables>(GET_MESSAGES_BY_CHAT_SESSION_ID, {
    variables: { chat_session_id: chatId },
    skip: !chatId,
  });

  useEffect(() => {
    if (data) {
      setMessages(data.chat_sessions.messages)
    }
  }, [data])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    const { message: formMessage } = values

    const message = formMessage
    form.reset()
    if (!email || !name) {
      setIsOpen(true)
      setLoading(false)
      return;
    }

    if (!message.trim()) {
      return
    }

    const userMessage: Message = {
      id: Date.now(),
      content: message,
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "user"
    }

    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: "Thinking...",
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "ai"
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      loadingMessage
    ])

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          chat_session_id: chatId,
          chatbot_id: id,
          content: message,
        }),
      });

      const result = await response.json();

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: result.content, id: result.id }
            : msg
        )
      )

    } catch (error) {
      console.log("Error sending message", error)
    }
  }

  return (
    <div className="w-full flex bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleInformationSubmit}>
            <DialogHeader>
              <DialogTitle>Lets help you out!</DialogTitle>
              <DialogDescription>
                Just need a few details to get you started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value) }}
                  placeholder="Lakshya Agarwal"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Email
                </Label>
                <Input
                  id="name"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value) }}
                  placeholder="lakshya@example.com"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!name || !email || loading}>
                {loading ? "Loading..." : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
        <div className="pb-4 border-b sticky top-0 z-50 bg-[#4D7DFB] py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4">
          <Avatar
            seed={chatBotData?.chatbots.name ?? "Lakshya Agarwal"}
            className="h-12 w-12 bg-white rounded-full border-2 border-white"
          />
          <div>
            <h1 className="truncate text-lg">{chatBotData?.chatbots.name}</h1>
            <p className="text-sm text-gray-300">
              ⚡︎ Typically replies Instantly
            </p>
          </div>
        </div>

        {/* Chat container with ref */}
        <div
          ref={chatContainerRef}
          className="overflow-y-auto h-[calc(100vh-200px)] p-4"
        >
          <Messages
            messages={messages}
            chatbotName={chatBotData?.chatbots.name ?? "Lakshya Agarwal"}
          />
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start sticky bottom-0 z-50 space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-md">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel hidden>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type a message..."
                      {...field}
                      className="p-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting || !form.formState.isValid} type="submit" className="h-full">Send</Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default Page