# Project Structure — Online Learning Platform

یک پلتفرم آموزش آنلاین مبتنی بر **Nuxt 4** (Vue 3 + TypeScript) با بک‌اند داخلی Nitro،
دیتابیس SQLite از طریق **Drizzle ORM** و استایل‌دهی با **Tailwind CSS**.

```
online-learning-platform/
├── و پوشه‌های پیکربندی ریشه
├── app/                 # کد سمت کلاینت (صفحات، کامپوننت‌ها، composables، storeها)
├── server/              # بک‌اند Nitro (API routes، سرویس‌های دیتابیس، schema)
├── plugins/             # پلاگین‌های سطح پروژه
├── public/              # فایل‌های استاتیک (تصاویر، آیکون‌ها، robots.txt)
├── scripts/             # اسکریپت‌های کمکی (مثل seed دیتابیس)
├── __tests__/           # تست‌های واحد/یکپارچه (Vitest)
└── ...                 # فایل‌های پیکربندی (پایین‌تر لیست شده)
```

---

## 📁 ریشه (Root)

| فایل | توضیح |
|------|-------|
| `package.json` | وابستگی‌ها و اسکریپت‌های پروژه (dev, build, test, lint, typecheck) |
| `package-lock.json` | قفل نسخه‌های نصب‌شده |
| `nuxt.config.ts` | پیکربندی اصلی Nuxt (ماژول‌ها، ریدایرکت، سورس‌ها) |
| `tsconfig.json` | تنظیمات TypeScript |
| `eslint.config.mjs` | قوانین lint |
| `.eslintignore` | مسیرهای نادیده‌گرفته‌شده توسط ESLint |
| `postcss.config.ts` | پیکربندی PostCSS |
| `tailwind.config.ts` | پیکربندی Tailwind (رنگ‌ها، فونت‌ها، تم) |
| `vitest.config.ts` | پیکربندی تست (Vitest) |
| `drizzle.config.ts` | پیکربندی Drizzle ORM (اتصال به SQLite) |
| `.env` / `.env.example` | متغیرهای محیطی (کلیدهای JWT و …) |
| `.gitignore` | مسیرهای نادیده‌گرفته‌شده توسط Git |
| `.prettierignore` | مسیرهای نادیده‌گرفته‌شده توسط Prettier |
| `README.md` | مستندات عمومی پروژه |
| `ARCHITECTURE.md` | مستند معماری سیستم |
| `build.log` | لاگ آخرین بیلد |
| `.idea/` | تنظیمات محیط JetBrains (WebStorm) |
| `.kilo/` | تنظیمات ادیتور Kilo Code |

---

## 📁 app/ — لایه کلاینت (Frontend)

### `app/app.vue`
نقطه ورود اصلی اپلیکیشن (شامل `<NuxtLayout>` و `<NuxtPage>`).

### `app/error.vue`
صفحه خطای سراسری (error page).

### `app/assets/`
- `css/app.css` — استایل‌های سراسری.
- `css/fonts.css` — تعریف فونت‌ها.

### `app/components/`
کامپوننت‌های قابل‌استفاده مجدد، دسته‌بندی شده:

**admin/**
- `AdminTabs.vue` — تب‌های پنل ادمین.
- `CourseForm.vue` — فرم ایجاد/ویرایش دوره.

**blogs/**
- `BlogCard.vue` — کارت نمایش بلاگ.
- `BlogCardSkeleton.vue` — حالت بارگذاری کارت بلاگ.
- `BlogDetailSkeleton.vue` — حالت بارگذاری جزئیات بلاگ.
- `BlogImage.vue` — تصویر بلاگ با بهینه‌سازی.
- `BlogsGrid.vue` — شبکه نمایش بلاگ‌ها.

**courses/**
- `CourseCard.vue` — کارت دوره.
- `CourseCardSkeleton.vue` — حالت بارگذاری کارت دوره.
- `CourseDetailSidebar.vue` — سایدبار جزئیات دوره.
- `CourseDetailSkeleton.vue` — حالت بارگذاری جزئیات دوره.
- `CourseImage.vue` — تصویر دوره.
- `CourseInfoTab.vue` — تب اطلاعات دوره.
- `CourseReviews.vue` — نمایش نظرات دوره.
- `CoursesGrid.vue` — شبکه نمایش دوره‌ها.
- `CourseSidebarFilters.vue` — فیلترهای سایدبار دوره.
- `FilterCheckboxGroup.vue` — گروه چک‌باکس فیلتر.
- `FilterRadioGroup.vue` — گروه رادیو فیلتر.
- `RelatedCourses.vue` — دوره‌های مرتبط.

**dashboard/**
- `DashboardBookmarks.vue` — نشانک‌های داشبورد.
- `DashboardContinueLearningCard.vue` — کارت ادامه یادگیری.
- `DashboardCourseCard.vue` — کارت دوره در داشبورد.
- `DashboardMyCourses.vue` — دوره‌های من.
- `DashboardOrders.vue` — سفارش‌های کاربر.
- `DashboardSkeleton.vue` — حالت بارگذاری داشبورد.
- `DashboardStatsCard.vue` — کارت آمار داشبورد.

**home/**
- `HomeAbout.vue` — بخش درباره ما در صفحه اصلی.
- `HomeBlog.vue` — بخش بلاگ‌های صفحه اصلی.
- `HomeHero.vue` — هدر اصلی (Hero).
- `HomePopularClasses.vue` — کلاس‌های محبوب.
- `HomeStats.vue` — آمار صفحه اصلی.
- `HomeTestimonials.vue` — نظرات کاربران.
- `HomeTrainers.vue` — مدرسین.

**icons/**
آیکون‌های SVG به‌صورت کامپوننت Vue:
`IconAlertCircle`, `IconArrowRight`, `IconBookmark`, `IconBookOpen`,
`IconCalendar`, `IconCheckCircle`, `IconChevronLeft`, `IconChevronRight`,
`IconClock`, `IconFacebook`, `IconLinkedIn`, `IconLock`, `IconPlus`,
`IconShare`, `IconSpinner`, `IconTwitter`, `IconUsers`.

**lesson/**
- `LessonContent.vue` — محتوای درس.
- `LessonNav.vue` — ناوبری بین درس‌ها.
- `LessonSidebar.vue` — سایدبار درس‌ها.
- `LessonVideo.vue` — پخش‌کننده ویدیو درس.

**ui/** — کامپوننت‌های رابط کاربری عمومی
- `Accordion.vue` — آکوردئون.
- `Breadcrumb.vue` — مسیر ناوبری (Breadcrumb).
- `CartDrawer.vue` — کشوی سبد خرید.
- `ConfirmModal.vue` — مودال تأیید.
- `EmptyState.vue` — حالت خالی.
- `ErrorState.vue` — حالت خطا.
- `FormCheckbox.vue` — چک‌باکس فرم.
- `FormInput.vue` — ورودی فرم.
- `LoadingSpinner.vue` — نشانگر بارگذاری.
- `PageHero.vue` — هدر صفحات داخلی.
- `Pagination.vue` — صفحه‌بندی.
- `SearchInput.vue` — ورودی جستجو.
- `StarRating.vue` — امتیازدهی ستاره‌ای.
- `SubmitButton.vue` — دکمه ارسال.
- `Tabs.vue` — تب‌ها.
- `Toast.vue` — اعلان (Toast).

**عمومی**
- `AvatarImage.vue` — تصویر آواتار کاربر.
- `MainFooter.vue` — فوتر سایت.
- `MainNav.vue` — منوی اصلی (Navigation).
- `MarkdownRenderer.vue` — رندرکننده محتوای Markdown.

### `app/composables/`
توابع composable (منطق قابل‌استفاده مجدد):
- `useAccordion.ts` — منطق آکوردئون.
- `useApiError.ts` — مدیریت خطاهای API.
- `useBlog.ts` / `useBlogs.ts` / `useBlogFilters.ts` — مدیریت بلاگ‌ها و فیلترها.
- `useCart.ts` — سبد خرید.
- `useCourse.ts` / `useCourses.ts` / `useCourseFilters.ts` — مدیریت دوره‌ها و فیلترها.
- `useDashboard.ts` — داده‌های داشبورد.
- `useFocusTrap.ts` — گیر انداختن فوکوس (دسترسی‌پذیری مودال).
- `useKeyboardFocus.ts` — مدیریت فوکوس کیبورد.
- `useLesson.ts` — منطق درس.
- `useNavigationLinks.ts` — لینک‌های ناوبری.
- `usePagination.ts` — صفحه‌بندی.
- `useRelatedCourses.ts` — دوره‌های مرتبط.
- `useToast.ts` — نمایش اعلان‌ها.
- `useZodValidation.ts` — اعتبارسنجی فرم با Zod.

### `app/constants/`
- `home.ts` — ثابت‌های مربوط به صفحه اصلی.
- `index.ts` — خروجی مشترک ثابت‌ها.

### `app/layouts/`
- `default.vue` — لایوت پیش‌فرض (با ناوبری و فوتر).
- `auth.vue` — لایوت صفحات احراز هویت.
- `minimal.vue` — لایوت مینیمال.

### `app/middleware/`
- `admin.ts` — محافظت از مسیرهای ادمین.
- `auth.global.ts` — میدل‌ور سراسری احراز هویت.

### `app/pages/`
مسیرهای صفحات (file-based routing):

**عمومی**
- `home.vue` — صفحه اصلی.
- `about.vue` — درباره ما.
- `terms.vue` — قوانین و مقررات.
- `profile.vue` — پروفایل کاربر.
- `dashboard.vue` — داشبورد کاربر.

**auth/**
- `auth/SignIn.vue` — ورود.
- `auth/SignUp.vue` — ثبت‌نام.

**courses/**
- `courses/index.vue` — لیست دوره‌ها.
- `courses/[courseSlug]/index.vue` — جزئیات دوره.
- `courses/[courseSlug]/lessons/index.vue` — لیست درس‌های دوره.
- `courses/[courseSlug]/lessons/[lessonSlug].vue` — صفحه درس.

**blogs/**
- `blogs/index.vue` — لیست بلاگ‌ها.
- `blogs/[slug].vue` — جزئیات بلاگ.

**checkout/**
- `checkout/index.vue` — صفحه پرداخت.
- `checkout/success.vue` — موفقیت پرداخت.
- `checkout/failed.vue` — خطای پرداخت.

**admin/**
- `admin/index.vue` — داشبورد ادمین.
- `admin/courses/create.vue` — ایجاد دوره.
- `admin/courses/[id]/edit.vue` — ویرایش دوره.
- `admin/users/index.vue` — مدیریت کاربران.

### `app/plugins/`
- `purify.client.ts` — پلاگین DOMPurify سمت کلاینت.
- `purify.server.ts` — پلاگین DOMPurify سمت سرور (پاکسازی HTML).

### `app/schemas/`
- `admin.ts` — اسکیمای Zod بخش ادمین.
- `auth.ts` — اسکیمای Zod احراز هویت.

### `app/stores/`
استیت مدیریت (Pinia):
- `blogs.ts` — استیت بلاگ‌ها.
- `cart.ts` — استیت سبد خرید.
- `courses.ts` — استیت دوره‌ها.
- `lesson-progress.ts` — پیشرفت درس کاربر.
- `user.ts` — استیت کاربر (احراز هویت).

### `app/types/`
تعریف تایپ‌های TypeScript:
- `api.ts` — تایپ‌های عمومی API.
- `auth.ts` — تایپ‌های احراز هویت.
- `blog.ts` — تایپ‌های بلاگ.
- `course.ts` — تایپ‌های دوره.
- `dashboard.ts` — تایپ‌های داشبورد.
- `lesson.ts` — تایپ‌های درس.
- `user.ts` — تایپ‌های کاربر.
- `components/accordion.ts` — تایپ آکوردئون.
- `components/tabs.ts` — تایپ تب‌ها.
- `forms/course-form.ts` — تایپ فرم دوره.

### `app/utils/`
توابع کمکی:
- `auth-error-handler-helpers.ts` — مدیریت خطاهای احراز هویت.
- `course-helpers.ts` — کمکی‌های دوره.
- `error-helpers.ts` — کمکی‌های خطا.
- `price-helpers.ts` — فرمت‌بندی قیمت.
- `slug.ts` — تولید slug.
- `text-helpers.ts` — کمکی‌های متنی.

---

## 📁 server/ — لایه بک‌اند (Nitro)

### `server/api/` — مسیرهای API (file-based)

**admin/**
- `admin/courses/index.get.ts` / `index.post.ts` — لیست/ایجاد دوره (ادمین).
- `admin/courses/[id].get.ts` / `.put.ts` / `.delete.ts` — خواندن/ویرایش/حذف دوره.
- `admin/users/index.get.ts` — لیست کاربران.
- `admin/users/[id].put.ts` / `.delete.ts` — ویرایش/حذف کاربر.

**auth/**
- `auth/signup.post.ts` — ثبت‌نام.
- `auth/signin.post.ts` — ورود.
- `auth/logout.post.ts` — خروج.
- `auth/me.get.ts` — اطلاعات کاربر جاری.
- `auth/change-password.post.ts` — تغییر رمز عبور.

**blogs/**
- `blogs/index.get.ts` / `index.post.ts` — لیست/ایجاد بلاگ.
- `blogs/[id].get.ts` / `.put.ts` / `.delete.ts` — خواندن/ویرایش/حذف بلاگ.
- `blogs/slug/[slug].get.ts` — دریافت بلاگ با slug.

**cart/**
- `cart/index.get.ts` / `index.post.ts` — لیست/افزودن به سبد خرید.
- `cart/[courseId].delete.ts` — حذف از سبد خرید.
- `cart/merge.post.ts` — ادغام سبد خرید (مهمان ↔ کاربر).

**course-by-slug/**
- `course-by-slug/[courseSlug].get.ts` — جزئیات دوره با slug.
- `course-by-slug/[courseSlug]/lessons/[lessonSlug].get.ts` — جزئیات درس.

**courses/**
- `courses/index.get.ts` — لیست دوره‌ها (با فیلتر/صفحه‌بندی).
- `courses/bulk.post.ts` — ایجاد انبوه دوره.
- `courses/count.get.ts` — تعداد دوره‌ها.
- `courses/filter-options.get.ts` — گزینه‌های فیلتر.
- `courses/[courseId]/related.get.ts` — دوره‌های مرتبط.

**checkout/**
- `checkout/index.post.ts` — ایجاد سفارش/پرداخت.

**dashboard/**
- `dashboard/index.get.ts` — داده‌های داشبورد کاربر.

**enrollments/**
- `enrollments/my.get.ts` — دوره‌های ثبت‌نام‌شده کاربر.

**orders/**
- `orders/index.get.ts` — لیست سفارش‌ها.
- `orders/[id].get.ts` — جزئیات سفارش.

**progress/**
- `progress/index.get.ts` — پیشرفت کاربر.
- `progress/complete.post.ts` — تکمیل درس.
- `progress/bookmark.post.ts` — نشانک‌گذاری درس.
- `progress/notes.post.ts` — ثبت یادداشت درس.

**users/**
- `users/[id].get.ts` — اطلاعات کاربر.

### `server/db/` — لایه دیتابیس (Drizzle)
- `index.ts` — راه‌اندازی اتصال دیتابیس و Drizzle.
- `schema.ts` — تعریف جداول (users, courses, lessons, blogs, orders, cart, …).
- `migrate.ts` — اجرای مایگریشن‌ها.
- `blog-service.ts` — عملیات CRUD بلاگ.
- `cart-service.ts` — عملیات سبد خرید.
- `course-service.ts` — عملیات دوره.
- `dashboard-service.ts` — عملیات داشبورد.
- `order-service.ts` — عملیات سفارش.
- `progress-service.ts` — عملیات پیشرفت درس.
- `review-service.ts` — عملیات نظرات.
- `user-service.ts` — عملیات کاربر.

### `server/drizzle/migrations/`
- `0000_init.sql` — مایگریشن اولیه.
- `0001_lovely_prowler.sql` — مایگریشن دوم.
- `meta/_journal.json` — فهرست مایگریشن‌ها.
- `meta/0000_snapshot.json` / `meta/0001_snapshot.json` — اسنپ‌شات‌های اسکیما.

### `server/data/`
- `db.sqlite` (+ `.sqlite-shm` / `.sqlite-wal`) — فایل دیتابیس SQLite محلی.

### `server/utils/` — توابع کمکی بک‌اند
- `auth-helpers.ts` — کمکی‌های احراز هویت.
- `blog-helpers.ts` — کمکی‌های بلاگ.
- `course-authorization.ts` — بررسی دسترسی دوره.
- `course-transformer.ts` — تبدیل داده‌های دوره.
- `format-utils.ts` — فرمت‌بندی.
- `image-processor.ts` — پردازش تصویر.
- `instructor-service.ts` — عملیات مدرس.
- `jwt.ts` — تولید/تأیید توکن JWT.
- `lesson-access.ts` — بررسی دسترسی به درس.
- `related-courses.ts` — محاسبه دوره‌های مرتبط.
- `response.ts` — ساخت پاسخ‌های یکپارچه API.
- `safe-parse.ts` — پارس ایمن ورودی‌ها.

---

## 📁 plugins/
پلاگین‌های سطح ریشه (در این پروژه خالی/نگه‌دارنده — منطق در `app/plugins` قرار دارد).

---

## 📁 public/ — فایل‌های استاتیک
- `icon/UPST0179.png` … `UPST0182.png` — آیکون‌های سایت (favicon/iOS).
- `images/banner.jpg` — بنر.
- `images/laptop-near-whilte-book.jpg` — تصویر تبلیغاتی.
- `images/placeholder-avatar.svg` — تصویر جایگزین آواتار.
- `images/placeholder-blog.svg` — تصویر جایگزین بلاگ.
- `images/placeholder-course.svg` — تصویر جایگزین دوره.
- `robots.txt` — دستورالعمل‌های خزنده‌های موتور جستجو.

---

## 📁 scripts/
- `seed.ts` — اسکریپت پر کردن دیتابیس با داده‌های اولیه (seed).

---

## 📁 __tests__/ — تست‌ها (Vitest)
- `setup.ts` — راه‌اندازی محیط تست.
- `helpers/db.ts` — کمکی دیتابیس تست.

**api/** — تست‌های endpoint: `cart`, `checkout`, `orders`.
**components/** — تست کامپوننت‌ها: `Accordion` (چند فایل)، `CourseCard`,
`CourseFilterCheckbox`, `DashboardStatsCard`, `EmptyState`, `ErrorState`,
`LessonContent`, `LessonVideo`, `Pagination`, `Tabs`.
**composables/** — تست composableها: `useLesson`, `useToast`, `useZodValidation`.
**integration/** — تست یکپارچه: `course-filters-integration`.
**pages/** — تست صفحات: `auth`, `CourseDetailPageUpdated`, `lesson-header`,
`lesson-page`, `lesson-video`.
**services/** — تست سرویس‌ها: `cart-service`, `course-transformer`, `order-service`.
**stores/** — تست storeها: `lesson-progress`, `user-store`.
**unit/** — تست واحد: `related-courses`.
**utils/** — تست utils: `authErrorHandler`.

---

## 🗂 پوشه‌های تولید‌شده (خارج از کنترل نیستند — خروجی build)
- `.nuxt/` — خروجی داخلی Nuxt (حین dev/build).
- `.output/` — خروجی تولید نهایی.
- `.vercel/` — خروجی دیپلوی روی Vercel.
- `node_modules/` — وابستگی‌های npm.

> این پوشه‌ها توسط `.gitignore` نادیده گرفته می‌شوند و بخشی از سورس پروژه نیستند.
