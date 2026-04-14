'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types';

function getPaymentStatus(tenant: Tenant): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  const history = tenant.payment_history;
  if (history.length === 0) return { label: 'New', variant: 'secondary' };

  const lastPayment = history[history.length - 1];
  const paidDay = new Date(lastPayment.paid_date).getDate();

  if (paidDay <= tenant.rent_due_day + 1) return { label: 'On Time', variant: 'default' };
  if (paidDay <= tenant.rent_due_day + 5) return { label: 'Late', variant: 'secondary' };
  return { label: 'Very Late', variant: 'destructive' };
}

export default function TenantList({ tenants }: { tenants: Tenant[] }) {
  return (
    <div className="space-y-1">
      {tenants.map((tenant) => {
        const status = getPaymentStatus(tenant);
        return (
          <div
            key={tenant.tenant_id}
            className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-accent/50 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{tenant.name}</p>
              <p className="text-[11px] text-muted-foreground">{tenant.email}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-medium">
                ${tenant.rent_amount.toLocaleString()}
              </span>
              <Badge
                variant={status.variant}
                className={cn(
                  'text-[10px]',
                  status.variant === 'default' && 'bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30',
                )}
              >
                {status.label}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
