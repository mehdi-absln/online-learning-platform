<template>
  <div class="animate-fade-in">
    <header>
      <UiPageHero
        title="Terms and Conditions"
        :breadcrumb-crumbs="breadcrumbCrumbs"
      />
    </header>

    <section class="container py-8 md:py-12">
      <div class="max-w-4xl mx-auto prose prose-invert prose-primary">
        <div class="space-y-6">
          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">
              1. Acceptance of Terms
            </h2>
            <p class="text-text-secondary leading-relaxed">
              By accessing and using this online learning platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">
              2. Use License
            </h2>
            <p class="text-text-secondary leading-relaxed">
              Permission is granted to temporarily access the materials (information or software) on our platform for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">
              3. Course Access and Content
            </h2>
            <p class="text-text-secondary leading-relaxed">
              Upon enrollment in a course, you will be granted access to course materials for the duration specified in the course description. All course content, including videos, documents, and materials, are the intellectual property of the platform and instructors.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">
              4. User Account
            </h2>
            <p class="text-text-secondary leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">
              5. Payment and Refunds
            </h2>
            <p class="text-text-secondary leading-relaxed">
              All payments are processed securely. Refund policies vary by course and are specified in the course description. Please review the refund policy before enrolling in a course.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">
              6. Prohibited Uses
            </h2>
            <p class="text-text-secondary leading-relaxed">
              You may not use our platform for any illegal or unauthorized purpose. You must not transmit any worms, viruses, or any code of a destructive nature.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">
              7. Limitation of Liability
            </h2>
            <p class="text-text-secondary leading-relaxed">
              We shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of the platform.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">
              8. Modifications
            </h2>
            <p class="text-text-secondary leading-relaxed">
              We reserve the right to revise these terms at any time. By using this platform, you agree to be bound by the current version of these terms and conditions.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">
              9. Governing Law
            </h2>
            <p class="text-text-secondary leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the platform operates.
            </p>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { SITE_NAME } from '~/constants'

useHead({
  title: `Terms and Conditions - ${SITE_NAME}`,
  meta: [
    {
      name: 'description',
      content: 'Read our terms and conditions for using the online learning platform.',
    },
  ],
})

const breadcrumbCrumbs = [{ name: 'Terms and Conditions', path: '/terms' }]
</script>
