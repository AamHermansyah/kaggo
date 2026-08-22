import { Check } from "lucide-react"

export default function SendItemSuccess() {
  return (
    <div className="relative flex flex-1 flex-col items-center px-5 pt-6">
      {/* Top Status */}
      <div className="mb-20 flex w-full items-center justify-between text-xs font-medium">
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

      <div className="-mt-20 flex w-full flex-1 flex-col items-center justify-center">
        <div className="mb-6 flex size-18 items-center justify-center rounded-full bg-[#008967]">
          <Check className="size-10 stroke-[2.5] text-white" />
        </div>

        <h2 className="mb-3 text-center text-[26px] leading-snug font-semibold text-foreground">
          Package listing
          <br />
          successful!
        </h2>

        <p className="max-w-70 text-center text-[15px] text-muted-foreground">
          Receiver can now track package
          <br />
          with their phone number
        </p>
      </div>
    </div>
  )
}
