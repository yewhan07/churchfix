"use client"

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { formatDistanceToNow, format } from 'date-fns'
import { ClipboardList, Clock, CheckCircle2, AlertCircle, WrenchIcon, X, Upload } from "lucide-react"

// Import all UI components
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

// Constants and mock data
const FLOOR_OPTIONS = [
  { value: "ground", label: "Ground Floor" },
  { value: "first", label: "1st Floor" },
  { value: "second", label: "2nd Floor" },
]

const STATUS_TYPES = {
  SUBMITTED: {
    value: "submitted",
    label: "Submitted",
    color: "bg-blue-100 text-blue-800",
    icon: ClipboardList,
    progress: 20
  },
  REVIEWING: {
    value: "reviewing",
    label: "Under Review",
    color: "bg-purple-100 text-purple-800",
    icon: Clock,
    progress: 40
  },
  IN_PROGRESS: {
    value: "in-progress",
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800",
    icon: WrenchIcon,
    progress: 60
  },
  PENDING_VERIFICATION: {
    value: "pending-verification",
    label: "Pending Verification",
    color: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
    progress: 80
  },
  COMPLETED: {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
    progress: 100
  }
}

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

// Mock data
const MOCK_REQUESTS = [
  {
    id: 1,
    location: "Ground Floor",
    description: "Broken light fixture in the main entrance",
    currentStatus: "in-progress",
    statusHistory: [
      {
        status: "submitted",
        timestamp: new Date(2024, 1, 15, 9, 30),
        note: "Maintenance request submitted"
      },
      {
        status: "reviewing",
        timestamp: new Date(2024, 1, 15, 10, 15),
        note: "Request under review by maintenance team"
      },
      {
        status: "in-progress",
        timestamp: new Date(2024, 1, 15, 14, 0),
        note: "Electrician assigned and working on the issue"
      }
    ],
    createdAt: new Date(2024, 1, 15, 9, 30),
    estimatedCompletion: new Date(2024, 1, 16, 17, 0),
    priority: "high",
    assignedTo: "John Smith",
    attachments: 2,
    submittedBy: "Anonymous"
  },
  {
    id: 2,
    location: "1st Floor",
    description: "Water leak in bathroom",
    currentStatus: "reviewing",
    statusHistory: [
      {
        status: "submitted",
        timestamp: new Date(2024, 1, 14, 15, 0),
        note: "Maintenance request submitted"
      },
      {
        status: "reviewing",
        timestamp: new Date(2024, 1, 14, 16, 30),
        note: "Plumber scheduled for inspection"
      }
    ],
    createdAt: new Date(2024, 1, 14, 15, 0),
    estimatedCompletion: new Date(2024, 1, 15, 17, 0),
    priority: "medium",
    assignedTo: "Mike Johnson",
    attachments: 1,
    submittedBy: "John Doe"
  }
]

export default function MaintenanceForm() {
  // Initialize state with mock data
  const [requests, setRequests] = useState(MOCK_REQUESTS)
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

  // ... (previous handlers remain the same)

  async function onSubmit(values) {
    try {
      toast({
        title: "Submitting request...",
        description: "Please wait while we process your submission.",
      })

      // Create new request object
      const newRequest = {
        id: requests.length + 1,
        location: FLOOR_OPTIONS.find(opt => opt.value === values.location)?.label,
        description: values.description,
        currentStatus: "submitted",
        statusHistory: [
          {
            status: "submitted",
            timestamp: new Date(),
            note: "Maintenance request submitted"
          }
        ],
        createdAt: new Date(),
        estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        priority: "medium",
        assignedTo: "Pending Assignment",
        attachments: values.files?.length || 0,
        submittedBy: values.isAnonymous ? "Anonymous" : (values.name || "Anonymous")
      }

      // Update requests list
      setRequests(prev => [newRequest, ...prev])

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
      <div className="container mx-auto max-w-3xl">
        {/* Maintenance Request Form */}
        <Card className="shadow-lg mb-8">
          {/* ... (form JSX remains the same) ... */}
        </Card>

        {/* Previous Maintenance Requests */}
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Request History
            </CardTitle>
            <p className="text-gray-500">
              Track and monitor your maintenance requests
            </p>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No maintenance requests yet
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {requests.map((request) => (
                  <AccordionItem key={request.id} value={`item-${request.id}`}>
                    {/* ... (accordion content remains the same) ... */}
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}