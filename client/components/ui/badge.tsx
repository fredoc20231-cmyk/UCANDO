import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring select-none",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground font-semibold",
        analytical:
          "border border-transparent bg-accent text-accent-foreground font-semibold",
        secondary:
          "border border-border bg-surface text-secondary-foreground",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground font-semibold",
        outline: "border border-border bg-card text-foreground",
        model:
          "border border-dashed border-accent bg-accent/5 text-accent font-mono",
        observed:
          "border border-border bg-card text-foreground font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
