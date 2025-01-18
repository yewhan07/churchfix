"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Settings, ArrowLeft, Plus, X } from "lucide-react"
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const settingsFormSchema = z.object({
  primaryEmail: z.string().email("Please enter a valid email address"),
  ccEmails: z.array(z.string().email("Please enter a valid email address")),
  emailNotifications: z.boolean().default(true),
  whatsappNotifications: z.boolean().default(false),
  whatsappNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid WhatsApp number")
    .optional(),
  notificationFrequency: z.enum(["instant", "hourly", "daily"]),
  maintenanceTeam: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
    role: z.string().min(1, "Role is required"),
  })),
})

export default function SettingsPage() {
  const [ccEmailCount, setCcEmailCount] = React.useState(1)
  const [teamMemberCount, setTeamMemberCount] = React.useState(1)

  const form = useForm({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      primaryEmail: "",
      ccEmails: [""],
      emailNotifications: true,
      whatsappNotifications: false,
      whatsappNumber: "",
      notificationFrequency: "instant",
      maintenanceTeam: [{ name: "", email: "", phone: "", role: "" }],
    },
  })

  async function onSubmit(values) {
    try {
      toast({
        title: "Saving settings...",
        description: "Please wait while we update your settings.",
      })

      // Here you would typically save to your backend
      console.log(values)

      toast({
        title: "Settings Saved",
        description: "Your notification settings have been updated successfully.",
        variant: "success",
      })
    } catch (error) {
      console.error('Settings save error:', error)
      toast({
        title: "Error Saving Settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addCcEmail = () => {
    const currentCcEmails = form.getValues("ccEmails")
    form.setValue("ccEmails", [...currentCcEmails, ""])
    setCcEmailCount(prev => prev + 1)
  }

  const removeCcEmail = (index) => {
    const currentCcEmails = form.getValues("ccEmails")
    form.setValue("ccEmails", currentCcEmails.filter((_, i) => i !== index))
    setCcEmailCount(prev => prev - 1)
  }

  const addTeamMember = () => {
    const currentTeam = form.getValues("maintenanceTeam")
    form.setValue("maintenanceTeam", [...currentTeam, { name: "", email: "", phone: "", role: "" }])
    setTeamMemberCount(prev => prev + 1)
  }

  const removeTeamMember = (index) => {
    const currentTeam = form.getValues("maintenanceTeam")
    form.setValue("maintenanceTeam", currentTeam.filter((_, i) => i !== index))
    setTeamMemberCount(prev => prev - 1)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                <CardTitle className="text-2xl font-bold">
                  Notification Settings
                </CardTitle>
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
          </CardHeader>
          <CardContent>
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

                {/* CC Emails */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>CC Recipients</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCcEmail}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add CC
                    </Button>
                  </div>
                  {Array.from({ length: ccEmailCount }).map((_, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`ccEmails.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input placeholder="cc@example.com" {...field} />
                            </FormControl>
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeCcEmail(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  
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
                </div>

                {/* Maintenance Team */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Maintenance Team</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTeamMember}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Member
                    </Button>
                  </div>
                  
                  {Array.from({ length: teamMemberCount }).map((_, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid gap-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">Team Member {index + 1}</h4>
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeTeamMember(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <FormField
                            control={form.control}
                            name={`maintenanceTeam.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`maintenanceTeam.${index}.email`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`maintenanceTeam.${index}.phone`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`maintenanceTeam.${index}.role`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                  <Input placeholder="Maintenance Manager" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="lg">
                    Save Settings
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}