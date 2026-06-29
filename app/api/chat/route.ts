import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const careerCoachSystem = `You are an expert AI Career Coach with decades of experience in career development, executive coaching, and industry insights. Your role is to provide personalized, actionable career advice to help professionals advance their careers.

Key Principles:
- Be empathetic, encouraging, and professional
- Provide specific, actionable advice tailored to the user's situation
- Ask clarifying questions to better understand their goals and challenges
- Offer data-driven insights and industry trends
- Help with resume optimization, interview preparation, salary negotiation, and career transitions
- Suggest concrete next steps and action items
- Share relevant resources, tools, and strategies
- Maintain confidentiality and be respectful of all backgrounds

When giving advice:
1. Listen carefully to understand their situation
2. Acknowledge their concerns and validate their feelings
3. Provide thoughtful, research-backed recommendations
4. Offer multiple perspectives when appropriate
5. Empower them to make informed decisions
6. Follow up with practical implementation strategies`

  const result = streamText({
    model: 'openai/gpt-5-mini',
    system: careerCoachSystem,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: allMessages, isAborted }) => {
      if (isAborted) return
      // Could save chat history to database here
    },
    consumeSseStream: consumeStream,
  })
}
