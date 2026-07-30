'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Copy } from 'lucide-react'

interface ApiKey {
  name: string
  key: string
  required: boolean
  placeholder: string
  description: string
}

const API_KEYS: ApiKey[] = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    key: 'supabaseAnonKey',
    required: true,
    placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'From Supabase → Settings → API → anon public key'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    key: 'supabaseServiceRoleKey',
    required: true,
    placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'From Supabase → Settings → API → service_role secret'
  },
  {
    name: 'BREVO_API_KEY',
    key: 'brevoApiKey',
    required: true,
    placeholder: 'xkeysib-abc123def456...',
    description: 'From Brevo → SMTP & API → API Keys'
  },
  {
    name: 'GITHUB_OAUTH_CLIENT_SECRET',
    key: 'githubSecret',
    required: true,
    placeholder: 'ghp_abc123xyz789...',
    description: 'From GitHub → Settings → Developers → OAuth Apps'
  },
  {
    name: 'EMAIL_FROM',
    key: 'emailFrom',
    required: true,
    placeholder: 'noreply@yourdomain.com',
    description: 'Your sender email domain'
  },
  {
    name: 'BETTER_AUTH_URL',
    key: 'betterAuthUrl',
    required: true,
    placeholder: 'https://v0-careerpilott.vercel.app',
    description: 'Your app URL'
  },
  {
    name: 'BETTER_AUTH_SECRET',
    key: 'betterAuthSecret',
    required: true,
    placeholder: 'fnyk+oc72HY7hcoor11ewFrdMXnfLh1+oyTilWk6f/U=',
    description: 'Already generated'
  },
  {
    name: 'CRON_SECRET',
    key: 'cronSecret',
    required: true,
    placeholder: '9L2zC3wizQL4wq0OGcjM492pbJDKolT2D2YbENp67zM=',
    description: 'Already generated'
  },
  {
    name: 'GITHUB_OAUTH_CLIENT_ID',
    key: 'githubClientId',
    required: false,
    placeholder: 'Ov23liLqD90UyqtYNxhC',
    description: 'From GitHub → Settings → Developers → OAuth Apps (Optional)'
  },
  {
    name: 'LINKEDIN_OAUTH_CLIENT_ID',
    key: 'linkedinClientId',
    required: false,
    placeholder: '868pox7pyjcd8e',
    description: 'From LinkedIn Developers (Optional)'
  },
  {
    name: 'LINKEDIN_OAUTH_CLIENT_SECRET',
    key: 'linkedinSecret',
    required: false,
    placeholder: 'WPL_AP1.TCwA9gTxrjuG5JMO.MqwJeQ==',
    description: 'From LinkedIn Developers (Optional)'
  },
  {
    name: 'GOOGLE_GENERATIVE_AI_API_KEY',
    key: 'googleGenAiKey',
    required: false,
    placeholder: 'AQ.Ab8RN6LxH8EzdQa6xb7OMZXTn_DGQsUOdKhdNEcY6FciQZPKjw',
    description: 'From Google AI Studio (Optional)'
  },
]

export default function ApiKeysForm() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const generateEnvFile = () => {
    const lines = API_KEYS
      .filter(api => values[api.key])
      .map(api => `${api.name}=${values[api.key]}`)
    return lines.join('\n')
  }

  const copyToClipboard = async () => {
    const envContent = generateEnvFile()
    await navigator.clipboard.writeText(envContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const requiredFilled = API_KEYS
    .filter(api => api.required)
    .every(api => values[api.key])

  const totalFilled = Object.values(values).filter(v => v.length > 0).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">API Keys Setup</h1>
          <p className="text-gray-400">Paste your API keys below to generate environment variables</p>
        </div>

        {/* Progress */}
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  {totalFilled} of {API_KEYS.length} keys provided
                </p>
                <p className="text-sm text-gray-400">
                  {API_KEYS.filter(a => a.required && values[a.key]).length} of {API_KEYS.filter(a => a.required).length} required keys
                </p>
              </div>
              {requiredFilled && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Ready to deploy!</span>
                </div>
              )}
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(totalFilled / API_KEYS.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Required Keys */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            Required Keys (8)
          </h2>

          <div className="grid gap-4">
            {API_KEYS.filter(api => api.required).map(api => (
              <Card key={api.key} className="bg-slate-900 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-mono text-blue-300">{api.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{api.description}</CardDescription>
                    </div>
                    {values[api.key] && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <Input
                    type="password"
                    placeholder={api.placeholder}
                    value={values[api.key] || ''}
                    onChange={e => handleChange(api.key, e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Optional Keys */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Optional Keys (4)</h2>

          <div className="grid gap-4">
            {API_KEYS.filter(api => !api.required).map(api => (
              <Card key={api.key} className="bg-slate-900 border-slate-700 opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-mono text-gray-400">{api.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{api.description}</CardDescription>
                    </div>
                    {values[api.key] && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <Input
                    type="password"
                    placeholder={api.placeholder}
                    value={values[api.key] || ''}
                    onChange={e => handleChange(api.key, e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Output */}
        {totalFilled > 0 && (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Ready to Copy
              </CardTitle>
              <CardDescription>Copy and paste into Vercel Environment Variables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-slate-800 border border-slate-600 text-white font-mono text-sm p-4 rounded overflow-auto max-h-48">
                {generateEnvFile()}
              </pre>
              <Button
                onClick={copyToClipboard}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-300">
            <ol className="list-decimal list-inside space-y-2">
              <li>Paste your API keys in the fields above</li>
              <li>Copy the generated environment variables</li>
              <li>Go to Vercel → Project Settings → Environment Variables</li>
              <li>Paste the variables and save</li>
              <li>Redeploy your project</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
