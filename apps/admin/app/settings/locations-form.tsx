"use client"

import { useState } from "react"
import { toast } from "sonner"

import { FormAlert } from "@/components/shared/form/form-alert"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextareaField } from "@/components/shared/form/textarea-field"
import { TextField } from "@/components/shared/form/text-field"
import { useActionForm } from "@/hooks/use-action-form"
import type { CsvUploadResult } from "@/lib/api/types"
import { companyLocationsCsvSchema } from "@/lib/validation/schemas/settings"
import { uploadCompanyLocationsAction } from "./actions"

const TEMPLATE = "companyName,locationLabel,address"

interface SkippedRow {
  line?: number
  reason?: string
}

function skippedRows(report: CsvUploadResult | undefined): SkippedRow[] {
  return Array.isArray(report?.skipped) ? report.skipped : []
}

/**
 * CSV bulk upload for company store locations.
 *
 * The endpoint takes the raw CSV as a JSON string rather than a multipart file,
 * so this is a textarea, not a file picker. The upload is idempotent: re-posting
 * the same rows updates addresses in place.
 */
export function CompanyLocationsForm({ country }: { country: string }) {
  const [report, setReport] = useState<CsvUploadResult | null>(null)

  const { form, onSubmit, pending, formError } = useActionForm({
    schema: companyLocationsCsvSchema,
    defaultValues: { country, csv: "" },
    action: uploadCompanyLocationsAction,
    onSuccess: (data) => {
      setReport(data)
      toast.success("Company locations uploaded")
      form.resetField("csv")
    },
  })

  const skipped = skippedRows(report ?? undefined)

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <TextField
        control={form.control}
        name="country"
        label="Country code"
        maxLength={2}
        className="h-11 w-28 uppercase"
      />

      <TextareaField
        control={form.control}
        name="csv"
        label="CSV contents"
        rows={8}
        spellCheck={false}
        placeholder={`${TEMPLATE}\nAKTC Transport,Lagos Depot,12 Marina Road, Lagos`}
        className="font-mono text-[13px]"
        description={
          <>
            First row must be <code className="font-mono">{TEMPLATE}</code>.
            Re-uploading the same company and label updates the address instead
            of duplicating it.
          </>
        }
      />

      <FormAlert message={formError} />

      {report ? (
        <div className="flex flex-col gap-2 rounded-xl border border-primary/20 bg-secondary p-4 text-[13px]">
          <p className="font-medium text-foreground">
            Upserted {String(report.upserted ?? "—")} location
            {report.upserted === 1 ? "" : "s"}.
          </p>
          {skipped.length > 0 ? (
            <ul className="flex list-disc flex-col gap-1 ps-4 text-foreground/70">
              {skipped.map((row, index) => (
                <li key={`${row.line ?? index}`}>
                  Line {row.line ?? "?"}: {row.reason ?? "skipped"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-foreground/70">No rows were skipped.</p>
          )}
        </div>
      ) : null}

      <SubmitButton
        pending={pending}
        pendingLabel="Uploading"
        size="sm"
        className="h-11 self-end px-6 text-[14px]"
      >
        Upload CSV
      </SubmitButton>
    </form>
  )
}
