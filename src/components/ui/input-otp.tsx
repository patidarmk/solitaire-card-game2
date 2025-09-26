"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

const inputOtpVariants = cva(
  "flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "shadow-sm",
        outline: "border-2 border-dashed",
      },
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface RenderProps {
  slots: Array<{ id: string; index: number }>;
  charMap: string[];
}

interface OTPInputContextValue {
  slots: Array<{
    index: number;
    char?: string;
    hasFakeCaret: boolean;
    isActive: boolean;
  }>;
}

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput> & VariantProps<typeof inputOtpVariants>
>(({ className, variant, size, containerClassName, ...props }, ref) => {
  return (
    <div className={cn("flex items-center space-x-2", containerClassName)}>
      <OTPInput
        ref={ref}
        containerClassName="flex space-x-2"
        className={cn(inputOtpVariants({ variant, size, className }))}
        {...props}
        children={(({ slots, charMap }: RenderProps) =>
          slots.map((slot, index) => (
            <Slot key={slot.id} char={charMap[index]} slot={slot} />
          ))
        ) as any}
      />
    </div>
  )
})
InputOTP.displayName = "InputOTP"

const Slot = ({ char, slot }: { char?: string; slot: { id: string; index: number } }) => {
  const inputOTPContext = React.useContext(OTPInputContext) as unknown as OTPInputContextValue
  const currentSlot = inputOTPContext.slots[slot.index]
  const { char: currentChar, hasFakeCaret, isActive } = currentSlot || { char: undefined, hasFakeCaret: false, isActive: false }

  return (
    <div className="relative">
      <input className="absolute inset-0 h-full w-full border-0 bg-transparent p-0 text-center text-lg font-medium -translate-y-1/2 opacity-0" />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center",
          isActive && "text-foreground",
          !isActive && "text-muted-foreground"
        )}
      >
        {currentChar ? (
          currentChar
        ) : (
          <Dot className="h-4 w-4" />
        )}
      </div>
      {hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-foreground" />
        </div>
      )}
    </div>
  )
}

export { InputOTP }