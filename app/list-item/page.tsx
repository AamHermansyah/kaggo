import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function ListItemFirstTime() {
  return (
    <div className="flex flex-col flex-1 px-6 pt-10 pb-6 relative overflow-hidden">
      <h2 className="text-xl font-medium mb-8">
        Using Kaggo for the first time?
      </h2>
      
      <Input 
        type="tel" 
        placeholder="Enter your phone number" 
        className="h-14 rounded-xl text-base px-4 border-border/60 shadow-none mb-4"
      />
      
      <div className="flex-1"></div>
      
      <div className="flex flex-col items-center mt-auto w-full">
        <Link 
          href="/list-item/new-device" 
          className="text-primary text-[15px] font-medium hover:underline active:opacity-70 transition-opacity mb-6"
        >
          Set up Kaggo on a new device
        </Link>
        
        <Separator className="w-[calc(100%+3rem)] -mx-6 mb-6" />

        <Button render={<Link href="/send-item" />} nativeButton={false} size="lg" className="w-full rounded-full text-base font-medium active:scale-[0.98] transition-transform shadow-none">
          Continue
        </Button>
      </div>
    </div>
  )
}
