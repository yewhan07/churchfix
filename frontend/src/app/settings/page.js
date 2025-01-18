// ... (previous imports remain the same)
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Enhanced schema with advanced notification options
const settingsFormSchema = z.object({
  // ... (previous schema fields remain the same)
  
  // Notification Templates
  templates: z.object({
    newRequest: z.string().min(1, "Template is required"),
    statusUpdate: z.string().min(1, "Template is required"),
    urgent: z.string().min(1, "Template is required"),
    completion: z.string().min(1, "Template is required"),
  }),

  // Schedule Settings
  schedule: z.object({
    workingHours: z.object({
      start: z.string(),
      end: z.string(),
    }),
    workingDays: z.array(z.string()),
    timezone: z.string(),
    delayAfterHours: z.number().min(0),
  }),

  // Priority Rules
  priorityRules: z.array(z.object({
    condition: z.string(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
    notification: z.array(z.string()),
    escalation: z.number().min(0),
  })),

  // Escalation Settings
  escalation: z.object({
    enabled: z.boolean(),
    levels: z.array(z.object({
      timeThreshold: z.number(),
      notifyUsers: z.array(z.string()),
      actions: z.array(z.string()),
    })),
  }),
})

export default function SettingsPage() {
  // ... (previous state and handlers remain the same)

  const defaultTemplates = {
    newRequest: `New Maintenance Request
Location: {location}
Description: {description}
Submitted by: {submitter}
Priority: {priority}
Reference: {requestId}`,
    
    statusUpdate: `Maintenance Request Update
Status: {status}
Location: {location}
Updated by: {updater}
Notes: {notes}`,
    
    urgent: `⚠️ URGENT Maintenance Required
Location: {location}
Issue: {description}
Priority: HIGH
Immediate action required!`,
    
    completion: `✅ Maintenance Complete
Location: {location}
Issue: {description}
Completed by: {assignee}
Notes: {completionNotes}`
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            {/* ... (previous header remains the same) ... */}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
              </TabsList>

              {/* General Settings Tab */}
              <TabsContent value="general">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* ... (previous general settings remain the same) ... */}
                  </form>
                </Form>
              </TabsContent>

              {/* Notification Templates Tab */}
              <TabsContent value="templates">
                <div className="space-y-6">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="templates.newRequest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Request Template</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Template for new maintenance requests..."
                              className="min-h-[150px] font-mono text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Available variables: {'{location}'}, {'{description}'}, {'{submitter}'}, {'{priority}'}, {'{requestId}'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="templates.statusUpdate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status Update Template</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Template for status updates..."
                              className="min-h-[150px] font-mono text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Available variables: {'{status}'}, {'{location}'}, {'{updater}'}, {'{notes}'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="templates.urgent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgent Request Template</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Template for urgent requests..."
                              className="min-h-[150px] font-mono text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Schedule Settings Tab */}
              <TabsContent value="schedule">
                <div className="space-y-6">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="schedule.workingHours.start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Working Hours Start</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="schedule.workingHours.end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Working Hours End</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="schedule.timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="America/Chicago">Central Time</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="schedule.delayAfterHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>After Hours Delay (minutes)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Delay for non-urgent notifications outside working hours
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Priority Rules Tab */}
              <TabsContent value="rules">
                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="escalation">
                      <AccordionTrigger>Escalation Rules</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="escalation.enabled"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Enable Escalation
                                  </FormLabel>
                                  <FormDescription>
                                    Automatically escalate unresolved issues
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

                          {form.watch("escalation.enabled") && (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Time Threshold</TableHead>
                                  <TableHead>Notify</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell>2 hours</TableCell>
                                  <TableCell>Team Lead</TableCell>
                                  <TableCell>Email + SMS</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>4 hours</TableCell>
                                  <TableCell>Manager</TableCell>
                                  <TableCell>Email + SMS + Call</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>24 hours</TableCell>
                                  <TableCell>Director</TableCell>
                                  <TableCell>All Channels</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="priority">
                      <AccordionTrigger>Priority Rules</AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Condition</TableHead>
                              <TableHead>Priority</TableHead>
                              <TableHead>Notifications</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Contains "water leak"</TableCell>
                              <TableCell>High</TableCell>
                              <TableCell>Immediate SMS + Email</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Contains "electrical"</TableCell>
                              <TableCell>High</TableCell>
                              <TableCell>Immediate SMS + Email</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Default</TableCell>
                              <TableCell>Normal</TableCell>
                              <TableCell>Email only</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}