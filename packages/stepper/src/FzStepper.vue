<script setup lang="ts">
import { computed, ref } from "vue";
import {
  FzStepperProps,
  FzStepProps,
  FzInternalStepStatus,
  StepMeta,
} from "./types";
import type { FzBadgeTone } from "@fiscozen/badge";
import { useMediaQuery } from "@fiscozen/composables";
import { breakpoints } from "@fiscozen/style";
import { FzBadge } from "@fiscozen/badge";
import { FzIcon } from "@fiscozen/icons";
import { FzDropdown } from "@fiscozen/dropdown";

const props = withDefaults(defineProps<FzStepperProps>(), {
  hasStepbar: true,
  hasStepperList: true,
  environment: "frontoffice",
  forceMobile: false,
});

const smOrSmaller = useMediaQuery(`(max-width: ${breakpoints.sm})`);

const activeStep = defineModel<number>("activeStep", {
  default: 0,
});

const isMobile = computed(() => smOrSmaller.value || props.forceMobile);

const dropdownContainer = ref<HTMLElement | null>(null);
const dropdownRect = computed(() =>
  dropdownContainer.value?.getBoundingClientRect(),
);

const stepMeta = computed<StepMeta[]>(() =>
  props.steps.map((step, index) => {
    let status: FzInternalStepStatus;
    if (index === activeStep.value) {
      status = "current";
    } else if (step.status === "error") {
      status = "error";
    } else if (step.status === "completed") {
      status = "completed";
    } else {
      status = "default";
    }

    let tone: FzBadgeTone;
    if (status === "current") {
      tone = "blue";
    } else if (status === "error") {
      tone = "error";
    } else if (status === "completed") {
      tone = "dark";
    } else {
      tone = "light";
    }

    let icon: string | undefined;
    if (status === "completed") {
      icon = "check";
    } else if (status === "error") {
      icon = "exclamation";
    } else {
      icon = undefined;
    }

    return {
      status,
      barClass: [
        "h-[4px] rounded-[4px] w-full mb-8",
        {
          "bg-blue-500": status === "current",
          "bg-grey-500": status === "completed",
          "bg-grey-200": status === "default",
          "bg-semantic-error": status === "error",
        },
      ],
      tone,
      icon,
    };
  }),
);

const dropdownActions = computed(() =>
  props.steps.map((step) => ({ label: step.title, type: "action" as const })),
);

const handleActionClick = (index: number) => {
  if (props.steps[index].status === "disabled") return;
  if (index === activeStep.value) return;
  activeStep.value = index;
};

const showDescription = (step: FzStepProps) =>
  step.hasStepDescription !== false && !!step.description;
</script>

<template>
  <!-- Desktop layout -->
  <div class="fz-stepper flex flex-row gap-16" v-if="!isMobile">
    <div
      @click="handleActionClick(index)"
      :class="[
        'fz-stepper__step flex flex-col w-[156px] shrink-0 cursor-pointer py-[10px]',
        { 'opacity-[.2] !cursor-not-allowed': step.status === 'disabled' },
      ]"
      v-for="(step, index) in props.steps"
      :key="index"
    >
      <div
        :class="['fz-stepper__progress', stepMeta[index].barClass]"
        v-if="hasStepbar"
      ></div>
      <div class="flex flex-row gap-8 items-start">
        <FzBadge :tone="stepMeta[index].tone" variant="number">
          <FzIcon
            v-if="stepMeta[index].icon"
            :name="stepMeta[index].icon!"
            variant="fas"
            size="sm"
          />
          <template v-else>{{ index + 1 }}</template>
        </FzBadge>
        <div class="min-w-0 flex flex-col gap-[4px]">
          <span
            :class="[
              'fz-stepper__title font-semibold block leading-[20px]',
              stepMeta[index].status === 'error'
                ? 'text-semantic-error'
                : 'text-core-black',
              { truncate: step.isTextTruncated },
            ]"
          >
            {{ step.title }}
          </span>
          <span
            v-if="showDescription(step)"
            v-small
            v-color:grey
            :class="[
              'fz-stepper__description leading-[20px]',
              { truncate: step.isTextTruncated },
            ]"
          >
            {{ step.description }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile layout -->
  <div class="fz-stepper flex flex-col w-full gap-8" v-if="isMobile">
    <div class="flex flex-row gap-8" v-if="hasStepbar">
      <div
        v-for="(step, index) in props.steps"
        :key="index"
        :class="['fz-stepper__progress', stepMeta[index].barClass]"
      ></div>
    </div>

    <!-- With step navigation dropdown -->
    <div
      class="flex flex-row gap-8 items-center"
      ref="dropdownContainer"
      v-if="hasStepperList"
    >
      <FzBadge :tone="stepMeta[activeStep].tone" variant="number">
        <FzIcon
          v-if="stepMeta[activeStep].icon"
          :name="stepMeta[activeStep].icon!"
          variant="fas"
          size="sm"
        />
        <template v-else>{{ activeStep + 1 }}</template>
      </FzBadge>
      <FzDropdown
        :actions="dropdownActions"
        align="right"
        listClass="gap-8 !p-0 w-full"
        class="fz-stepper__dropdown grow flex"
        @fzaction:click="handleActionClick"
      >
        <template #opener="{ isOpen, open }">
          <div class="flex flex-col grow cursor-pointer" @click="open">
            <div
              class="flex flex-row size-full justify-between items-center cursor-pointer"
            >
              <span
                :class="[
                  'font-medium grow',
                  stepMeta[activeStep].status === 'error'
                    ? 'text-semantic-error'
                    : 'text-core-black',
                  { truncate: props.steps[activeStep].isTextTruncated },
                ]"
                >{{ props.steps[activeStep].title }}</span
              >
              <FzIcon
                :name="isOpen ? 'angle-up' : 'angle-down'"
                size="lg"
                class="ml-4"
              />
            </div>
            <span
              v-if="showDescription(props.steps[activeStep])"
              :class="[
                'text-sm',
                { truncate: props.steps[activeStep].isTextTruncated },
              ]"
              >{{ props.steps[activeStep].description }}</span
            >
          </div>
        </template>
        <template
          v-for="(step, index) in props.steps"
          #[`fzaction-item-${index}`]="{ close }"
        >
          <div
            :class="[
              'flex flex-col grow cursor-pointer hover:bg-background-alice-blue px-16 py-6 min-w-sm',
              {
                'rounded border-2 border-solid border-blue-200':
                  activeStep === index,
                '!cursor-not-allowed': step.status === 'disabled',
              },
            ]"
            :style="{
              width: `${dropdownRect?.width}px`,
            }"
            @click="
              handleActionClick(index);
              close();
            "
          >
            <span
              :class="[
                'font-medium grow',
                { 'text-grey-200': step.status === 'disabled' },
                { truncate: step.isTextTruncated },
              ]"
              >{{ step.title }}</span
            >
            <span
              v-if="showDescription(step)"
              :class="[
                'text-sm',
                { 'text-grey-200': step.status === 'disabled' },
                { truncate: step.isTextTruncated },
              ]"
              >{{ step.description }}</span
            >
          </div>
        </template>
      </FzDropdown>
    </div>

    <!-- Without step navigation (hasStepperList = false) -->
    <div class="flex flex-row gap-8 items-center" v-else>
      <FzBadge :tone="stepMeta[activeStep].tone" variant="number">
        <FzIcon
          v-if="stepMeta[activeStep].icon"
          :name="stepMeta[activeStep].icon!"
          variant="fas"
          size="sm"
        />
        <template v-else>{{ activeStep + 1 }}</template>
      </FzBadge>
      <div class="flex flex-col grow min-w-0">
        <span
          :class="[
            'font-medium',
            stepMeta[activeStep].status === 'error'
              ? 'text-semantic-error'
              : 'text-core-black',
            { truncate: props.steps[activeStep].isTextTruncated },
          ]"
          >{{ props.steps[activeStep].title }}</span
        >
        <span
          v-if="showDescription(props.steps[activeStep])"
          :class="[
            'text-sm',
            { truncate: props.steps[activeStep].isTextTruncated },
          ]"
          >{{ props.steps[activeStep].description }}</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.fz-stepper__dropdown .inline-flex) {
  flex-grow: 1;
}
</style>
