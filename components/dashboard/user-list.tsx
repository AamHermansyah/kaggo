export function UserList() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h2 className="text-[22px] font-semibold text-foreground">Users</h2>
        <p className="text-[15px] text-foreground/80 mt-1">100,002</p>
      </div>

      <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((item, i) => (
          <div key={i} className="flex justify-between items-center pb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#008967]" />
                <span className="text-[14px] text-foreground font-medium">56</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                <span className="text-[14px] text-foreground font-medium">34</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="text-[15px] font-medium text-foreground">08030987654</span>
              <span className="text-[13px] text-foreground/60">Today, 6:45 P.M</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
