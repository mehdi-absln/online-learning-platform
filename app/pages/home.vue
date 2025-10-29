<script setup lang="ts">
useSeoMeta({
  title: 'Home - Online Learning Platform',
  ogTitle: 'Home - Online Learning Platform',
  description: 'Start your learning journey with our comprehensive online courses taught by expert instructors.',
  ogDescription: 'Start your learning journey with our comprehensive online courses taught by expert instructors.',
  ogImage: '/images/banner.jpg',
})

import { Carousel, Slide, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import CourseCard from '~/components/CourseCard.vue'

const trainers = [
  {
    id: 1,
    name: 'Jonathan Bean',
    role: 'Lead Instructor',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
    social: [
      { name: 'Facebook', url: '#' },
      { name: 'Twitter', url: '#' },
      { name: 'LinkedIn', url: '#' }
    ]
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'UI/UX Expert',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80',
    social: [
      { name: 'Twitter', url: '#' },
      { name: 'LinkedIn', url: '#' },
      { name: 'Instagram', url: '#' }
    ]
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Full Stack Developer',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    social: [
      { name: 'GitHub', url: '#' },
      { name: 'LinkedIn', url: '#' },
      { name: 'Twitter', url: '#' }
    ]
  },
  {
    id: 4,
    name: 'Emma Wilson',
    role: 'DevOps Engineer',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    social: [
      { name: 'Facebook', url: '#' },
      { name: 'Twitter', url: '#' },
      { name: 'LinkedIn', url: '#' }
    ]
  }
]

const slides = [
  {
    id: 1,
    title: 'Mastering the Art of Cooking',
    category: 'COOKING',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=70',
    instructor: {
      name: 'Chef Maria Garcia',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    stats: {
      students: 42,
      lessons: 24,
      duration: '8h 30m',
      level: 'Intermediate'
    },
    rating: 4.8,
    price: 89.99
  },
  {
    id: 2,
    title: 'Web Development Bootcamp',
    category: 'PROGRAMMING',
    image:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=60',
    instructor: {
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    stats: {
      students: 156,
      lessons: 36,
      duration: '42h 15m',
      level: 'Beginner'
    },
    rating: 4.9,
    price: 129.99
  },
  {
    id: 3,
    title: 'Digital Marketing Mastery',
    category: 'MARKETING',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    instructor: {
      name: 'Sarah Williams',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    stats: {
      students: 87,
      lessons: 18,
      duration: '15h 45m',
      level: 'All Levels'
    },
    rating: 4.7,
    price: 79.99
  },
  {
    id: 4,
    title: 'Photography Fundamentals',
    category: 'PHOTOGRAPHY',
    image:
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop&q=60',
    instructor: {
      name: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    stats: {
      students: 63,
      lessons: 22,
      duration: '12h 10m',
      level: 'Beginner'
    },
    rating: 4.6,
    price: 69.99
  },
  {
    id: 5,
    title: 'Data Science Essentials',
    category: 'DATA SCIENCE',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    instructor: {
      name: 'Dr. Emily Chen',
      avatar: 'https://randomuser.me/api/portraits/women/52.jpg'
    },
    stats: {
      students: 94,
      lessons: 30,
      duration: '35h 20m',
      level: 'Advanced'
    },
    rating: 4.9,
    price: 149.99
  }
]

const latestNews = [
  {
    id: 1,
    title: 'New Web Development Course Launched',
    author: 'Alex Johnson',
    date: '2025-08-15',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
    excerpt: 'Learn the latest web development technologies in our new comprehensive course.'
  },
  {
    id: 2,
    title: 'Top 10 Tips for Learning Programming',
    author: 'Sarah Williams',
    date: '2025-08-20',
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60',
    excerpt: 'Discover the most effective strategies to accelerate your programming journey.'
  },
  {
    id: 3,
    title: 'The Future of Online Education',
    author: 'Michael Chen',
    date: '2025-08-25',
    image:
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Exploring how technology is transforming the way we learn and acquire new skills.'
  }
]

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Web Development Student',
    content:
      'The courses here completely transformed my career. The instructors are knowledgeable and the curriculum is well-structured. Highly recommended!',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'UI/UX Designer',
    content:
      'I was able to upgrade my skills significantly through their design courses. The practical projects were especially valuable for my portfolio.',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Data Science Enthusiast',
    content:
      'The quality of instruction and course materials exceeded my expectations. The community support is also fantastic!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Full-stack Developer',
    content:
      'The hands-on approach helped me understand complex concepts easily. The certificate I earned helped me land a great job!',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative w-full overflow-hidden">
      <div class="absolute top-0 left-0 z-10 pointer-events-none flex flex-col items-start">
        <div class="w-[320px] h-[250px] bg-[#E05243] [clip-path:polygon(0_0,100%_0,0_100%)] z-10" />
        <div class="w-[550px] h-[55px] bg-black/50 -rotate-[37deg] origin-left z-0 mb-5" />
        <div class="w-[1900px] h-[550px] bg-black/10 -rotate-[37deg] origin-left z-0" />
      </div>
      <div class="absolute bottom-[-60px] right-[-300px] z-10 -rotate-[40deg]">
        <div class="w-[1200px] h-[140px] bg-[#E05243] mb-6" />
        <div class="w-[1200px] h-[140px] bg-[#E05243]" />
      </div>
      <div class="relative w-full aspect-video overflow-hidden" role="banner" aria-label="Hero banner">
        <div class="absolute inset-0 w-full h-full">
          <div class="w-full h-full bg-cover bg-center bg-no-repeat bg-[url('@/public/images/banner.jpg')]">
            <div class="absolute inset-0 bg-black bg-opacity-80" aria-hidden="true" />
          </div>
        </div>
        <div class="relative h-full flex items-center container">
          <div class="w-[60%] space-y-10">
            <h1 id="main-heading" class="text-4xl font-antonio md:text-6xl lg:text-8xl font-bold text-white">
              <span class="text-primary">GROW YOUR MIND</span>
              <span class="block">SHAPE YOUR FUTURE</span>
            </h1>
            <p class="text-base text-white">
              The key to learning is consistency — nothing more, nothing less. There's no secret
              formula, and it's never out of reach. Every skill starts with a single step.
            </p>
            <NuxtLink to="/auth/sign-up" class="inline-block">
              <button
                class="relative font-antonio px-6 py-3 font-semibold text-white bg-gradient-to-r from-primary to-primary/90 group overflow-hidden">
                <span class="absolute inset-0 w-0 bg-white/10 group-hover:w-full transition-all duration-500" />
                <span class="relative z-10 flex items-center">
                  GET STARTED NOW
                  <span class="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    <!-- About Section -->
    <section class="py-32">
      <div class="container flex justify-between items-center flex-wrap md:flex-nowrap gap-x-6">
        <div class="w-[45%] relative">
          <img src="../public/images/laptop-near-whilte-book.jpg" alt="laptop near whilte book"
            class="h-full object-cover z-20 ml-auto block w-[95%] relative" />
          <div
            class="absolute left-0 -bottom-[50px] rotate-180 w-0 h-0 border-l-[420px] border-l-transparent border-t-[350px] border-t-[#E05243]" />
        </div>
        <div class="w-[45%]">
          <h5 class="text-sm text-primary font-semibold font-antonio tracking-[2px] pb-4">
            WE LOVE GUIDING YOUR LEARNING JOURNEY
          </h5>
          <h2 class="text-5xl font-antonio font-semibold text-white leading-[4.7rem]">
            Empowering learners with knowledge and tools
            <span class="text-primary">for success</span>
          </h2>
          <p class="text-[#C2C2C2] text-base py-6">
            The first thing to remember about success is that it is a process – nothing more,
            nothing less. There is really no magic to it and it’s not reserved only for a select few
            people.
          </p>
          <div class="flex flex-wrap justify-between gap-y-6">
            <div class="bg-[#282828] py-4 px-6 flex justify-center items-center gap-x-5 w-[47%]">
              <div>
                <img src="../public/icon/UPST0182.png" alt="UPST0182" loading="lazy" />
              </div>
              <div>
                <h5 class="font-antonio font-bold text-white text-base">
                  Supportive and inspiring learning
                </h5>
              </div>
            </div>
            <div class="bg-[#282828] py-4 px-6 flex justify-center items-center gap-x-5 w-[47%]">
              <div>
                <img src="../public/icon/UPST0181.png" alt="UPST0181" loading="lazy" />
              </div>
              <div>
                <h5 class="font-antonio font-bold text-white text-base">
                  Learning experience that is rewarding and meaningful
                </h5>
              </div>
            </div>
            <div class="bg-[#282828] py-4 px-6 flex justify-center items-center gap-x-5 w-[47%]">
              <div>
                <img src="../public/icon/UPST0180.png" alt="UPST0180" loading="lazy" />
              </div>
              <div>
                <h5 class="font-antonio font-bold text-white text-base">
                  Bringing together knowledge, skills, and growth
                </h5>
              </div>
            </div>
            <div class="bg-[#282828] py-4 px-6 flex justify-center items-center gap-x-5 w-[47%]">
              <div>
                <img src="../public/icon/UPST0179.png" alt="UPST0179" loading="lazy" />
              </div>
              <div>
                <h5 class="font-antonio font-bold text-white text-base">
                  We help you achieve your learning goals
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Online Classes Section -->
    <section class="bg-[#1F1F1E] py-32 relative z-0">
      <div class="absolute inset-0 flex justify-center gap-[50%] pointer-events-none items-end -z-10">
        <div class="w-px h-[95%] bg-primary transform -skew-x-[25deg]" />
        <div class="w-px h-[95%] bg-primary transform -skew-x-[25deg]" />
      </div>
      <div class="container relative z-20">
        <div class="text-center pb-14">
          <h5 class="text-sm text-primary font-semibold font-antonio tracking-[2px] pb-4">
            ONLINE CLASSES
          </h5>
          <h2 class="text-5xl font-antonio font-semibold text-white leading-[4.7rem]">
            OUR POPULAR CLASSES
          </h2>
        </div>
        <div>
          <Carousel :items-to-show="3" :wrap-around="false" :mouse-drag="true" :touch-drag="true">
            <Slide v-for="slide in slides" :key="slide.id">
              <div class="w-[95%] group">
                <CourseCard :course="slide" />
              </div>
            </Slide>
            <template #addons>
              <Pagination :paginate-by-items-to-show="true" />
            </template>
          </Carousel>
        </div>
      </div>
    </section>
    <!-- Stats Section -->
    <section class="py-20">
      <div class="container">
        <div class="flex flex-wrap justify-center gap-8 text-center">
          <div class="flex-1 min-w-[200px] max-w-[300px] p-6">
            <div class="text-5xl font-bold text-primary mb-2 font-antonio">1200</div>
            <p class="text-white text-base pt-2">Hours Of Learning</p>
          </div>

          <div class="flex-1 min-w-[200px] max-w-[300px] p-6">
            <div class="text-5xl font-bold text-primary mb-2 font-antonio">10,145</div>
            <p class="text-white text-base pt-2">Total Tutorials</p>
          </div>

          <div class="flex-1 min-w-[200px] max-w-[300px] p-6">
            <div class="text-5xl font-bold text-primary mb-2 font-antonio">3745</div>
            <p class="text-white text-base pt-2">Enrolled Learners</p>
          </div>
          <div class="flex-1 min-w-[200px] max-w-[300px] p-6">
            <div class="text-5xl font-bold text-primary mb-2 font-antonio">100%</div>
            <p class="text-white text-base pt-2">Achieve learning goals</p>
          </div>
        </div>
        <hr class="my-6 border-gray-700 block w-full" />
      </div>
    </section>
    <!-- Trainers Section -->
    <section class="py-32">
      <div class="container">
        <div class="text-center pb-14">
          <h5 class="text-sm text-primary font-semibold font-antonio tracking-[2px] pb-4">
            Trainers
          </h5>
          <h2 class="text-5xl font-antonio font-semibold text-white leading-[4.7rem]">
            Meet our top trainers
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <div v-for="trainer in trainers" :key="trainer.id" class="relative overflow-hidden h-96 group">
            <img :src="trainer.image" :alt="trainer.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div
              class="absolute inset-0 bg-black/60 transition-all duration-300 p-6 flex flex-col items-start justify-end h-full">
              <div class="relative overflow-hidden group z-20 py-6 px-6 flex flex-col w-full">
                <div class="text-center w-full">
                  <h3
                    class="text-white text-xl font-bold font-antonio cursor-pointer hover:text-[#021E40] transition-colors duration-300">
                    {{ trainer.name }}
                  </h3>
                  <span class="text-white text-xs uppercase pt-1">{{ trainer.role }}</span>
                </div>
                <div
                  class="absolute inset-0 w-1/5 h-full bg-primary transition-all duration-300 group-hover:w-full -z-10" />
                <div class="flex justify-center space-x-3 pt-4 w-full">
                  <template v-for="(social, index) in trainer.social" :key="index">
                    <a v-if="social.name === 'Facebook'" :href="social.url" target="_blank" rel="noopener noreferrer"
                      class="text-white transition-transform duration-300 hover:-translate-y-1"
                      :aria-label="social.name">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clip-rule="evenodd" />
                      </svg>
                    </a>
                    <a v-else-if="social.name === 'Twitter'" :href="social.url" target="_blank"
                      rel="noopener noreferrer"
                      class="text-white transition-transform duration-300 hover:-translate-y-1"
                      :aria-label="social.name">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a v-else-if="social.name === 'LinkedIn'" :href="social.url" target="_blank"
                      rel="noopener noreferrer"
                      class="text-white transition-transform duration-300 hover:-translate-y-1"
                      :aria-label="social.name">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Testimonials Section -->
    <section class="pt-16 pb-24">
      <div class="container">
        <div class="text-center pb-14">
          <h5 class="text-sm text-primary font-semibold font-antonio tracking-[2px] pb-4">
            Testimonials
          </h5>
          <h2 class="text-5xl font-antonio font-semibold text-white leading-[4.7rem]">
            What they say about us
          </h2>
        </div>
        <div class="relative">
          <Carousel :items-to-show="2" :wrap-around="false" :mouse-drag="true" :touch-drag="true"
            class="testimonial-carousel">
            <Slide v-for="testimonial in testimonials" :key="testimonial.id">
              <div
                class="bg-transparent p-8 border-2 border-[#474746] rounded-2xl text-center mx-4 relative overflow-hidden before:content-['\201C'] before:absolute before:top-4 before:right-4 before:text-[#3a3a3a] before:text-9xl before:font-serif before:leading-none before:opacity-20 before:pointer-events-none">
                <div class="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-2 border-primary">
                  <img :src="testimonial.avatar" :alt="testimonial.name" class="w-full h-full object-cover" />
                </div>
                <p class="text-gray-300 text-lg mb-6">"{{ testimonial.content }}"</p>
                <h4 class="text-white text-xl font-semibold">{{ testimonial.name }}</h4>
                <p class="text-primary text-sm">{{ testimonial.role }}</p>
              </div>
            </Slide>
            <template #addons>
              <Pagination />
            </template>
          </Carousel>
        </div>
      </div>
    </section>
    <!-- Blog Section -->
    <section class="py-16">
      <div class="container">
        <div class="text-center pb-14">
          <h5 class="text-sm text-primary font-semibold font-antonio tracking-[2px] pb-4">
            Latest tips & news
          </h5>
          <h2 class="text-5xl font-antonio font-semibold text-white leading-[4.7rem]">
            Have a look at our news
          </h2>
        </div>
        <div class="flex flex-wrap justify-center gap-8">
          <div v-for="(item, index) in latestNews" :key="index"
            class="group cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
            <div class="relative h-48 overflow-hidden">
              <img :src="item.image" :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300" />
            </div>
            <div class="py-8">
              <div class="flex items-center text-white">
                <span class="uppercase text-sm font-medium">
                  by <NuxtLink to="/" class="hover:underline">{{ item.author }}</NuxtLink>
                </span>
                <div class="mx-4 bg-primary w-2 h-2" />
                <span class="uppercase text-sm font-medium">
                  {{ formatDate(item.date) }}
                </span>
              </div>
              <h4 class="text-[22px] font-semibold text-white mt-4 font-antonio">
                {{ item.title }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
:deep(.carousel__pagination) {
  @apply flex justify-center absolute -bottom-11;
}

:deep(.carousel__pagination-button) {
  @apply p-0 m-0 border-0;
}

:deep(.carousel__pagination-button) {
  @apply block w-3 h-3 rounded-full mx-1;
  @apply bg-gray-400;
  @apply transition-all duration-300;
  content: '';
}

:deep(.carousel__pagination-button--active) {
  @apply bg-primary;
}
</style>
