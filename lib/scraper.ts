// import { chromium } from 'playwright' // Temporarily disabled for deployment
import * as cheerio from 'cheerio'
import { detectLINELinksWithAI } from './openai'

export interface ScrapeResult {
  url: string
  lineUrls: string[]
  lineIds: string[]
  qrCodes: string[]
  confidence: number
  error?: string
}

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  // Try with Playwright first for dynamic content
  let usePlaywright = false // Disabled for Render deployment
  let browser = null
  
  try {
    if (usePlaywright) {
      try {
        browser = await chromium.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        
        const context = await browser.newContext({
          userAgent: 'LINE-Link-Finder/1.0 (Compatible; Company Scanner)'
        })
        
        const page = await context.newPage()
        await page.goto(url, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        })
        
        const content = await page.content()
        await browser.close()
        
        return await extractLineInfo(content, url)
      } catch (playwrightError) {
        console.log('Playwright failed, falling back to fetch:', playwrightError)
        if (browser) await browser.close()
        usePlaywright = false
      }
    }
    
    // Fallback to simple fetch
    if (!usePlaywright) {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'LINE-Link-Finder/1.0 (Compatible; Company Scanner)'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const html = await response.text()
      return await extractLineInfo(html, url)
    }
    
    throw new Error('Failed to fetch website')
  } catch (error) {
    return {
      url,
      lineUrls: [],
      lineIds: [],
      qrCodes: [],
      confidence: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function extractLineInfo(html: string, url: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html)
  
  // Pattern-based detection
  const lineUrls: Set<string> = new Set()
  const lineIds: Set<string> = new Set()
  const qrCodes: Set<string> = new Set()
  
  // Find LINE URLs
  $('a[href*="lin.ee"], a[href*="line.me"], a[href*="line.naver.jp"]').each((_, el) => {
    const href = $(el).attr('href')
    if (href) lineUrls.add(href)
  })
  
  // Find LINE IDs in text
  const bodyText = $('body').text()
  const lineIdPattern = /@[a-zA-Z0-9_-]{3,}/g
  const matches = bodyText.match(lineIdPattern) || []
  matches.forEach(id => {
    if (id.toLowerCase().includes('line') || 
        bodyText.toLowerCase().includes('line') && bodyText.includes(id)) {
      lineIds.add(id)
    }
  })
  
  // Find QR code images
  $('img[src*="qr"], img[alt*="QR"], img[alt*="LINE"]').each((_, el) => {
    const src = $(el).attr('src')
    if (src) {
      try {
        const absoluteUrl = new URL(src, url).href
        qrCodes.add(absoluteUrl)
      } catch (e) {
        // Invalid URL, skip
      }
    }
  })
  
  // AI-based detection for better accuracy
  let aiConfidence = 0
  try {
    const aiResult = await detectLINELinksWithAI(bodyText.substring(0, 5000))
    aiResult.lineUrls.forEach(url => lineUrls.add(url))
    aiResult.lineIds.forEach(id => lineIds.add(id))
    aiConfidence = aiResult.confidence
  } catch (aiError) {
    console.error('AI detection failed:', aiError)
  }
  
  return {
    url,
    lineUrls: Array.from(lineUrls),
    lineIds: Array.from(lineIds),
    qrCodes: Array.from(qrCodes),
    confidence: aiConfidence || (lineUrls.size > 0 || lineIds.size > 0 ? 0.7 : 0.2)
  }
}