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
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-6 pb-6">
      {/* Route & Batch Header */}
      <div className="mb-6 flex shrink-0 flex-col">
        <h2 className="text-[22px] font-bold tracking-tight text-foreground">
          Lagos - Abuja
        </h2>
        <div className="mt-1 flex items-center justify-between text-[14px] font-medium text-foreground/80">
          <span>Batch {batchNum} - Packages</span>
          <span className="font-semibold text-foreground">127 Total</span>
        </div>
      </div>

      {/* Packages Table Container */}
      <div className="flex w-full shrink-0 flex-col">
        {/* Table Header Bar */}
        <div className="mb-3 flex items-center justify-between rounded-lg bg-[#008967] px-4 py-2.5 text-[13px] font-semibold text-white shadow-xs">
          <span className="w-1/3 text-left">Customer</span>
          <span className="w-1/3 text-center">Item</span>
          <span className="w-1/3 text-right">Status</span>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {mockPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center justify-between border-b border-border/40 px-2 py-3.5 text-[14px]"
            >
              <span className="w-1/3 text-left font-medium text-foreground">
                {pkg.customer}
              </span>
              <span className="w-1/3 text-center font-normal text-foreground/80">
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
