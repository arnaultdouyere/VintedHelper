import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-white/[0.08] bg-[#20242E] px-2.5 py-1 text-base text-white transition-colors outline-none placeholder:text-slate-600 focus-visible:border-[#00D4C8]/50 focus-visible:ring-2 focus-visible:ring-[#00D4C8]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
