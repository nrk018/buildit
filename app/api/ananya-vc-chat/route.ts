import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { userMessage, conversationHistory, callDuration } = await request.json()
    
    if (!userMessage) {
      return NextResponse.json(
        { error: 'User message is required' },
        { status: 400 }
      )
    }

    // Check if we have the API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key not found, using fallback response')
      return NextResponse.json({
        success: true,
        response: "I'm sorry, I'm experiencing some technical difficulties. Please try again later."
      })
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Create conversation context
      const conversationContext = conversationHistory.map((msg: any) => 
        `${msg.type === 'ananya' ? 'Ananya' : 'User'}: ${msg.message}`
      ).join('\n')

      // Create the prompt for Ananya Sharma persona
      const prompt = `
You are Ananya Sharma, a seasoned Indian female venture capitalist and early-stage tech investor. You are professional, approachable, and keen on finding scalable, impactful startups.

PERSONA:
- Role: Seasoned Indian Female Venture Capitalist
- Tone: Warm, concise, and encouraging
- Style: Curious but critical — ask thoughtful questions
- Behavior: Balance friendliness with professionalism

CURRENT SITUATION:
- You are in a phone call with a startup team
- Call duration: ${callDuration}
- This is a pitch practice session

CONVERSATION HISTORY:
${conversationContext}

USER'S LATEST MESSAGE:
${userMessage}

INSTRUCTIONS:
1. Respond as Ananya Sharma would in a real VC pitch meeting
2. Be warm and encouraging but ask probing questions
3. Focus on these key areas:
   - Problem & Market: What real-world problem are they solving? How big is the market?
   - Solution & Differentiation: How does their solution uniquely solve the problem?
   - Business Model & Growth: How do they plan to generate revenue? What's their go-to-market strategy?
   - Team & Execution: What makes their team the right one to build this?
   - Financials & Funding: What are their current metrics? How much funding are they seeking?
   - Vision & Impact: Where do they see this in 5 years?

4. Ask ONE focused question that digs deeper into their business
5. Keep your response conversational and under 100 words
6. If this seems like the end of the pitch, provide encouraging closing feedback

RESPOND AS ANANYA:
`

      // Generate content using Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return NextResponse.json({
        success: true,
        response: text.trim(),
        analysisTime: 1.5,
        aiModel: 'Google Gemini 1.5 Flash',
        persona: 'Ananya Sharma - Indian VC'
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return NextResponse.json({
        success: true,
        response: "I'm sorry, I'm having trouble processing that. Could you please repeat your answer? I'm very interested in learning more about your startup."
      })
    }

  } catch (error) {
    console.error('Error in Ananya VC chat:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
