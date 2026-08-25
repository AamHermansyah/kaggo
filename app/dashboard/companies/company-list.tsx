import { SectionError } from "@/components/shared/section-error"
import { CursorPager, ListEmpty, ListHeader } from "@/components/dashboard/list-chrome"
import { listCompanies } from "@/lib/api/admin"
import { loadAdmin } from "@/lib/api/guards"
import type { AdminListParams } from "@/lib/dashboard/params"
import { matchesQuery } from "@/lib/dashboard/params"
import { formatNumber } from "@/lib/format"
import { ROUTES } from "@/lib/routes"
import { CompanyCard } from "./company-card"

/**
 * Registered logistics companies and their approval state.
 *
 * The resource landed in the API's v1.1 update; before that the tab had no
 * backend at all and had to be replaced by Revenue.
 */
export async function CompanyList({
  token,
  params,
  canManage,
}: {
  token: string
  params: AdminListParams
  canManage: boolean
}) {
  const result = await loadAdmin(() =>
    listCompanies(token, { cursor: params.cursor })
  )

  if (!result.ok) {
    return <SectionError title="Could not load companies" result={result} />
  }

  const companies = result.data.items.filter((company) =>
    matchesQuery(params.query, company.name, company.companyCode, company.email)
  )

  const pending = companies.filter((c) => c.status === "PENDING").length

  return (
    <div className="flex flex-col gap-6">
      <ListHeader
        title="Companies"
        subtitle={
          pending > 0
            ? `${formatNumber(pending)} awaiting approval on this page`
            : `${formatNumber(companies.length)} on this page`
        }
      />

      {companies.length === 0 ? (
        <ListEmpty
          title="No companies match"
          description="Try a different name or company code, or clear the search."
        />
      ) : (
        <div className="flex flex-col gap-5">
          {companies.map((company) => (
            <CompanyCard
              key={company.companyId}
              company={company}
              canManage={canManage}
            />
          ))}
        </div>
      )}

      <CursorPager
        basePath={ROUTES.adminCompanies}
        params={params}
        pagination={result.data.pagination}
      />
    </div>
  )
}
