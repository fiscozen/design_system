<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzStepperProps, FzStepProps } from './types'
import { useMediaQuery } from "@fiscozen/composables";
import { breakpoints } from "@fiscozen/style";
import { FzBadge } from "@fiscozen/badge";
import { FzIcon } from "@fiscozen/icons";
import { FzDropdown } from '@fiscozen/dropdown';

const props = withDefaults(defineProps<FzStepperProps>(), {
    disableProgressBar: false,
})
const smOrSmaller = useMediaQuery(`(max-width: ${breakpoints.sm})`);

const activeStep = defineModel<number>('activeStep', {
    default: 0,
})

const emit = defineEmits([])

const dropdownContainer = ref<HTMLElement | null>(null)
const dropdownRect = computed(() => {
    return dropdownContainer.value?.getBoundingClientRect()
})

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
    if (props.steps[index].status === 'disabled') {
        return
    }
    if (index === activeStep.value) {
        return
    }
    activeStep.value = index
}
</script>

<template>
    <div class="fz-stepper flex flex-row w-full gap-16" v-if="!smOrSmaller">
        <div @click="handleActionClick(index)" :class="['fz-stepper__step flex flex-col grow cursor-pointer', {'opacity-[.2] !cursor-not-allowed': step.status === 'disabled'}]"
            v-for="(step, index) in props.steps">
            <div :class="['fz-stepper__progress h-4 rounded-5 w-full mb-8', barClass(step, index)]" v-if="!disableProgressBar">
            </div>
            <div class="flex flex-row gap-8 items-start">
                <div class="fz-stepper__circle flex items-center justify-center">
                    <FzIcon v-if="stepStatus[index] === 'error'" name="circle-exclamation" variant="fas" size="md"
                        class="text-semantic-error" />
                    <FzIcon v-else-if="stepStatus[index] === 'completed'" name="circle-check" variant="fas" size="md"
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
                :class="['fz-stepper__progress h-4 rounded-5 w-full mb-8', barClass(step, index)]" v-if="!disableProgressBar">
            </div>
        </div>
        <div class="flex flex-row gap-8 items-center" ref="dropdownContainer">
            <div class="fz-stepper__circle flex items-center justify-center">
                <FzIcon v-if="stepStatus[activeStep] === 'error'" name="circle-exclamation" variant="fas" size="md"
                    class="text-semantic-error" />
                <FzIcon v-else-if="stepStatus[activeStep] === 'completed'" name="circle-check" variant="fas" size="md"
                    class="text-grey-500" />
                <FzBadge v-else size="sm" :color="badgeColor[activeStep]">{{ activeStep + 1 }}</FzBadge>
            </div>
            <FzDropdown
                :actions="props.steps.map((step, index) => ({
                    label: step.title,
                    type: 'button',
                }))"
                align="right"
                listClass="gap-8 !p-0 w-full"
                class="fz-stepper__dropdown grow flex"
                @fzaction:click="handleActionClick">
                <template #opener="{ isOpen, open }">
                    <div class="flex flex-col grow cursor-pointer" @click="open">
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
                <template v-for="(step, index) in props.steps" #[`fzaction-item-${index}`]="{close}">
                    <div :class="['flex flex-col grow cursor-pointer hover:bg-background-alice-blue px-16 py-6 min-w-sm', {
                        'rounded border-2 border-solid border-blue-200': activeStep === index,
                        '!cursor-not-allowed': step.status === 'disabled',
                    }]"
                    :style="{
                        width: `${dropdownRect?.width}px`,
                    }"
                    @click="handleActionClick(index);close()">
                        <span :class="['font-medium text-core-black grow', {'text-grey-200': step.status === 'disabled'}]">{{ step.title }}</span>
                        <span :class="['text-sm', {'text-grey-200': step.status === 'disabled'}]">{{ step.description }}</span>
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
</style>
