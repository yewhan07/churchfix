"use client"

import React from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  WrenchIcon,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Progress } from "@/components/ui/progress"

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

export default function HistoryPage() {
  const getStatusDetails = (statusValue) => {
    return Object.values(STATUS_TYPES).find(status => status.value === statusValue) || STATUS_TYPES.SUBMITTED
  }

  const renderStatusTimeline = (request) => {
    const currentStatusDetails = getStatusDetails(request.currentStatus)
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Submitted</span>
            <span>Completed</span>
          </div>
          <Progress value={currentStatusDetails.progress} className="h-2" />
        </div>

        <div className="space-y-4">
          {request.statusHistory.map((history, index) => {
            const statusDetails = getStatusDetails(history.status)
            const StatusIcon = statusDetails.icon

            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`mt-1 p-1 rounded-full ${statusDetails.color}`}>
                  <StatusIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{statusDetails.label}</p>
                      <p className="text-sm text-gray-500">{history.note}</p>
                    </div>
                    <time className="text-xs text-gray-500">
                      {format(history.timestamp, 'MMM d, h:mm a')}
                    </time>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                Maintenance Request History
              </CardTitle>
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
              Track and monitor your maintenance requests
            </p>
          </CardHeader>
          <CardContent>
            {MOCK_REQUESTS.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No maintenance requests yet
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {MOCK_REQUESTS.map((request) => (
                  <AccordionItem key={request.id} value={`item-${request.id}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-2 sm:gap-4 text-left">
                        <Badge className={getStatusDetails(request.currentStatus).color}>
                          {getStatusDetails(request.currentStatus).label}
                        </Badge>
                        <div className="flex-1">
                          <h3 className="font-medium">{request.location}</h3>
                          <p className="text-sm text-gray-500 truncate">
                            {request.description}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(request.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Request Details</h4>
                          <dl className="divide-y divide-gray-100">
                            <div className="flex justify-between py-1">
                              <dt className="text-sm text-gray-500">Submitted by</dt>
                              <dd className="text-sm font-medium">{request.submittedBy}</dd>
                            </div>
                            <div className="flex justify-between py-1">
                              <dt className="text-sm text-gray-500">Priority</dt>
                              <dd className="text-sm font-medium capitalize">{request.priority}</dd>
                            </div>
                            <div className="flex justify-between py-1">
                              <dt className="text-sm text-gray-500">Assigned to</dt>
                              <dd className="text-sm font-medium">{request.assignedTo}</dd>
                            </div>
                            <div className="flex justify-between py-1">
                              <dt className="text-sm text-gray-500">Est. Completion</dt>
                              <dd className="text-sm font-medium">
                                {format(request.estimatedCompletion, 'MMM d, h:mm a')}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-4">Status Timeline</h4>
                          {renderStatusTimeline(request)}
                        </div>

                        {request.currentStatus !== 'completed' && (
                          <div className="pt-2">
                            <Button variant="outline" size="sm" className="w-full">
                              Request Update
                            </Button>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
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