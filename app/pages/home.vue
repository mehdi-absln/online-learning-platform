<template>
  <div>
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
      <div
        class="relative w-full aspect-video overflow-hidden"
        role="banner"
        aria-label="Hero banner"
      >
        <div class="absolute inset-0 w-full h-full">
          <div
            class="w-full h-full bg-cover bg-center bg-no-repeat bg-[url('@/public/images/banner.jpg')]"
          >
            <div class="absolute inset-0 bg-black bg-opacity-80" aria-hidden="true" />
          </div>
        </div>
        <div class="relative h-full flex items-center container">
          <div class="w-[60%] space-y-10">
            <h1
              id="main-heading"
              class="text-4xl font-antonio md:text-6xl lg:text-8xl font-bold text-white"
            >
              <span class="text-primary">GROW YOUR MIND</span>
              <span class="block">SHAPE YOUR FUTURE</span>
            </h1>
            <p class="text-base text-white">
              The key to learning is consistency — nothing more, nothing less. There's no secret
              formula, and it's never out of reach. Every skill starts with a single step.
            </p>
            <button
              class="relative font-antonio px-6 py-3 font-semibold text-white bg-gradient-to-r from-primary to-primary/90 group overflow-hidden"
            >
              <span
                class="absolute inset-0 w-0 bg-white/10 group-hover:w-full transition-all duration-500"
              />
              <span class="relative z-10 flex items-center">
                GET STARTED NOW
                <span class="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  >→</span
                >
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="bg-[#191918] py-32">
      <div class="container flex justify-between items-center flex-wrap md:flex-nowrap gap-x-6">
        <div class="w-[45%] relative">
          <img
            src="../public/images/laptop-near-whilte-book.jpg"
            alt="laptop near whilte book"
            class="h-full object-cover z-20 ml-auto block w-[95%] relative"
          />
          <div
            class="absolute left-0 -bottom-[50px] rotate-180 w-0 h-0 border-l-[420px] border-l-transparent border-t-[350px] border-t-[#E05243]"
          />
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
    <section class="bg-[#1F1F1E] py-32 relative z-0">
      <div
        class="absolute inset-0 flex justify-center gap-[50%] pointer-events-none items-end -z-10"
      >
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
          <Carousel v-model="currentSlide" :items-to-show="3" :wrap-around="true">
            <Slide v-for="slide in slides" :key="slide.id">
              <div class="w-[90%] rounded-3xl overflow-hidden">
                <div class="relative">
                  <div class="relative">
                    <div class="relative h-56">
                      <div class="absolute inset-0 bg-black bg-opacity-40 z-10" />
                      <img
                        src="../public/images/laptop-near-whilte-book.jpg"
                        alt="Course Image"
                        class="w-full h-full object-cover relative"
                      />
                    </div>
                  </div>
                  <div class="absolute top-6 flex items-center justify-between w-full px-4 z-10">
                    <span class="bg-primary text-white text-[13px] px-5 py-1.5 rounded-full">
                      COOKING
                    </span>
                    <button class="bg-white rounded-full p-1.5 shadow hover:bg-gray-100 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-[18px] w-[18px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#E05243"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 5v14l7-4 7 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div class="absolute bottom-3 left-4 flex items-center space-x-3 z-10">
                    <img
                      src="../public/images/laptop-near-whilte-book.jpg"
                      alt="User"
                      class="w-10 h-10 rounded-full border-2 border-solid border-white"
                    />
                    <span class="font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      >John Doe</span
                    >
                  </div>
                </div>

                <div class="px-4 bg-[#282828]">
                  <h3 class="text-[22px] font-semibold text-white py-6">
                    Mastering the Art of Cooking
                  </h3>
                  <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-1">
                      <div
                        class="w-9 h-9 flex items-center justify-center bg-transparent border border-white rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5.121 17.804A9.004 9.004 0 0112 15c2.21 0 4.21.803 5.879 2.121M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span class="text-white text-base font-medium pl-1">2 students</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <div
                        class="w-9 h-9 flex items-center justify-center bg-transparent border border-white rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-[#f8a406]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.21 3.726a1 1 0 00.95.69h3.905c.969 0 1.371 1.24.588 1.81l-3.158 2.295a1 1 0 00-.364 1.118l1.21 3.726c.3.921-.755 1.688-1.54 1.118l-3.158-2.295a1 1 0 00-1.176 0l-3.158 2.295c-.785.57-1.84-.197-1.54-1.118l1.21-3.726a1 1 0 00-.364-1.118L2.396 9.153c-.783-.57-.38-1.81.588-1.81h3.905a1 1 0 00.95-.69l1.21-3.726z"
                          />
                        </svg>
                      </div>
                      <span class="text-white font-medium text-base pl-2">4.8</span>
                    </div>
                  </div>
                  <hr class="my-6 border-gray-700 block" />
                  <div class="flex items-center justify-between pb-6">
                    <span class="text-base font-semibold text-primary-alt">$99</span>
                    <button
                      class="relative font-medium text-white group overflow-hidden rounded-md transition-colors duration-300 hover:text-primary"
                    >
                      <span class="relative z-10"> Explore Now </span>
                    </button>
                  </div>
                </div>
              </div>
            </Slide>
            <template #addons>
              <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
                <button
                  v-for="(slide, index) in slides"
                  :key="slide.id"
                  class="w-3 h-3 rounded-full transition-colors duration-300"
                  :class="currentSlide === index ? 'bg-primary' : 'bg-gray-100'"
                  @click="currentSlide = index"
                />
              </div>
            </template>
          </Carousel>
        </div>
      </div>
    </section>
    <section class="py-20 bg-[#191918]">
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
  </div>
</template>

<script setup lang="ts">
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const currentSlide = ref<number>(0)

const slides = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
</script>

<style scoped></style>
