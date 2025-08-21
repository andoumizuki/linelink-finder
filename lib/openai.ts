import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function detectLINELinksWithAI(content: string): Promise<{
  lineUrls: string[]
  lineIds: string[]
  confidence: number
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at finding LINE official account information from website content. 
          Look for:
          - LINE URLs (lin.ee, line.me, etc.)
          - LINE IDs (starting with @)
          - Text mentioning LINE official accounts
          - QR code references
          Return results in JSON format.`
        },
        {
          role: 'user',
          content: `Find all LINE official account information in this content:\n\n${content.substring(0, 8000)}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    
    return {
      lineUrls: result.lineUrls || [],
      lineIds: result.lineIds || [],
      confidence: result.confidence || 0
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      lineUrls: [],
      lineIds: [],
      confidence: 0
    }
  }
}

export { openai }