import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-body tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-espresso-light rounded-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-sm",
        outline:
          "border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-gold-dark rounded-sm",
        ghost: "hover:bg-muted hover:text-foreground rounded-sm",
        link: "text-gold underline-offset-4 hover:underline",
        // Meskerem Custom Variants
        hero: "bg-secondary text-secondary-foreground hover:bg-gold-dark shadow-gold hover:shadow-lg transform hover:-translate-y-0.5 rounded-sm",
        heroOutline: "border-2 border-cream bg-transparent text-cream hover:bg-cream/10 backdrop-blur-sm rounded-sm",
        gold: "bg-gradient-gold text-espresso font-semibold hover:shadow-gold transform hover:-translate-y-0.5 rounded-sm",
        elegant: "bg-primary text-primary-foreground border border-gold/20 hover:border-gold/50 hover:shadow-soft rounded-sm",
        burgundy: "bg-burgundy text-cream hover:bg-burgundy-light rounded-sm",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
