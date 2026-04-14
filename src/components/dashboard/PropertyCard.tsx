'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Home } from 'lucide-react';
import type { Property, Tenant } from '@/types';

export default function PropertyCard({
  property,
  tenants,
}: {
  property: Property;
  tenants: Tenant[];
}) {
  const occupancy = tenants.length;
  const totalRent = tenants.reduce((sum, t) => sum + t.rent_amount, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">{property.address}</CardTitle>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {property.units} units
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Occupied:</span>
            <span className="font-medium">
              {occupancy}/{property.units}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Revenue:</span>
            <span className="font-medium">${totalRent.toLocaleString()}/mo</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {property.rules.pets_allowed && (
            <Badge variant="outline" className="text-[10px]">Pets OK</Badge>
          )}
          {property.rules.sublease && (
            <Badge variant="outline" className="text-[10px]">Sublease OK</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
