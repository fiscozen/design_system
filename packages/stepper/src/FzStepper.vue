<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzStepperProps, FzStepProps } from './types'
import { useMediaQuery } from "@fiscozen/composables";
import { breakpoints } from "@fiscozen/style";
import { FzBadge } from "@fiscozen/badge";
import { FzIcon } from "@fiscozen/icons";
import { FzDropdown } from '@fiscozen/dropdown';

const props = withDefaults(defineProps<FzStepperProps>(), {
    progressBar: true,
})
const smOrSmaller = useMediaQuery(`(max-width: ${breakpoints.sm})`);

const activeStep = defineModel<number>('activeStep', {
    default: 0,
})

const emit = defineEmits([])

const stepStatus = computed(() => {
    return props.steps.map((step, index) => {
        if (index === activeStep.value) {
            return 'current'
        } else if (step.status === 'error') {
            return 'error'
        } else if (step.status === 'completed') {
            return 'completed'
        } else {
            return 'default'
        }
    })
})

const barClass = (step: FzStepProps, index: number) => ({
    'bg-blue-500': stepStatus.value[index] === 'current',
    'bg-semantic-error': stepStatus.value[index] === 'error',
    'bg-grey-500': stepStatus.value[index] === 'completed',
    'bg-grey-200': stepStatus.value[index] === 'default',
});
const badgeColor = computed(() => {
    return stepStatus.value.map((status) => {
        if (status === 'current') {
            return 'blue'
        } else if (status === 'error') {
            return 'error'
        } else if (status === 'completed') {
            return 'dark'
        } else {
            return 'light'
        }
    })
})
const handleActionClick = (index: number) => {
    if (index === activeStep.value) {
        return
    }
    activeStep.value = index
}
</script>

<template>
    <div class="fz-stepper flex flex-row w-full gap-16" v-if="!smOrSmaller">
        <div @click="() => activeStep = index" class="fz-stepper__step flex flex-col grow cursor-pointer"
            v-for="(step, index) in props.steps">
            <div :class="['fz-stepper__progress h-4 rounded-5 w-full mb-8', barClass(step, index)]" v-if="progressBar">
            </div>
            <div class="flex flex-row gap-8 items-start">
                <div class="fz-stepper__circle flex items-center justify-center">
                    <FzIcon v-if="stepStatus[index] === 'error'" name="circle-exclamation" variant="fas" size="lg"
                        class="text-semantic-error" />
                    <FzIcon v-else-if="stepStatus[index] === 'completed'" name="circle-check" variant="fas" size="lg"
                        class="text-grey-500" />
                    <FzBadge v-else size="sm" :color="badgeColor[index]">{{ index + 1 }}</FzBadge>
                </div>
                <div class="flex-col">
                    <div class="fz-stepper__title text-core-black font-medium">{{ step.title }}</div>
                    <div class="fz-stepper__description mt-4 text-grey-500 text-sm">{{ step.description }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="fz-stepper flex flex-col w-full gap-8" v-if="smOrSmaller">
        <div class="flex flex-row gap-8">
            <div v-for="(step, index) in props.steps"
                :class="['fz-stepper__progress h-4 rounded-5 w-full mb-8', barClass(step, index)]" v-if="progressBar">
            </div>
        </div>
        <div class="flex flex-row gap-8 items-center">
            <div class="fz-stepper__circle flex items-center justify-center">
                <FzIcon v-if="stepStatus[activeStep] === 'error'" name="circle-exclamation" variant="fas" size="lg"
                    class="text-semantic-error" />
                <FzIcon v-else-if="stepStatus[activeStep] === 'completed'" name="circle-check" variant="fas" size="lg"
                    class="text-grey-500" />
                <FzBadge v-else size="sm" :color="badgeColor[activeStep]">{{ activeStep + 1 }}</FzBadge>
            </div>
            <FzDropdown
                :actions="props.steps.map((step, index) => ({
                    label: step.title,
                    type: 'button',
                }))"
                class="fz-stepper__dropdown w-full grow flex"
                @fzaction:click="handleActionClick">
                <template #opener="{ isOpen, open }">
                    <div class="flex flex-col w-full grow cursor-pointer" @click="open">
                        <div class="flex flex-row size-full justify-between items-center cursor-pointer">
                            <span class="font-medium text-core-black grow">{{ props.steps[activeStep].title }}</span>
                            <FzIcon
                                :name="isOpen ? 'angle-up' : 'angle-down'"
                                size="lg"
                                class="ml-4 cursor-pointer"
                            ></FzIcon>
                        </div>
                        <span class="text-sm">{{ props.steps[activeStep].description }}</span>
                    </div>
                </template>
            </FzDropdown>
        </div>
    </div>
</template>

<style scoped>
:deep(.fz-stepper__dropdown .inline-flex) {
    flex-grow: 1;
}
:deep(.fz__floating__content) {
    width: 100%;
}
</style>
