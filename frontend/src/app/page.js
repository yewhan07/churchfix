"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Upload, X, History } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime"
]

const FLOOR_OPTIONS = [
  { value: "ground", label: "Ground Floor" },
  { value: "first", label: "1st Floor" },
  { value: "second", label: "2nd Floor" },
]

// Form validation schema
const maintenanceFormSchema = z.object({
  location: z.string({
    required_error: "Please select a floor",
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
  files: z
    .array(z.instanceof(File))
    .refine((files) => files.every(file => file.size <= MAX_FILE_SIZE), {
      message: `Each file must be less than 5MB`,
    })
    .refine((files) => files.every(file => ACCEPTED_FILE_TYPES.includes(file.type)), {
      message: "Only .jpg, .jpeg, .png, .webp, and .mp4 files are accepted.",
    })
    .optional(),
})

export default function MaintenanceForm() {
  const [filePreview, setFilePreview] = useState([])

  const form = useForm({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      location: "",
      description: "",
      isAnonymous: false,
      name: "",
      phone: "",
      files: [],
    },
  })

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files)
    field.onChange(files)
    
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name
    }))
    
    filePreview.forEach(preview => URL.revokeObjectURL(preview.url))
    setFilePreview(newPreviews)
  }

  const removeFile = (index, field) => {
    const currentFiles = field.value
    const newFiles = [...currentFiles]
    newFiles.splice(index, 1)
    field.onChange(newFiles)

    URL.revokeObjectURL(filePreview[index].url)
    const newPreviews = [...filePreview]
    newPreviews.splice(index, 1)
    setFilePreview(newPreviews)
  }

  async function onSubmit(values) {
    try {
      toast({
        title: "Submitting request...",
        description: "Please wait while we process your submission.",
      })

      console.log(values)

      toast({
        title: "Request Submitted Successfully",
        description: "Thank you for your maintenance request. Our team has been notified and will review it shortly.",
        variant: "success",
      })

      form.reset()
      setFilePreview([])

    } catch (error) {
      console.error('Submission error:', error)
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">
                Maintenance Request
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.location.href = '/history'}
              >
                <History className="h-4 w-4" />
                View History
              </Button>
            </div>
            <p className="text-gray-500">
              Submit your maintenance or repair request below
            </p>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a floor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FLOOR_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the floor where the issue is located
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

                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Photos or Videos</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="file-upload"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="h-6 w-6 mb-2" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  Images (JPG, PNG, WebP) or Videos (MP4) up to 5MB
                                </p>
                              </div>
                              <Input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                multiple
                                accept={ACCEPTED_FILE_TYPES.join(",")}
                                onChange={(e) => handleFileChange(e, field)}
                              />
                            </label>
                          </div>

                          {filePreview.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                              {filePreview.map((file, index) => (
                                <div key={index} className="relative group">
                                  {file.type.startsWith('image/') ? (
                                    <img
                                      src={file.url}
                                      alt={`Preview ${index + 1}`}
                                      className="h-24 w-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <video
                                      src={file.url}
                                      className="h-24 w-full object-cover rounded-lg"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index, field)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                  <p className="text-xs mt-1 truncate">{file.name}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload photos or videos to help us better understand the issue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
    </main>
  )
}