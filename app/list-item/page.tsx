import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function ListItemFirstTime() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden px-6 pt-10 pb-6">
      <h2 className="mb-8 text-xl font-medium">
        Using Kaggo for the first time?
      </h2>

      <Input
        type="tel"
        placeholder="Enter your phone number"
        className="mb-4 h-14 rounded-xl border-border/60 px-4 text-base shadow-none"
      />

      <div className="flex-1"></div>

      <div className="mt-auto flex w-full flex-col items-center">
        <Link
          href="/list-item/new-device"
          className="mb-6 text-[15px] font-medium text-primary transition-opacity hover:underline active:opacity-70"
        >
          Set up Kaggo on a new device
        </Link>

        <Separator className="-mx-6 mb-6 w-[calc(100%+3rem)]" />

        <Button
          render={<Link href="/send-item" />}
          nativeButton={false}
          size="lg"
          className="w-full rounded-full text-base font-medium shadow-none transition-transform active:scale-98"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
