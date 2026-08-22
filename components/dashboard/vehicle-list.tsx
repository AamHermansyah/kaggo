export function VehicleList() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-[22px] font-semibold text-foreground">Vehicles</h2>
        <p className="mt-1 text-[15px] text-foreground/80">15,231</p>
      </div>

      <div className="flex flex-col gap-6">
        {[1, 2, 3, 4].map((item, i) => (
          <div key={i} className="flex items-start justify-between pb-2">
            <div className="flex flex-col gap-2">
              <span className="text-[15px] font-medium text-foreground">
                Ademola James
              </span>
              <span className="text-[14px] text-foreground/90">
                08030987654
              </span>
              <span className="text-[14px] text-foreground/80">
                Toyota Hiace, White
              </span>
              <span className="text-[13px] text-foreground/70">NURTW</span>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-[14px] text-foreground/90">KG1002893</span>
              <span className="text-[14px] text-foreground/90">Active 90%</span>
              <span className="text-[14px] font-medium text-[#008967]">
                ABC 456 VX
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
