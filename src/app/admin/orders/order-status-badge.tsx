
import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "./actions";

type OrderStatusBadgeProps = {
  status: OrderStatus | string;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const badgeVariant = {
    Delivered: 'default',
    Shipped: 'secondary',
    Processing: 'secondary',
    Pending: 'secondary',
    Cancelled: 'destructive',
  } as const;

  return (
    <Badge 
      variant={badgeVariant[status as OrderStatus] || 'secondary'}
    >
      {status}
    </Badge>
  );
}
