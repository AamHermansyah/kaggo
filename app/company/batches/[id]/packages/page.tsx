interface PackageItem {
  id: string
  customer: string
  item: string
  status: "Active" | "Pending" | "Delivered"
}

const mockPackages: PackageItem[] = [
  { id: "1", customer: "08030787654", item: "Laptop", status: "Active" },
  { id: "2", customer: "08067890123", item: "Bags of rice", status: "Pending" },
  { id: "3", customer: "08067890123", item: "Bags of rice", status: "Pending" },
  { id: "4", customer: "08067890123", item: "Bags of rice", status: "Pending" },
  { id: "5", customer: "08067890123", item: "Bags of rice", status: "Pending" },
  { id: "6", customer: "08067890123", item: "Bags of rice", status: "Pending" },
]

export default async function PackageListPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const batchNum = id || "2"

  return (
    <div className="flex flex-col flex-1 px-5 pt-6 pb-6 relative overflow-x-hidden overflow-y-auto">
      {/* Route & Batch Header */}
      <div className="flex flex-col mb-6 shrink-0">
        <h2 className="text-[22px] font-bold text-foreground tracking-tight">
          Lagos - Abuja
        </h2>
        <div className="flex items-center justify-between text-[14px] text-foreground/80 mt-1 font-medium">
          <span>Batch {batchNum} - Packages</span>
          <span className="text-foreground font-semibold">127 Total</span>
        </div>
      </div>

      {/* Packages Table Container */}
      <div className="flex flex-col w-full shrink-0">
        {/* Table Header Bar */}
        <div className="bg-[#008967] text-white rounded-lg py-2.5 px-4 text-[13px] font-semibold flex items-center justify-between mb-3 shadow-xs">
          <span className="w-1/3 text-left">Customer</span>
          <span className="w-1/3 text-center">Item</span>
          <span className="w-1/3 text-right">Status</span>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {mockPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center justify-between py-3.5 px-2 border-b border-border/40 text-[14px]"
            >
              <span className="w-1/3 text-left text-foreground font-medium">
                {pkg.customer}
              </span>
              <span className="w-1/3 text-center text-foreground/80 font-normal">
                {pkg.item}
              </span>
              <span
                className={`w-1/3 text-right font-medium ${
                  pkg.status === "Active"
                    ? "text-[#008967]"
                    : "text-foreground/70"
                }`}
              >
                {pkg.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
