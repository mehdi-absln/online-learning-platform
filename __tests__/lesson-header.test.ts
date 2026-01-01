import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LessonHeader from '~/components/lesson/LessonHeader.vue'

describe('LessonHeader', () => {
  it('renders correctly with props', () => {
    const mockCourse = {
      id: 1,
      title: 'Test Course',
      slug: 'test-course'
    }
    
    const mockLesson = {
      id: 1,
      title: 'Test Lesson',
      createdAt: new Date()
    }
    
    const wrapper = mount(LessonHeader, {
      props: {
        course: mockCourse,
        lesson: mockLesson,
        currentIndex: 1,
        totalLessons: 5,
        progressPercentage: 20,
        prevLesson: null,
        nextLesson: null,
        isScrolled: false
      }
    })
    
    expect(wrapper.text()).toContain('Test Lesson')
    expect(wrapper.text()).toContain('Lesson 2 of 5')
  })
})