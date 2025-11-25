<template>
  <div :class="containerClasses">
    <img
      v-if="props.src"
      :class="avatarClasses"
      :src="props.src"
      :alt="fullName"
      :title="fullName"
    />
    <div v-else :class="avatarClasses" :title="fullName" data-testid="avatar-placeholder">
      {{ fullNameInitials }}
    </div>
    <div v-if="hasText" :class="textContainerClasses">
      <p v-if="props.title" :class="titleClasses">{{ props.title }}</p>
      <p v-if="props.subtitle" :class="subtitleClasses">{{ props.subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FzAvatarProps } from './types'

const props = withDefaults(defineProps<FzAvatarProps>(), {
  environment: 'frontoffice',
  variant: 'default'
})

const sizeToEnvironmentMapping = {
  sm: 'backoffice',
  md: 'backoffice',
  lg: 'frontoffice',
  xl: 'frontoffice'
}

const mappedEnvironment = computed(() => {
  if (props.size) return sizeToEnvironmentMapping[props.size]

  return props.environment
})
const fullName = computed(() => `${props.firstName} ${props.lastName}`)
const fullNameInitials = computed(
  () => props.initials || `${props.firstName[0]}${props.lastName[0]}`
)

const hasText = computed(() => !!(props.title || props.subtitle))

// Container classes: flex row with gap based on environment
const containerClasses = computed(() => [
  'flex',
  'items-center',
  {
    'gap-8': mappedEnvironment.value === 'backoffice',
    'gap-12': mappedEnvironment.value === 'frontoffice'
  }
])

// Avatar classes: size based on environment, shape based on variant
const avatarClasses = computed(() => {
  const baseClasses = [
    'select-none',
    'object-cover',
    {
      'size-32': mappedEnvironment.value === 'backoffice',
      'size-44': mappedEnvironment.value === 'frontoffice'
    }
  ]

  // Shape based on variant
  if (props.variant === 'square') {
    baseClasses.push('rounded-[8px]')
  } else {
    baseClasses.push('rounded-full')
  }

  // Placeholder (initials) specific classes
  if (!props.src) {
    baseClasses.push('bg-core-black', 'text-core-white', 'grid', 'place-content-center', 'text-sm')
  }

  return baseClasses
})

// Text container classes: flex column with gap based on environment
const textContainerClasses = computed(() => [
  'flex',
  'flex-col',
  {
    'gap-0': mappedEnvironment.value === 'backoffice',
    'gap-[2px]': mappedEnvironment.value === 'frontoffice'
  },
  'min-w-0',
  'flex-1'
])

// Title classes: font size and weight based on environment
const titleClasses = computed(() => [
  'font-semibold',
  'text-core-black',
  'overflow-hidden',
  'text-ellipsis',
  'whitespace-nowrap',
  {
    'text-sm !leading-[16px]': mappedEnvironment.value === 'backoffice',
    'text-base !leading-[20px]': mappedEnvironment.value === 'frontoffice'
  }
])

// Subtitle classes: font size based on environment
const subtitleClasses = computed(() => [
  '!m-0',
  'font-normal',
  'text-grey-500',
  'overflow-hidden',
  'text-ellipsis',
  'whitespace-nowrap',
  'text-sm !leading-[16px]'
])
</script>
