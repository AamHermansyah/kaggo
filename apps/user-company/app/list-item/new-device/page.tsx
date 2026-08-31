import { redirect } from "next/navigation"

/**
 * The "new device" screen was a duplicate of `/list-item` — same call, one
 * extra field. It now lives there behind `?device=new`; this route is kept so
 * existing links and bookmarks still work.
 */
export default function ListItemNewDeviceRedirect() {
  redirect("/list-item?device=new")
}
