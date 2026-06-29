'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wand2, Send, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function CareerCoachPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hi! I\'m your AI Career Coach. How can I help you today?' },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }])
      setInput('')
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'That\'s a great question! Based on your profile, I recommend focusing on...',
          },
        ])
      }, 500)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-2">
          <Wand2 className="text-purple-500" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Career Coach</h1>
            <p className="text-muted-foreground">Get personalized career guidance</p>
          </div>
        </div>
      </motion.div>

      {/* Chat */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 space-y-4 h-96 lg:h-[32rem] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-primary text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Input
              placeholder="Ask me anything about your career..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="bg-muted/50"
            />
            <Button onClick={handleSend} className="bg-gradient-primary">
              <Send size={18} />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Suggestions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Suggested Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'How to negotiate salary?',
              'Interview preparation tips',
              'Career transition advice',
              'Skill development plan',
            ].map((topic) => (
              <button
                key={topic}
                onClick={() => setInput(topic)}
                className="p-3 rounded-lg bg-muted hover:bg-muted/80 text-sm text-muted-foreground hover:text-foreground transition-colors text-left flex items-center gap-2"
              >
                <MessageCircle size={16} />
                {topic}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
