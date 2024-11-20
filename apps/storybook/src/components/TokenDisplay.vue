<template>
  <div class="grid grid-cols-1 gap-4 p-20">
    <div v-for="(tokens, key) in sortedGroups" :key="key" class="border !mb-20 flex flex-col">
      <div class="!mb-10 border-b-1 p-4 !text-2xl font-medium capitalize">{{ key }}</div>
      <div class="flex flex-1 flex-col items-center justify-between gap-10 p-4">
        <div
          v-for="token in tokens"
          :key="token.name"
          class="border flex w-full items-center justify-between border-gray-200 p-4"
        >
          <div class="flex-1 font-medium text-gray-800">{{ token.name }}</div>
          <div class="flex-1 text-gray-500">{{ token.value }}</div>
          <div style="flex: 2" class="flex justify-end">
            <div
              v-if="key === 'color' || key === 'borderColor'"
              class="h-24 w-24 rounded-full border-1"
              :style="{ 'background-color': token.value }"
            ></div>
            <div v-else-if="key === 'fontSizes'" :style="{ 'font-size': token.value }">Aa</div>
            <div v-else-if="key === 'fontWeights'" :style="{ 'font-weight': token.value }">Aa</div>
            <div v-else-if="key === 'lineHeights'" :style="{ 'line-height': token.value }">Aa</div>
            <div
              v-else-if="key === 'boxShadow'"
              class="h-56 w-56 rounded-lg bg-grey-100"
              :style="convertObjectToBoxShadow(token.value)"
            ></div>
            <div
              v-else-if="key === 'spacing'"
              class="h-12 bg-gray-300"
              :style="{ width: token.value }"
            ></div>
            <div v-else-if="key === 'textDecoration'" :style="{ 'text-decoration': token.value }">
              Aa
            </div>
            <div
              v-else-if="key === 'borderRadius'"
              class="h-56 w-56 border-1 bg-gray-300"
              :style="{ 'border-radius': token.value }"
            ></div>
            <div
              v-else-if="key === 'borderWidth'"
              class="h-56 w-56 border-1 border-pink-500 bg-gray-100"
              :style="{ 'border-width': token.value }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import tokens from '@fiscozen/style/output/global.json'

const exludeTokens = ['avatar', 'button', 'nav-link', 'breadcrumbs', 'path']

const groups = ref({})

onMounted(() => {
  groups.value = tokens.reduce((acc, token) => {
    const key = token.type
    if (exludeTokens.some((exclude) => token.name.includes(exclude))) return acc

    if (!acc[key]) {
      acc[key] = []
    }

    if (acc[key].includes(token)) return acc

    acc[key].push(token)
    return acc
  })

  Object.keys(groups.value).forEach((key) => {
    if (!Array.isArray(groups.value[key]) || key === 'path') {
      delete groups.value[key]
    }
  })
})

const sortedGroups = computed(() =>
  Object.keys(groups.value)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      acc[key] = groups.value[key]
      return acc
    }, {})
)

const convertObjectToBoxShadow = (value) => {
  let values = ''

  if (Array.isArray(value)) {
    values = value.map((v) => `${v.x}px ${v.y}px ${v.blur}px ${v.spread}px ${v.color}`).join(',')
  } else {
    values = `${value.x}px ${value.y}px ${value.blur}px ${value.spread}px ${value.color}`
  }

  return `box-shadow:${values};`
}
</script>

<style scoped>
div {
  font-family: 'Inter', sans-serif;
}
</style>
