'use client'

import { useState } from 'react'
import { Upload, Search, Download, AlertCircle } from 'lucide-react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleScan = async () => {
    if (!file) {
      setError('Please select a CSV file first')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Scan failed')
      }

      const data = await response.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ['Company Name', 'Website URL', 'LINE URLs', 'LINE IDs', 'QR Codes', 'Confidence'],
      ...results.map(r => [
        r.name,
        r.url,
        r.lineUrls?.join('; ') || '',
        r.lineIds?.join('; ') || '',
        r.qrCodes?.join('; ') || '',
        r.confidence || '0'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'line-links-results.csv'
    a.click()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">LINE Link Finder</h1>
          <p className="text-gray-600 mb-8">企業のWebサイトから公式LINEアカウントを自動検出</p>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <label className="cursor-pointer">
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  CSVファイルを選択
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  選択済み: {file.name}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleScan}
                disabled={!file || loading}
                className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>処理中...</>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    スキャン開始
                  </>
                )}
              </button>

              {results.length > 0 && (
                <button
                  onClick={handleExport}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Download className="mr-2 h-5 w-5" />
                  CSVエクスポート
                </button>
              )}
            </div>
          </div>

          {results.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">検出結果</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        企業名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        LINE URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        LINE ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        信頼度
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.lineUrls?.length > 0 ? (
                            <a href={result.lineUrls[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {result.lineUrls[0]}
                            </a>
                          ) : (
                            <span className="text-gray-400">未検出</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.lineIds?.join(', ') || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            result.confidence > 0.7 ? 'bg-green-100 text-green-800' :
                            result.confidence > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {Math.round((result.confidence || 0) * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
