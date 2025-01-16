"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

// Form validation schema
const maintenanceFormSchema = z.object({
  location: z.string().min(1, {
    message: "Location is required to help us identify where the issue is.",
  }),
  description: z.string().min(10, {
    message: "Please provide at least 10 characters describing the issue.",
  }),
  isAnonymous: z.boolean().default(false),
  name: z.string().optional(),
  phone: z.string()
    .regex(/^(\+?[0-9]{10,15})?$/, {
      message: "Please enter a valid phone number or leave it blank.",
    })
    .optional(),
  // Note: File validation would be handled separately
})

export default function MaintenanceRequestPage() {
  const form = useForm({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      location: "",
      description: "",
      isAnonymous: false,
      name: "",
      phone: "",
    },
  })

  function onSubmit(values) {
    // Here we would handle the form submission
    toast({
      title: "Request Submitted",
      description: "Thank you for your maintenance request. We'll review it shortly.",
    })
    console.log(values)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Maintenance Request Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Main Hall, Room 101" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please specify where the issue is located in the church
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe the issue in detail..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Submit Anonymously
                      </FormLabel>
                      <FormDescription>
                        Toggle if you prefer to remain anonymous
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

              {!form.watch("isAnonymous") && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your phone number" 
                            type="tel"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Format: +1234567890 or 1234567890
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex justify-end">
                <Button type="submit" size="lg">
                  Submit Request
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}