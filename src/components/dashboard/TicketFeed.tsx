'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Ticket } from '@/types';

const urgencyColors: Record<number, string> = {
  1: 'bg-gray-500/20 text-gray-600',
  2: 'bg-blue-500/20 text-blue-600',
  3: 'bg-yellow-500/20 text-yellow-600',
  4: 'bg-orange-500/20 text-orange-600',
  5: 'bg-red-500/20 text-red-600',
};

const statusColors: Record<string, string> = {
  triaging: 'bg-blue-500/20 text-blue-600',
  vendor_assigned: 'bg-emerald-500/20 text-emerald-600',
  in_progress: 'bg-yellow-500/20 text-yellow-600',
  resolved: 'bg-gray-500/20 text-gray-600',
};

export default function TicketFeed({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="space-y-2">
      {tickets.map((ticket) => (
        <div
          key={ticket.ticket_id}
          className="rounded-lg border p-3 space-y-2 hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm line-clamp-2">{ticket.raw_message}</p>
            <Badge
              className={cn('shrink-0 text-[10px]', urgencyColors[ticket.urgency])}
            >
              P{ticket.urgency}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] capitalize">
              {ticket.category}
            </Badge>
            <Badge className={cn('text-[10px]', statusColors[ticket.status])}>
              {ticket.status.replace('_', ' ')}
            </Badge>
            <span className="ml-auto text-[11px] text-muted-foreground">
              {new Date(ticket.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
