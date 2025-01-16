// ... (previous imports and constants remain the same)

export default function MaintenanceForm() {
  const [filePreview, setFilePreview] = useState([])
  const [requests, setRequests] = useState(MOCK_REQUESTS)

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
        location: FLOOR_OPTIONS.find(opt => opt.value === values.location).label,
        description: values.description,
        status: "pending",
        createdAt: new Date(),
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

  // ... (rest of the component remains the same)
}