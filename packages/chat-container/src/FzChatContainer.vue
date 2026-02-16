<script setup lang="ts">
import { computed, ref } from "vue";
import { FzChatContainerProps, Message } from "./types";
import { FzContainer } from "@fiscozen/container";
import { FzAvatar } from "@fiscozen/avatar";
import { FzIcon } from "@fiscozen/icons";
import { FzIconButton } from "@fiscozen/button";
import { FzCard, FzCardColor } from "@fiscozen/card";
import { parseISO, isValid, format } from "date-fns";
import { it } from "date-fns/locale";
import { FzDivider } from "@fiscozen/divider";

const props = withDefaults(defineProps<FzChatContainerProps>(), {});

const emit = defineEmits<{
  "load-more": [];
}>();

const showWaitingForResponseMessage = computed(
  () =>
    props.waitingForResponseMessage &&
    props.messages.length > 0 &&
    props.messages[0].variant === "primary",
);
const showEmptyMessage = computed(
  () => props.emptyMessage && props.messages.length === 0,
);
const showEmptyMessageDescription = computed(
  () => props.emptyMessageDescription && props.messages.length === 0,
);

function datetimeIsoToDateString(
  isoDatetime: string | null | undefined,
): string {
  if (!isoDatetime) return "";

  const date = parseISO(isoDatetime);
  if (!isValid(date)) return "";

  return format(date, "dd MMM, HH:mm", { locale: it });
}

function downloadAttachment(fileUrl: string): void {
  window.open(fileUrl, "_blank");
}

const alignItems: Record<Message["variant"], "end" | "start"> = {
  primary: "end",
  invisible: "start",
};

const cardColor: Record<string, FzCardColor> = {
  primary: "grey",
  invisible: "default",
};

const SCROLL_TOP_THRESHOLD = 100;
const messagesLengthAtLastLoadMore = ref(-1);
const canLoadMore = computed(
  () => props.messages.length !== messagesLengthAtLastLoadMore.value,
);

function onContainerScroll(event: Event): void {
  const el = event.target as HTMLElement;
  if (
    el &&
    el.scrollHeight - Math.abs(el.scrollTop) - el.clientHeight <=
      SCROLL_TOP_THRESHOLD &&
    canLoadMore.value
  ) {
    messagesLengthAtLastLoadMore.value = props.messages.length;
    emit("load-more");
  }
}
</script>

<template>
  <!-- no messages -->
  <FzContainer
    v-if="showEmptyMessage"
    alignItems="center"
    gap="xs"
    class="w-full h-full"
  >
    <h2 v-color:grey="400">{{ emptyMessage }}</h2>
    <p v-if="showEmptyMessageDescription" v-color:grey="500" v-small>
      {{ emptyMessageDescription }}
    </p>
  </FzContainer>

  <FzContainer
    v-else
    class="fz-chat-container pb-16 overflow-y-scroll flex !flex-col-reverse"
    @scroll="onContainerScroll"
  >
    <!-- waiting for response message -->
    <FzContainer v-if="showWaitingForResponseMessage" alignItems="center">
      <FzContainer gap="xs" horizontal alignItems="center">
        <FzIcon name="clock" size="sm" variant="far" class="text-grey-300" />
        <p v-bold v-color:grey="300" v-small>
          {{ waitingForResponseMessage }}
        </p>
      </FzContainer>
    </FzContainer>

    <!-- messages -->
    <FzContainer
      v-for="(message, index) in messages"
      :key="index"
      :alignItems="alignItems[message.variant]"
    >
      <FzContainer alignItems="end" gap="xs">
        <FzContainer alignItems="end" gap="xs" horizontal>
          <FzAvatar
            v-if="message.variant === 'invisible'"
            environment="frontoffice"
            :firstName="message.user.firstName"
            :lastName="message.user.lastName"
            size="lg"
            :src="message.user.avatar"
          />
          <FzContainer gap="xs">
            <p
              v-if="message.variant === 'invisible'"
              v-color:grey="400"
              v-small
            >
              {{ message.user.firstName }} {{ message.user.lastName }}
            </p>
            <FzCard :color="cardColor[message.variant]">
              <FzContainer alignItems="end" gap="sm">
                <p v-small v-if="message.message.trim().length">
                  {{ message.message }}
                </p>
                <FzContainer
                  v-if="message.attachments?.length"
                  gap="none"
                  class="w-full"
                >
                  <FzContainer
                    v-for="(attachment, index) in message.attachments"
                    gap="none"
                    :key="index"
                  >
                    <FzContainer
                      horizontal
                      layout="expand-first"
                      alignItems="center"
                      gap="xs"
                    >
                      <FzContainer horizontal alignItems="center" gap="xs">
                        <FzIcon name="file" size="md" variant="far" />
                        <p v-small>
                          {{ attachment.name }}
                        </p>
                      </FzContainer>
                      <FzIconButton
                        iconName="arrow-down-to-bracket"
                        iconVariant="fas"
                        variant="secondary"
                        environment="frontoffice"
                        :aria-label="`Scarica ${attachment.name}`"
                        @click="downloadAttachment(attachment.url)"
                      />
                    </FzContainer>
                    <FzDivider v-if="index < message.attachments.length - 1" />
                  </FzContainer>
                </FzContainer>
              </FzContainer>
            </FzCard>
          </FzContainer>
        </FzContainer>
        <p v-color:grey="300" v-small>
          {{ datetimeIsoToDateString(message.timestamp) }}
        </p>
      </FzContainer>
    </FzContainer>
  </FzContainer>
</template>

<style scoped>
.fz-chat-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.fz-chat-container::-webkit-scrollbar {
  display: none;
}
</style>
