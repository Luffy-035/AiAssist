# 🤖 AiAssist - AI-Powered Customer Support Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://aiassist-bice.vercel.app)


> **Create intelligent AI chatbots that provide instant customer support. Built with Next.js 15, powered by advanced AI, and ready to deploy in minutes.**

---

## 🌟 Overview

AiAssist is a modern, full-stack platform that enables businesses to create and deploy custom AI chatbots for customer support. Train your chatbot with specific knowledge, share a link with customers, and let AI handle conversations intelligently.

**Perfect for:**
- 💼 Customer support automation
- 📚 Knowledge base assistance
- 🎯 Lead qualification
- 💬 24/7 customer engagement

---

## ✨ Key Features

- 🎨 **Custom Chatbot Creation** - Build personalized AI assistants with unique names and avatars
- 🧠 **AI-Powered Conversations** - Intelligent responses using state-of-the-art language models
- 📊 **Session Management** - Track and review all customer conversations
- 🔐 **Secure Authentication** - Protected admin dashboard with Clerk
- 💬 **Guest-Friendly Chat** - No login required for customers
- 📝 **Rich Text Support** - Markdown formatting with tables, lists, and links
- 🎯 **Knowledge Training** - Teach your chatbot specific information and responses
- 🔄 **Real-time Updates** - Instant message delivery and synchronization
- 📱 **Responsive Design** - Beautiful UI on all devices
- 🚀 **One-Click Deploy** - Ready for Vercel deployment
- 🎭 **Unique Avatars** - Auto-generated avatars for each chatbot
- 📈 **Analytics** - Monitor chatbot performance and engagement

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Shadcn/ui** - Beautiful components

### **Backend**
- **GraphQL** - Efficient data fetching
- **PostgreSQL** - Reliable database
- **Clerk** - Authentication

### **AI**
- **Groq SDK** - Ultra-fast AI inference
- **Llama 3.3 70B** - Advanced language model

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Clerk account ([clerk.com](https://clerk.com))
- Groq API key ([groq.com](https://groq.com))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd aihelp
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# GraphQL API
NEXT_PUBLIC_STEPZEN_API_URL=your_stepzen_api_url
STEPZEN_API_KEY=your_stepzen_api_key

# AI
GROQ_API_KEY=your_groq_api_key

# Database (for StepZen)
POSTGRESQL_HOST=your_postgres_host
POSTGRESQL_DATABASE=your_database_name
POSTGRESQL_USER=your_database_user
POSTGRESQL_PASSWORD=your_database_password

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Set up the database**

Run the SQL schema (see `database-schema.sql` or contact for setup)

5. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 💡 Usage

### For Admins

1. **Sign in** to the admin dashboard
2. **Create a chatbot** with a custom name
3. **Add characteristics** - Train your bot with knowledge:
   - "If asked about pricing, visit: www.example.com/pricing"
   - "Our support hours are 9 AM - 5 PM EST"
   - "We offer free shipping on orders over $50"
4. **Copy the chat link** and share with customers
5. **Review sessions** to see all conversations

### For Customers

1. **Click the chat link** shared by the business
2. **Enter name and email** to start chatting
3. **Ask questions** and get instant AI responses
4. **Enjoy** rich formatted answers with tables, lists, and links

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Add all environment variables
   - Click "Deploy"

3. **Update environment**
   - Set `NEXT_PUBLIC_BASE_URL` to your Vercel domain
   - Ensure all API keys are configured

4. **Done!** 🚀 Your chatbot platform is live

---

## 📁 Project Structure

```
aihelp/
├── app/
│   ├── (admin)/              # Admin dashboard pages
│   ├── (guest)/              # Public chat interface
│   └── api/                  # API routes
├── components/               # React components
├── lib/                      # Utilities and helpers
├── types/                    # TypeScript definitions
└── public/                   # Static assets
```

---

## 🎨 Features in Detail

### 🤖 Chatbot Management
- Create unlimited chatbots
- Customize names and avatars
- Update characteristics anytime
- Delete chatbots when needed

### 💬 Intelligent Conversations
- Context-aware AI responses
- Markdown formatting support
- Emoji integration
- Table generation for structured data
- Conversation history tracking

### 📊 Admin Dashboard
- View all chatbots at a glance
- Monitor active sessions
- Review conversation history
- Track customer engagement

### 🔗 Easy Sharing
- One-click link copying
- No customer login required
- Mobile-friendly chat interface
- Instant response times

---

## 🐛 Troubleshooting

### Common Issues

**Database connection failed**
- Verify PostgreSQL credentials in `.env.local`
- Ensure database is running and accessible

**Authentication not working**
- Check Clerk API keys are correct
- Verify environment variables are set

**AI responses not generating**
- Confirm Groq API key is valid
- Check API rate limits

**Build errors**
- Run `npm install` to update dependencies
- Clear `.next` folder and rebuild

---

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Voice chat integration
- [ ] Advanced analytics dashboard
- [ ] Webhook integrations (Slack, Discord)
- [ ] Custom branding options
- [ ] File upload support
- [ ] Sentiment analysis
- [ ] Mobile app (iOS/Android)
- [ ] Team collaboration features
- [ ] CRM integrations

---

## 📄 License

This project is private and proprietary.

---

## 👨‍💻 Author

**Lakshya Agarwal**

Built with ❤️ using Next.js, React, and AI

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Groq](https://groq.com/) - Ultra-fast AI inference
- [Clerk](https://clerk.com/) - Authentication made easy
- [Vercel](https://vercel.com/) - Deployment platform
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful components

---

**⭐ Star this repo if you find it helpful!**
