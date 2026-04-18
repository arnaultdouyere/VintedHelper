import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-white/[0.08] bg-[#20242E] px-2.5 py-2 text-base text-white transition-colors outline-none placeholder:text-slate-600 focus-visible:border-[#00D4C8]/50 focus-visible:ring-2 focus-visible:ring-[#00D4C8]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
