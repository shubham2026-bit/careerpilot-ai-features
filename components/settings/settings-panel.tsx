'use client'

import { useState, useEffect } from 'react'
import { getUserSettings, initializeUserSettings, updateUserSettings } from '@/app/actions/settings-actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Bell, Lock, Globe, Database, LogOut, Save, Loader2 } from 'lucide-react'

export function SettingsPanel() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('notifications')

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      setLoading(true)
      let data = await getUserSettings()
      if (!data) {
        data = await initializeUserSettings()
      }
      setSettings(data)
    } catch (error) {
      console.error('[v0] Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      await updateUserSettings(settings)
      await loadSettings()
    } catch (error) {
      console.error('[v0] Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = (key: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSelect = (key: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Loading settings...</p>
      </Card>
    )
  }

  if (!settings) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Failed to load settings</p>
      </Card>
    )
  }

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'data', label: 'Data', icon: Database },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 border-b border-border overflow-x-auto"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <SettingToggle
                  label="Email Notifications"
                  description="Receive email updates about your career"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
                <SettingToggle
                  label="Career Tips"
                  description="Get personalized career improvement tips"
                  checked={settings.careerTips}
                  onChange={() => handleToggle('careerTips')}
                />
                <SettingToggle
                  label="Job Alerts"
                  description="Receive notifications for matching job opportunities"
                  checked={settings.jobAlerts}
                  onChange={() => handleToggle('jobAlerts')}
                />
                <SettingToggle
                  label="Weekly Digest"
                  description="Get a weekly summary of your progress"
                  checked={settings.weeklyDigest}
                  onChange={() => handleToggle('weeklyDigest')}
                />
              </div>
            </Card>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <SettingToggle
                  label="Private Profile"
                  description="Your profile is only visible to you"
                  checked={settings.privateProfile}
                  onChange={() => handleToggle('privateProfile')}
                />
                <SettingToggle
                  label="Data Collection"
                  description="Allow anonymous usage data collection to improve the app"
                  checked={settings.dataCollection}
                  onChange={() => handleToggle('dataCollection')}
                />
              </div>
            </Card>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Appearance & Language</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Theme</label>
                  <div className="flex gap-2">
                    {['light', 'dark', 'system'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleSelect('theme', theme)}
                        className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                          settings.theme === theme
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSelect('language', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Data & Storage</h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Storage Used:</strong> ~12 MB
                  </p>
                </div>
                <Button variant="outline" className="w-full text-sm">
                  Download My Data
                </Button>
                <Button variant="destructive" className="w-full text-sm">
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        )}
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-end gap-2 pt-4 border-t"
      >
        <Button variant="outline" onClick={() => loadSettings()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
