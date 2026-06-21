import { eq, and } from 'drizzle-orm'
import { db } from './index'
import { lessonProgress } from './schema'
import type { NewLessonProgress } from './schema'

// Get all progress for a user
export async function getProgressByUserId(userId: number) {
  return await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId))
}

// Get progress for specific lesson
export async function getProgress(userId: number, lessonId: number) {
  const result = await db
    .select()
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.userId, userId),
        eq(lessonProgress.lessonId, lessonId),
      ),
    )
    .limit(1)

  return result[0] || null
}

// Create or update progress
export async function upsertProgress(
  userId: number,
  lessonId: number,
  data: Partial<NewLessonProgress>,
) {
  const existing = await getProgress(userId, lessonId)
  const now = new Date()

  if (existing) {
    // Update
    await db
      .update(lessonProgress)
      .set({
        ...data,
        updatedAt: now,
      })
      .where(eq(lessonProgress.id, existing.id))

    return await getProgress(userId, lessonId)
  }
  else {
    // Insert
    const result = await db
      .insert(lessonProgress)
      .values({
        userId,
        lessonId,
        isCompleted: false,
        isBookmarked: false,
        progressPercentage: 0,
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return result[0]
  }
}

// Toggle complete
export async function toggleComplete(userId: number, lessonId: number) {
  const existing = await getProgress(userId, lessonId)
  const isCompleted = !existing?.isCompleted

  return await upsertProgress(userId, lessonId, {
    isCompleted,
    completedAt: isCompleted ? new Date() : null,
    progressPercentage: isCompleted ? 100 : 0,
  })
}

// Toggle bookmark
export async function toggleBookmark(userId: number, lessonId: number) {
  const existing = await getProgress(userId, lessonId)

  return await upsertProgress(userId, lessonId, {
    isBookmarked: !existing?.isBookmarked,
  })
}

// Save notes
export async function saveNotes(userId: number, lessonId: number, notes: string) {
  return await upsertProgress(userId, lessonId, { notes })
}

// Get progress for multiple lessons (for course progress)
export async function getProgressByLessonIds(userId: number, lessonIds: number[]) {
  if (lessonIds.length === 0) return []

  const results = await db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId))

  return results.filter(p => lessonIds.includes(p.lessonId))
}
