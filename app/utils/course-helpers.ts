import type { CoursesFilter, ExtendedCoursesFilter } from '~/types/courses-filter'

// Helper function to extract filter from URL query
export const extractFilterFromUrl = (urlQuery: Record<string, unknown>): CoursesFilter => {
  const filter: CoursesFilter = {}

  // Helper function to parse array parameters
  const parseArrayParam = (param: unknown): string[] | undefined => {
    if (!param) return undefined
    if (Array.isArray(param)) return param as string[]
    return [param as string]
  }

  if (urlQuery.category) {
    filter.category = urlQuery.category as string
  }
  if (urlQuery.categories) {
    filter.categories = parseArrayParam(urlQuery.categories)
  }

  if (urlQuery.level) {
    filter.level = urlQuery.level as string
  }
  if (urlQuery.levels) {
    filter.levels = parseArrayParam(urlQuery.levels)
  }

  if (urlQuery.tag) {
    filter.tags = [urlQuery.tag as string]
  }
  else if (urlQuery.tags) {
    filter.tags = parseArrayParam(urlQuery.tags)
  }

  if (urlQuery.q) {
    filter.searchQuery = urlQuery.q as string
  }

  if (urlQuery.instructorId) {
    filter.instructorId = parseInt(urlQuery.instructorId as string)
  }

  if (urlQuery.minPrice) {
    filter.minPrice = parseInt(urlQuery.minPrice as string)
  }

  if (urlQuery.maxPrice) {
    filter.maxPrice = parseInt(urlQuery.maxPrice as string)
  }

  if (urlQuery.freeOnly) {
    filter.priceFilter = urlQuery.freeOnly === 'true' ? 'free' : filter.priceFilter
  }
  if (urlQuery.paidOnly) {
    filter.priceFilter = urlQuery.paidOnly === 'true' ? 'paid' : filter.priceFilter
  }

  return filter
}

// Helper function to build query parameters from filter
export const buildQueryParams = (filter: CoursesFilter, page: number, limit: number) => {
  const queryParams = new URLSearchParams()
  if (filter.category) queryParams.append('category', filter.category)
  if (filter.categories?.length)
    filter.categories.forEach(c => queryParams.append('categories', c))

  if (filter.level) queryParams.append('level', filter.level)
  if (filter.levels?.length) filter.levels.forEach(l => queryParams.append('levels', l))
  if (filter.tags?.length) filter.tags.forEach(t => queryParams.append('tags', t))
  if (filter.priceFilter === 'free') queryParams.append('freeOnly', 'true')
  if (filter.priceFilter === 'paid') queryParams.append('paidOnly', 'true')
  if (filter.searchQuery) queryParams.append('q', filter.searchQuery)
  if (filter.instructorId) queryParams.append('instructorId', filter.instructorId.toString())
  if (filter.minPrice) queryParams.append('minPrice', filter.minPrice.toString())
  if (filter.maxPrice) queryParams.append('maxPrice', filter.maxPrice.toString())
  queryParams.append('page', page.toString())
  queryParams.append('limit', limit.toString())
  return queryParams
}

// Helper function to update URL based on filter and page
export const updateUrl = (filter: CoursesFilter, page: number, itemsPerPage: number) => {
  const queryParams = buildQueryParams(filter, page, itemsPerPage)
  const queryString = queryParams.toString()
  const newRoute = queryString ? `/courses?${queryString}` : '/courses'
  const router = useRouter()
  router.replace(newRoute)
}

// Helper function to merge URL filter with store filter
export const mergeFilters = (
  storeFilter: CoursesFilter,
  urlFilter: CoursesFilter,
): ExtendedCoursesFilter => {
  // Determine price filter based on URL and store values
  let priceFilter: 'all' | 'free' | 'paid' = 'all'

  if (urlFilter.priceFilter) {
    priceFilter = urlFilter.priceFilter
  } else if (urlFilter.freeOnly) {
    priceFilter = 'free'
  } else if (urlFilter.paidOnly) {
    priceFilter = 'paid'
  } else if (storeFilter.priceFilter) {
    priceFilter = storeFilter.priceFilter
  } else if (storeFilter.freeOnly) {
    priceFilter = 'free'
  } else if (storeFilter.paidOnly) {
    priceFilter = 'paid'
  }

  return {
    categories: urlFilter.categories ?? storeFilter.categories ?? [],
    levels: urlFilter.levels ?? storeFilter.levels ?? [],
    tags: urlFilter.tags ?? storeFilter.tags ?? [],
    priceFilter,
    freeOnly: urlFilter.freeOnly ?? storeFilter.freeOnly ?? false,
    paidOnly: urlFilter.paidOnly ?? storeFilter.paidOnly ?? false,
    searchQuery: urlFilter.searchQuery ?? storeFilter.searchQuery ?? '',
    instructorId: urlFilter.instructorId ?? storeFilter.instructorId,
    minPrice: urlFilter.minPrice ?? storeFilter.minPrice,
    maxPrice: urlFilter.maxPrice ?? storeFilter.maxPrice,
  }
}
