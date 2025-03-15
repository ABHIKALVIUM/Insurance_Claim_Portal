import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary-foreground">Insurance Claims Portal</h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto py-12 px-4">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Patient Portal</h2>
              <p className="text-muted-foreground">
                Submit and track your insurance claims easily. Upload documents and check the status of your claims in
                real-time.
              </p>
              <Button asChild size="lg">
                <Link href="/patient/login">Access Patient Portal</Link>
              </Button>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Insurer Portal</h2>
              <p className="text-muted-foreground">
                Review and manage patient claims efficiently. Approve or reject claims and provide feedback to patients.
              </p>
              <Button asChild size="lg" variant="outline">
                <Link href="/insurer/login">Access Insurer Portal</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Insurance Claims Portal. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

