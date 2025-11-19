<template>
  <div class="w-full">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="border border-gray-200 rounded-lg mb-2 overflow-hidden"
    >
      <button
        @click="toggleAccordion(index)"
        :aria-expanded="openItems[index] ? 'true' : 'false'"
        :aria-controls="`accordion-content-${index}`"
        class="flex justify-between items-center w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      >
        <span class="font-medium text-gray-800">{{ item.title }}</span>
        <svg
          :class="{ 'rotate-180': openItems[index] }"
          class="w-5 h-5 text-gray-600 transform transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      
      <div
        v-show="openItems[index]"
        :id="`accordion-content-${index}`"
        class="p-4 bg-white border-t border-gray-200 transition-all duration-200"
      >
        <div class="space-y-2">
          <div
            v-for="(lesson, lessonIndex) in item.lessons"
            :key="lessonIndex"
            class="flex items-center p-2 hover:bg-gray-50 rounded"
          >
            <svg
              class="w-4 h-4 text-primary mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span class="text-gray-700">{{ lesson }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AccordionItem {
  title: string;
  description?: string;
  lessons: string[];
  duration?: string;
}

interface Props {
  items: AccordionItem[];
}

const props = defineProps<Props>();

// Track which accordion items are open
const openItems = ref<boolean[]>(props.items.map(() => false));

// Toggle the accordion item at the specified index
const toggleAccordion = (index: number) => {
  // Toggle the state of the clicked item
  openItems.value[index] = !openItems.value[index];
  
  // Optional: Close other items if only one should be open at a time
  // props.items.forEach((_, i) => {
  //   if (i !== index) openItems.value[i] = false;
  // });
};
</script>