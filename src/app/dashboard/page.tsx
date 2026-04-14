import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import PropertyCard from '@/components/dashboard/PropertyCard';
import TenantList from '@/components/dashboard/TenantList';
import TicketFeed from '@/components/dashboard/TicketFeed';
import VendorLeaderboard from '@/components/dashboard/VendorLeaderboard';
import { SEED_PROPERTIES, SEED_TENANTS, SEED_VENDORS, SEED_TICKETS } from '@/lib/db/seed';
import {
  Building2,
  Users,
  Wrench,
  TrendingUp,
  ArrowRight,
  Activity,
} from 'lucide-react';

export default function DashboardPage() {
  const totalRevenue = SEED_TENANTS.reduce((s, t) => s + t.rent_amount, 0);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Telos</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Dashboard</span>
        </div>
        <Link href="/workflow/triage">
          <Button size="sm">
            Open Workflows
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </Link>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{SEED_PROPERTIES.length}</div>
                <p className="text-xs text-muted-foreground">
                  {SEED_PROPERTIES.reduce((s, p) => s + p.units, 0)} total units
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tenants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{SEED_TENANTS.length}</div>
                <p className="text-xs text-muted-foreground">Across all properties</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{SEED_TICKETS.length}</div>
                <p className="text-xs text-muted-foreground">
                  {SEED_TICKETS.filter((t) => t.urgency >= 4).length} high urgency
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {SEED_TENANTS.length} tenants
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Properties
              </h2>
              {SEED_PROPERTIES.map((prop) => (
                <PropertyCard
                  key={prop.property_id}
                  property={prop}
                  tenants={SEED_TENANTS.filter(
                    (t) => t.property_id === prop.property_id,
                  )}
                />
              ))}
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Tenants
                <Badge variant="secondary" className="text-[10px]">
                  {SEED_TENANTS.length}
                </Badge>
              </h2>
              <TenantList tenants={SEED_TENANTS} />
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Maintenance Tickets
                <Badge variant="secondary" className="text-[10px]">
                  {SEED_TICKETS.length}
                </Badge>
              </h2>
              <TicketFeed tickets={SEED_TICKETS} />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4" />
              Vendor Leaderboard
              <Badge variant="secondary" className="text-[10px]">
                {SEED_VENDORS.length} vendors
              </Badge>
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <VendorLeaderboard vendors={SEED_VENDORS} />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
