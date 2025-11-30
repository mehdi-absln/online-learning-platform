/**
 * تابعی برای استخراج آی‌دی ویدیو از لینک یوتیوب
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  // انواع مختلف لینک یوتیوب:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtu.be/VIDEO_ID

  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  if (match && match[2].length === 11) {
    return match[2]
  }

  return null
}

/**
 * تابعی برای ساخت لینک تعبیه‌شده یوتیوب
 */
export const createYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`
}
