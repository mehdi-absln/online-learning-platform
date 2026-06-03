import type { Blog } from '~/types/blog'

export const useBlogsStore = defineStore('blogs', () => {
  // ============== State ==============
  const blogs = ref<Blog[]>([])
  const currentBlog = ref<Blog | null>(null)

  // ============== Getters ==============
  const getBlogBySlug = computed(() =>
    (slug: string) => blogs.value.find(blog => blog.slug === slug),
  )

  const getBlogById = computed(() =>
    (id: number) => blogs.value.find(blog => blog.id === id),
  )

  const hasBlogs = computed(() => blogs.value.length > 0)

  // ============== Actions ==============
  function setBlogs(data: Blog[]) {
    blogs.value = data
  }

  function setCurrentBlog(blog: Blog | null) {
    currentBlog.value = blog
  }

  function clearCurrentBlog() {
    currentBlog.value = null
  }

  function $reset() {
    blogs.value = []
    currentBlog.value = null
  }

  return {
    blogs,
    currentBlog,
    getBlogBySlug,
    getBlogById,
    hasBlogs,
    setBlogs,
    setCurrentBlog,
    clearCurrentBlog,
    $reset,
  }
})
