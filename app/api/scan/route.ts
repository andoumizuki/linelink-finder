import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { scrapeWebsite } from '@/lib/scraper'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const text = await file.text()
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      bom: true
    })

    const results = []
    const batchSize = 3
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, Math.min(i + batchSize, records.length))
      
      const batchResults = await Promise.all(
        batch.map(async (record: any) => {
          const url = record.URL || record.url || record['URL'] || ''
          const name = record['店舗名'] || record.name || record['Company Name'] || ''
          
          if (!url || !url.startsWith('http')) {
            return {
              name,
              url,
              lineUrls: [],
              lineIds: [],
              qrCodes: [],
              confidence: 0,
              error: 'Invalid or missing URL'
            }
          }

          try {
            const scrapeResult = await scrapeWebsite(url)
            return {
              name,
              ...scrapeResult
            }
          } catch (error) {
            return {
              name,
              url,
              lineUrls: [],
              lineIds: [],
              qrCodes: [],
              confidence: 0,
              error: error instanceof Error ? error.message : 'Scraping failed'
            }
          }
        })
      )
      
      results.push(...batchResults)
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60