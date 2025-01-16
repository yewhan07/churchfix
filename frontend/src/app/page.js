"use client"

// ... (previous imports remain the same)

// Mock data with enhanced status tracking
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