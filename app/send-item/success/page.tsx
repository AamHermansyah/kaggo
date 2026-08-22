import { Check } from "lucide-react"

export default function SendItemSuccess() {
  return (
    <div className="flex flex-col flex-1 px-5 pt-6 relative items-center">
      {/* Top Status */}
      <div className="flex items-center justify-between mb-20 text-xs font-medium w-full">
        <span className="text-primary">ID: 08034567890</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span>56</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-destructive" />
            <span>34</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 w-full -mt-20">
        <div className="size-18 rounded-full bg-[#008967] flex items-center justify-center mb-6">
          <Check className="size-10 text-white stroke-[2.5]" />
        </div>
        
        <h2 className="text-[26px] font-semibold text-foreground text-center mb-3 leading-snug">
          Package listing<br/>successful!
        </h2>
        
        <p className="text-muted-foreground text-[15px] text-center max-w-70">
          Receiver can now track package<br/>with their phone number
        </p>
      </div>
    </div>
  )
}
