import type { CoursesFilter } from '~/types/courses-filter'

export interface UrlQueryParams {
  category?: string
  categories?: string | string[]
  level?: string
  levels?: string | string[]
  tag?: string
  tags?: string | string[]
  q?: string
  instructorId?: string
  minPrice?: string
  maxPrice?: string
  freeOnly?: string
  paidOnly?: string
  page?: string
  limit?: string
}

export interface UrlParams {
  filter: CoursesFilter
  page: number
  limit: number
}

/** Parse route query → structured filter + pagination (supports both old singular & new plural params) */
export const extractParamsFromUrl = (urlQuery: UrlQueryParams): UrlParams => {
  const filter: CoursesFilter = {}

  const parseArrayParam = (param: string | string[] | undefined): string[] | undefined => {
    if (!param) return undefined
    if (Array.isArray(param)) return param
    return [param]
  }

  const parseNumberParam = (param: string | undefined): number | undefined => {
    if (!param) return undefined
    const parsed = parseInt(param)
    return isNaN(parsed) ? undefined : parsed
  }

  // Filters
  if (urlQuery.category) filter.categories = [urlQuery.category]
  if (urlQuery.categories) filter.categories = parseArrayParam(urlQuery.categories)

  if (urlQuery.level) filter.levels = [urlQuery.level]
  if (urlQuery.levels) filter.levels = parseArrayParam(urlQuery.levels)

  if (urlQuery.tag) filter.tags = [urlQuery.tag]
  else if (urlQuery.tags) filter.tags = parseArrayParam(urlQuery.tags)

  if (urlQuery.q) filter.searchQuery = urlQuery.q

  if (urlQuery.instructorId) {
    const parsedId = parseNumberParam(urlQuery.instructorId)
    if (parsedId !== undefined) filter.instructorId = parsedId
  }

  if (urlQuery.minPrice) {
    const parsedMinPrice = parseNumberParam(urlQuery.minPrice)
    if (parsedMinPrice !== undefined) filter.minPrice = parsedMinPrice
  }
  if (urlQuery.maxPrice) {
    const parsedMaxPrice = parseNumberParam(urlQuery.maxPrice)
    if (parsedMaxPrice !== undefined) filter.maxPrice = parsedMaxPrice
  }

  if (urlQuery.freeOnly === 'true') filter.priceFilter = 'free'
  else if (urlQuery.paidOnly === 'true') filter.priceFilter = 'paid'

  // Pagination fallback
  const page = urlQuery.page ? parseNumberParam(urlQuery.page) : 1
  const limit = urlQuery.limit ? parseNumberParam(urlQuery.limit) : 12

  return {
    filter,
    page: typeof page === 'number' ? page : 1,
    limit: typeof limit === 'number' ? limit : 12,
  }
}

/** Order-independent array comparison */
export const arraysEqual = (a: string[] = [], b: string[] = []): boolean => {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((val, i) => val === sortedB[i])
}

/** Deep equality check for filters (used to prevent unnecessary updates) */
export const isFilterEqual = (a: CoursesFilter, b: CoursesFilter): boolean => {
  return (
    (a.searchQuery ?? '') === (b.searchQuery ?? '')
    && (a.priceFilter ?? 'all') === (b.priceFilter ?? 'all')
    && (a.instructorId ?? null) === (b.instructorId ?? null)
    && (a.minPrice ?? null) === (b.minPrice ?? null)
    && (a.maxPrice ?? null) === (b.maxPrice ?? null)
    && arraysEqual(a.categories ?? [], b.categories ?? [])
    && arraysEqual(a.levels ?? [], b.levels ?? [])
    && arraysEqual(a.tags ?? [], b.tags ?? [])
  )
}

/** Build clean URLSearchParams – only active filters are included */
export const buildQueryParams = (filter: CoursesFilter, page: number, limit: number): URLSearchParams => {
  const queryParams = new URLSearchParams()

  if (filter.categories?.length) filter.categories.forEach(c => c && queryParams.append('categories', c))
  if (filter.levels?.length) filter.levels.forEach(l => l && queryParams.append('levels', l))
  if (filter.tags?.length) filter.tags.forEach(t => t && queryParams.append('tags', t))

  if (filter.priceFilter === 'free') queryParams.append('freeOnly', 'true')
  if (filter.priceFilter === 'paid') queryParams.append('paidOnly', 'true')
  if (filter.searchQuery) queryParams.append('q', filter.searchQuery)
  if (filter.instructorId !== undefined) queryParams.append('instructorId', filter.instructorId.toString())
  if (filter.minPrice !== undefined) queryParams.append('minPrice', filter.minPrice.toString())
  if (filter.maxPrice !== undefined) queryParams.append('maxPrice', filter.maxPrice.toString())

  queryParams.append('page', page.toString())
  queryParams.append('limit', limit.toString())

  return queryParams
}

/** Update browser URL without triggering full navigation or history spam */
export const updateUrl = (filter: CoursesFilter, page: number, itemsPerPage: number): void => {
  if (!import.meta.client) return

  const queryParams = buildQueryParams(filter, page, itemsPerPage)
  const queryString = queryParams.toString()
  const newRoute = queryString ? `/courses?${queryString}` : '/courses'

  const router = useRouter()
  try {
    router.replace(newRoute)
  }
  catch (error) {
    console.error('Failed to update URL:', error)
  }
}
