import TrackItemCard from "@/components/shared/track-item-card"

export default function TrackItem() {
  return (
    <div className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto">
      {/* Top Status */}
      <div className="flex items-center justify-between mb-8 text-xs font-medium w-full shrink-0">
        <span className="text-primary">ID: 08030987654</span>
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

      <h2 className="text-[20px] font-medium text-foreground mb-5 shrink-0">
        2 listing found
      </h2>

      <div className="flex flex-col shrink-0 mb-8">
        <TrackItemCard
          data={{
            status: "active",
            itemName: "Laptop Bag",
            location: "Lagos - Abuja",
            statusText: "Passed Lokoja",
            time: "6:58 P.M",
            arrivalTime: "Arriving in 6 hrs 35 mins",
            vehiclePlate: "AAA 123 KJ",
            vehicleModel: "Toyota Hiace, White",
            company: "AKTC Transport Company Ltd"
          }}
        />

        <TrackItemCard
          data={{
            status: "inactive",
            itemName: "Bags of Rice",
            location: "Lagos - Abuja",
            statusText: "Arrived Gwagwalada, Abuja",
            time: "4:36 P.M",
            arrivalTime: "Arriving in 0 hrs",
            vehiclePlate: "KJA 123 VX",
            vehicleModel: "Toyota Hiace, Blue",
            company: "NURTW",
            companyIsGreen: true,
            showReceivedButton: true
          }}
        />
      </div>

      <div className="flex-1"></div>

      <div className="flex justify-center mt-auto pt-6 shrink-0">
        <button className="text-primary text-[14px] font-medium hover:underline active:opacity-70 transition-opacity">
          Contact Support
        </button>
      </div>
    </div>
  )
}
