<script setup lang="ts">
import { computed, ref } from "vue";
import { FzStepperProps, FzStepProps } from "./types";
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
const dropdownRect = computed(() => {
  return dropdownContainer.value?.getBoundingClientRect();
});

const stepStatus = computed(() => {
  return props.steps.map((step, index) => {
    if (index === activeStep.value) {
      return "current";
    } else if (step.status === "error") {
      return "error";
    } else if (step.status === "completed") {
      return "completed";
    } else {
      return "default";
    }
  });
});

const barClass = (step: FzStepProps, index: number) => {
  const status = stepStatus.value[index];
  return [
    "h-[4px] rounded-[4px] w-full mb-8",
    {
      "bg-blue-500": status === "current",
      "bg-grey-500": status === "completed",
      "bg-grey-200": status === "default",
      "bg-semantic-error": status === "error",
    },
  ];
};

const badgeTone = computed(() => {
  return stepStatus.value.map((status) => {
    if (status === "current") {
      return "blue";
    } else if (status === "error") {
      return "error";
    } else if (status === "completed") {
      return "dark";
    } else {
      return "light";
    }
  });
});

/** Icon name for completed/error states; undefined means show the step number instead. */
const badgeIcon = computed(() => {
  return stepStatus.value.map((status) => {
    if (status === "completed") return "check";
    if (status === "error") return "exclamation";
    return undefined;
  });
});

const handleActionClick = (index: number) => {
  if (props.steps[index].status === "disabled") {
    return;
  }
  if (index === activeStep.value) {
    return;
  }
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
        :class="['fz-stepper__progress', barClass(step, index)]"
        v-if="hasStepbar"
      ></div>
      <div class="flex flex-row gap-8 items-start">
        <div>
          <FzBadge :tone="badgeTone[index]" variant="number">
            <FzIcon
              v-if="badgeIcon[index]"
              :name="badgeIcon[index]!"
              variant="fas"
              size="sm"
            />
            <template v-else>{{ index + 1 }}</template>
          </FzBadge>
        </div>
        <div class="min-w-0 flex flex-col gap-[4px]">
          <span
            :class="[
              'fz-stepper__title font-semibold block leading-[20px]',
              stepStatus[index] === 'error'
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
        :class="['fz-stepper__progress', barClass(step, index)]"
      ></div>
    </div>

    <!-- With step navigation dropdown -->
    <div
      class="flex flex-row gap-8 items-center"
      ref="dropdownContainer"
      v-if="hasStepperList"
    >
      <div>
        <FzBadge :tone="badgeTone[activeStep]" variant="number">
          <FzIcon
            v-if="badgeIcon[activeStep]"
            :name="badgeIcon[activeStep]!"
            variant="fas"
            size="sm"
          />
          <template v-else>{{ activeStep + 1 }}</template>
        </FzBadge>
      </div>
      <FzDropdown
        :actions="
          props.steps.map((step, index) => ({
            label: step.title,
            type: 'action' as const,
          }))
        "
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
                  stepStatus[activeStep] === 'error'
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
              ></FzIcon>
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
      <div>
        <FzBadge :tone="badgeTone[activeStep]" variant="number">
          <FzIcon
            v-if="badgeIcon[activeStep]"
            :name="badgeIcon[activeStep]!"
            variant="fas"
            size="sm"
          />
          <template v-else>{{ activeStep + 1 }}</template>
        </FzBadge>
      </div>
      <div class="flex flex-col grow min-w-0">
        <span
          :class="[
            'font-medium',
            stepStatus[activeStep] === 'error'
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
