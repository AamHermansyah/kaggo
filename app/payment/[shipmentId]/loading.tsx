import { Spinner } from "@/components/ui/spinner"

export default function PaymentLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <Spinner className="size-8 text-primary" />
      <p className="text-[15px] font-medium text-foreground">
        Taking you to secure payment…
      </p>
      <p className="max-w-70 text-[13px] text-foreground/60">
        Do not close this page. Paystack will bring you back once you are done.
      </p>
    </div>
  )
}
