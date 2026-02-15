const BLOG_LIMIT = 9

export function useBlogFilters() {
  const route = useRoute()
  const router = useRouter()

  const totalItems = useState<number>('blog-total-items', () => 0)

  // URL = Single Source of Truth
  const urlParams = computed(() => ({
    search: (route.query.q as string) || '',
    page: Number(route.query.page) || 1,
  }))

  // Pagination computed
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / BLOG_LIMIT) || 1,
  )

  const currentPage = computed(() => urlParams.value.page)

  const setTotalItems = (total: number) => {
    totalItems.value = total
  }

  // URL update
  const updateFilters = (params: { search?: string, page?: number }) => {
    const query: Record<string, string> = {}

    const search = params.search ?? urlParams.value.search
    const page = params.page ?? urlParams.value.page

    if (search) query.q = search
    if (page > 1) query.page = String(page)

    router.push({
      path: '/blogs',
      query: Object.keys(query).length > 0 ? query : undefined,
    })
  }

  const searchBlogs = (query: string) => {
    updateFilters({ search: query, page: 1 })
  }

  const changePage = (page: number) => {
    updateFilters({ page })
  }

  const clearSearch = () => {
    updateFilters({ search: '', page: 1 })
  }

  return {
    currentPage,
    searchQuery: computed(() => urlParams.value.search),
    limit: BLOG_LIMIT,

    totalItems,
    totalPages,
    hasNextPage: computed(() => currentPage.value < totalPages.value),
    hasPrevPage: computed(() => currentPage.value > 1),

    setTotalItems,
    searchBlogs,
    changePage,
    clearSearch,
  }
}
