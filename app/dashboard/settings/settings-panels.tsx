import { SectionError } from "@/components/shared/section-error"
import { Skeleton } from "@/components/ui/skeleton"
import { listCompanyLocations, listCountries } from "@/lib/api/admin"
import { loadAdmin } from "@/lib/api/guards"
import { ListEmpty } from "@/components/dashboard/list-chrome"
import { CompanyLocationsForm } from "./locations-form"
import { PricingForm } from "./pricing-form"

/**
 * Per-country flat pricing. Each row is its own small form.
 *
 * Editing is SUPERADMIN-only since v1.1, so a plain ADMIN sees the rates
 * read-only rather than a form the backend would reject.
 */
export async function PricingPanel({
  token,
  canEdit,
}: {
  token: string
  canEdit: boolean
}) {
  const result = await loadAdmin(() => listCountries(token))

  if (!result.ok) {
    return <SectionError title="Could not load pricing" result={result} />
  }

  if (result.data.length === 0) {
    return (
      <ListEmpty
        title="No countries configured"
        description="Pricing rows are seeded by the backend."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {result.data.map((country) => (
        <PricingForm
          key={country.code}
          country={country}
          canEdit={canEdit}
        />
      ))}
    </div>
  )
}

/** Existing store locations, plus the CSV upload that maintains them. */
export async function LocationsPanel({
  token,
  country,
}: {
  token: string
  country: string
}) {
  const result = await loadAdmin(() => listCompanyLocations(token, country))

  return (
    <div className="flex flex-col gap-5">
      {result.ok ? (
        result.data.length === 0 ? (
          <ListEmpty
            title="No locations yet"
            description="Upload a CSV below to add company drop-off points."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {result.data.map((location, index) => (
              <li
                key={`${location.companyName ?? index}-${location.locationLabel ?? index}`}
                className="flex flex-col gap-0.5 border-b border-border/40 pb-3 last:border-b-0"
              >
                <span className="text-[14px] font-medium text-foreground">
                  {location.companyName ?? "Unnamed company"}
                </span>
                <span className="text-[13px] text-foreground/70">
                  {location.locationLabel ?? "—"}
                </span>
                <span className="text-[13px] text-foreground/60">
                  {location.address ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        )
      ) : (
        <SectionError title="Could not load locations" result={result} />
      )}

      <CompanyLocationsForm country={country} />
    </div>
  )
}

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton key={index} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  )
}
