"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Settings, ArrowLeft, Plus, X } from "lucide-react"

// Import UI components
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

// Let's use a simpler layout until we resolve the Card component issue
export default function SettingsPage() {
  // ... (previous state and form setup remains the same)

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                <h1 className="text-2xl font-bold">
                  Notification Settings
                </h1>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.location.href = '/'}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Form
              </Button>
            </div>
            <p className="text-gray-500">
              Configure email and notification preferences for maintenance requests
            </p>
          </div>

          {/* Form Content */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Primary Email */}
              <FormField
                control={form.control}
                name="primaryEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="primary@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Main email address for receiving maintenance requests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Notifications Toggle */}
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Email Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive notifications via email
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* WhatsApp Notifications Toggle */}
              <FormField
                control={form.control}
                name="whatsappNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        WhatsApp Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive notifications via WhatsApp
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* WhatsApp Number (Conditional) */}
              {form.watch("whatsappNotifications") && (
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the WhatsApp number with country code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Notification Frequency */}
              <FormField
                control={form.control}
                name="notificationFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Summary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often you want to receive notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" size="lg">
                  Save Settings
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  )
}