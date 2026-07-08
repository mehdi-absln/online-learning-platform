export interface PaginationOptions {
  initialPage?: number
  initialLimit?: number
}

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalItems: number
  limit: number
}

export function usePagination(options: PaginationOptions = {}) {
  const {
    initialPage = 1,
    initialLimit = 12,
  } = options

  // ───── State ─────
  const currentPage = ref(initialPage)
  const limit = ref(initialLimit)
  const totalItems = ref(0)

  // ───── Computed ─────
  const totalPages = computed(() =>
    Math.ceil(totalItems.value / limit.value) || 1,
  )

  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)
  const isFirstPage = computed(() => currentPage.value === 1)
  const isLastPage = computed(() => currentPage.value === totalPages.value)

  const from = computed(() => {
    if (totalItems.value === 0) return 0
    return (currentPage.value - 1) * limit.value + 1
  })

  const to = computed(() =>
    Math.min(currentPage.value * limit.value, totalItems.value),
  )

  const pagination = computed<PaginationState>(() => ({
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    totalItems: totalItems.value,
    limit: limit.value,
  }))

  // ───── Actions ─────

  function goToPage(page: number): void {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value || 1))
  }

  function nextPage(): void {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  function prevPage(): void {
    if (hasPrevPage.value) {
      currentPage.value--
    }
  }

  function firstPage(): void {
    currentPage.value = 1
  }

  function lastPage(): void {
    currentPage.value = totalPages.value
  }

  function setLimit(newLimit: number): void {
    limit.value = newLimit
    currentPage.value = 1
  }

  function setTotalItems(total: number): void {
    totalItems.value = total
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  }

  function setPagination(data: Partial<PaginationState>): void {
    if (data.currentPage !== undefined) currentPage.value = data.currentPage
    if (data.limit !== undefined) limit.value = data.limit
    if (data.totalItems !== undefined) totalItems.value = data.totalItems
  }

  function reset(): void {
    currentPage.value = initialPage
    limit.value = initialLimit
    totalItems.value = 0
  }

  // ───── Return ─────
  return {
    // State
    currentPage,
    limit,
    totalPages,
    totalItems,

    // Computed
    pagination,
    hasNextPage,
    hasPrevPage,
    isFirstPage,
    isLastPage,
    from,
    to,

    // Actions
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setLimit,
    setTotalItems,
    setPagination,
    reset,
  }
}
