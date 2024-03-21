<template>
  <img v-if="props.src" :class="imageClasses" :src="props.src" :alt="fullName" :title="fullName" />
  <div v-else :class="placeholderClasses" :title="fullName">
    {{ fullNameInitials }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * First name of customer/consultant
     */
    firstName: string
    /**
     * Last name of customer/consultant
     */
    lastName: string
    /**
     * Size of avatar. Only applicable to image Avatars.
     */
    size?: 'sm' | 'md' | 'lg' | 'xl'
    /**
     * Image source URL, if available. Avatar will default to initials placeholder if this is not provided.
     */
    src?: string
    /**
     * Overrides initials placeholder calculated from firstName and lastName
     */
    initials?: string
  }>(),
  {
    size: 'lg'
  }
)

const fullName = computed(() => `${props.firstName} ${props.lastName}`)
const fullNameInitials = computed(
  () => props.initials || `${props.firstName[0]}${props.lastName[0]}`
)

const commonClasses = 'rounded-full select-none'

const imageClasses = computed(() => [
  commonClasses,
  'object-cover',
  {
    sm: 'size-16',
    md: 'size-24',
    lg: 'size-32',
    xl: 'size-40'
  }[props.size]
])

const placeholderClasses = [
  commonClasses,
  'size-32 text-sm bg-core-black text-core-white grid place-content-center'
]
</script>
