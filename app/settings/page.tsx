'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { UserSettings } from '@/lib/types';

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    defaultCurrency: 'USD',
    emailNotifications: true,
    renewalAlertDays: 7,
    theme: 'system',
  });
  
  const handleInputChange = (field: keyof UserSettings, value: any) => {
    setSettings({ ...settings, [field]: value });
  };
  
  const handleSave = () => {
    // In a real app, this would save to a database
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated.',
    });
  };
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your experience
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure your default preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <select
                id="currency"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={settings.defaultCurrency}
                onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="renewalAlerts">Renewal Alert Days</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="renewalAlerts"
                  type="number"
                  min={1}
                  max={30}
                  value={settings.renewalAlertDays}
                  onChange={(e) => handleInputChange('renewalAlertDays', parseInt(e.target.value, 10))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">
                  days before renewal
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how AshSubTracker looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Theme Preference</Label>
              <RadioGroup
                value={settings.theme}
                onValueChange={(value) => handleInputChange('theme', value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="font-normal">
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="font-normal">
                    Dark
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="font-normal">
                    System
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>
              Manage your data and export options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Export Data</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Export as CSV
                </Button>
                <Button variant="outline" size="sm">
                  Export as JSON
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Export all your expense data for backup or analysis
              </p>
            </div>
            
            <div className="space-y-3">
              <Label>Data Storage</Label>
              <p className="text-sm text-muted-foreground">
                All your data is stored locally in your browser. No data is sent to any servers.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Account Type</Label>
              <p className="text-sm">Free Plan</p>
              <div className="flex gap-2">
                <Button className="w-full">
                  Upgrade to Pro
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Pro Features:</h4>
              <ul className="text-sm text-muted-foreground">
                <li>• Unlimited expense tracking</li>
                <li>• Email notifications</li>
                <li>• Advanced optimization suggestions</li>
                <li>• Data export options</li>
                <li>• API integrations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}