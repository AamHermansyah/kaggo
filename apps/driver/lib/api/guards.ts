import "server-only"
import { safeLoad, type LoadResult } from "./safe-load"

export const loadPublic = <T>(loader: () => Promise<T>): Promise<LoadResult<T>> =>
  safeLoad(loader)
