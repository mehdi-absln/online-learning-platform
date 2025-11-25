/**
 * تبدیل یک رشته به شکل slug مناسب برای URL
 * @param text - متنی که باید به slug تبدیل شود
 * @returns slug تولید شده
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()                    // تبدیل به حروف کوچک
    .trim()                          // حذف فضاهای اول و انتها
    .replace(/[^\w\s-]/g, '')        // حذف کاراکترهای غیرمجاز
    .replace(/[\s_-]+/g, '-')        // تبدیل فضاها و خط زیر به خط تیره
    .replace(/^-+|-+$/g, '')         // حذف خط تیره‌های اول و انتها
}

/**
 * اعتبارسنجی یک slug
 * @param slug - slug مورد بررسی
 * @returns صحت slug
 */
export function isValidSlug(slug: string): boolean {
  // slug باید تنها شامل حروف، اعداد و خط تیره باشد و با خط تیره شروع یا تمام نشود
  const slugRegex = /^(?!-)[a-z0-9-]+(?<!-)$/
  return slugRegex.test(slug)
}