import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Wrench,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Zap,
  Brain,
  BarChart3,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">Telos</span>
          <Badge variant="secondary" className="text-[10px]">
            AI Agent
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Link href="/workflow/triage">
            <Button size="sm">
              Open Workflow Editor
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mb-2">
              <Zap className="mr-1 h-3 w-3" />
              DataHacks 2026 &mdash; ML/AI Track
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              AI-Powered Tenant Management
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              An autonomous AI agent that handles maintenance triage, rent
              collection, and tenant inquiries &mdash; so landlords don&apos;t have to.
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <Link href="/workflow/triage">
                <Button size="lg">
                  <Brain className="mr-2 h-4 w-4" />
                  View Agent Workflows
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <Link href="/workflow/triage" className="group">
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 mb-2">
                    <Wrench className="h-5 w-5 text-emerald-500" />
                  </div>
                  <CardTitle className="text-base">Maintenance Triage</CardTitle>
                  <CardDescription>
                    AI classifies issues, asks follow-ups, scores vendors, and dispatches automatically.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-primary group-hover:underline">
                    View workflow
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/workflow/rent" className="group">
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-base">Rent Reminders</CardTitle>
                  <CardDescription>
                    Tone-calibrated messages based on payment history, with escalation logic.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-primary group-hover:underline">
                    View workflow
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/workflow/inquiry" className="group">
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 mb-2">
                    <MessageSquare className="h-5 w-5 text-orange-500" />
                  </div>
                  <CardTitle className="text-base">Tenant Inquiries</CardTitle>
                  <CardDescription>
                    Auto-answers common questions by pulling from lease data and property rules.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-primary group-hover:underline">
                    View workflow
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
