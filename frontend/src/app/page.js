"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to ChurchFix</h1>
      <div className="space-y-4">
        <Link href="/maintenance">
          <Button size="lg">
            Submit Maintenance Request
          </Button>
        </Link>
      </div>
    </main>
  )
}