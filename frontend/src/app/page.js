// Update the header section in the main form

<CardHeader className="space-y-2">
  <div className="flex justify-between items-center">
    <CardTitle className="text-3xl font-bold">
      Maintenance Request
    </CardTitle>
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2"
        onClick={() => window.location.href = '/settings'}
      >
        <Settings className="h-4 w-4" />
        Settings
      </Button>
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
  </div>
  <p className="text-gray-500">
    Submit your maintenance or repair request below
  </p>
</CardHeader>