import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { videoType, videoPrompt, videoDuration, videoStyle, problemData, context } = await request.json()
    
    if (!videoType || !videoPrompt) {
      return NextResponse.json(
        { error: 'Video type and prompt are required' },
        { status: 400 }
      )
    }

    // Check if we have the VEO3 API key
    if (!process.env.GOOGLE_VEO3_API_KEY) {
      console.warn('Google VEO3 API key not found, using fallback video generation')
      return await fallbackVideoGeneration(videoType, videoPrompt, videoDuration, videoStyle, problemData)
    }

    try {
      // Create enhanced prompt for VEO3 based on startup context and problem data
      const enhancedPrompt = createStartupVideoPrompt(videoType, videoPrompt, videoDuration, videoStyle, problemData)
      
      // Call VEO3 API
      const response = await fetch('https://api.veo3.google.com/v1/videos/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GOOGLE_VEO3_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          duration: videoDuration,
          style: videoStyle,
          aspect_ratio: '16:9',
          quality: 'high',
          context: 'startup_business'
        })
      })

      if (!response.ok) {
        throw new Error(`VEO3 API error: ${response.status}`)
      }

      const data = await response.json()
      
      return NextResponse.json({
        success: true,
        videoUrl: data.video_url,
        videoId: data.video_id,
        generationTime: data.generation_time,
        prompt: enhancedPrompt,
        aiModel: 'Google DeepMind VEO3'
      })

    } catch (veo3Error) {
      console.error('VEO3 API error:', veo3Error)
      return await fallbackVideoGeneration(videoType, videoPrompt, videoDuration, videoStyle, problemData)
    }

  } catch (error) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    )
  }
}

// Create enhanced prompt for startup videos
function createStartupVideoPrompt(videoType: string, userPrompt: string, duration: number, style: string, problemData: any[]) {
  const baseContext = "Create a professional startup video that showcases a business solution. "
  
  let typeSpecificPrompt = ""
  let problemContext = ""
  
  // Add problem context if available
  if (problemData && problemData.length > 0) {
    const mainProblem = problemData[0]
    problemContext = `The startup addresses this problem: "${mainProblem.title}" - ${mainProblem.description}. `
  }
  
  // Type-specific prompts for startup videos
  switch (videoType) {
    case 'problem-explanation':
      typeSpecificPrompt = "Show the problem clearly with before/after scenarios, highlighting pain points and inefficiencies. "
      break
    case 'solution-demo':
      typeSpecificPrompt = "Demonstrate the solution in action, showing how it works and its benefits. "
      break
    case 'pitch-deck':
      typeSpecificPrompt = "Create a compelling pitch video with key metrics, market opportunity, and value proposition. "
      break
    case 'product-showcase':
      typeSpecificPrompt = "Showcase the product features, user interface, and key capabilities. "
      break
    case 'customer-testimonial':
      typeSpecificPrompt = "Create a testimonial-style video showing satisfied customers and their success stories. "
      break
    case 'market-analysis':
      typeSpecificPrompt = "Present market data, trends, and opportunities with charts and visualizations. "
      break
    case 'team-introduction':
      typeSpecificPrompt = "Introduce the founding team, their expertise, and company culture. "
      break
    case 'brand-story':
      typeSpecificPrompt = "Tell the brand story, mission, vision, and what drives the company. "
      break
    default:
      typeSpecificPrompt = "Create a professional business video that effectively communicates the startup's value. "
  }
  
  // Style-specific instructions
  let styleInstructions = ""
  switch (style) {
    case 'professional':
      styleInstructions = "Use corporate colors, clean typography, and professional presentation style. "
      break
    case 'modern-tech':
      styleInstructions = "Use modern tech aesthetics with gradients, animations, and contemporary design elements. "
      break
    case 'minimalist':
      styleInstructions = "Keep it clean and minimal with lots of white space and simple graphics. "
      break
    case 'dynamic':
      styleInstructions = "Use energetic transitions, bold colors, and dynamic movement. "
      break
    case 'documentary':
      styleInstructions = "Use documentary-style footage with real people and authentic settings. "
      break
    case 'animated':
      styleInstructions = "Use animated illustrations, icons, and motion graphics. "
      break
  }
  
  // Duration-specific instructions
  const durationInstructions = `Keep the video concise and engaging for ${duration} seconds. `
  
  return `${baseContext}${problemContext}${typeSpecificPrompt}${styleInstructions}${durationInstructions}User's specific request: ${userPrompt}`
}

// Fallback video generation when VEO3 API is not available
async function fallbackVideoGeneration(videoType: string, userPrompt: string, duration: number, style: string, problemData: any[]) {
  // Simulate video generation delay
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Create a mock video URL (in real implementation, this would be a placeholder or demo video)
  const mockVideoUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
  
  return NextResponse.json({
    success: true,
    videoUrl: mockVideoUrl,
    videoId: `mock_${Date.now()}`,
    generationTime: 3.2,
    prompt: createStartupVideoPrompt(videoType, userPrompt, duration, style, problemData),
    aiModel: 'Fallback Video Generation (VEO3 API not available)',
    note: 'This is a demo video. In production, this would be generated by VEO3.'
  })
}
