<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { FzChatContainerProps } from "./types";
import { FzContainer } from "@fiscozen/container";
import { FzAvatar } from "@fiscozen/avatar";
import { FzIcon } from "@fiscozen/icons";
import { FzIconButton } from "@fiscozen/button";
import { FzCard, FzCardColor } from "@fiscozen/card";
import { parseISO, isValid, format } from "date-fns";

const props = withDefaults(defineProps<FzChatContainerProps>(), {});

const emit = defineEmits<{
  "load-more": [];
  "download-attachment": [string];
}>();

const lastMessage = computed(() => props.messages[props.messages.length - 1]);

const showWaitingForResponseMessage = computed(
  () =>
    props.waitingForResponseMessage &&
    props.messages.length > 0 &&
    lastMessage.value.variant === "primary",
);
const showEmptyMessage = computed(
  () => props.emptyMessage && props.messages.length === 0,
);
const showEmptyMessageDescription = computed(
  () => props.emptyMessageDescription && props.messages.length === 0,
);

const messagesContainerRef = ref<HTMLElement | null>(null);

function datetimeIsoToIt(isoDatetime: string): string {
  if (isoDatetime) {
    const date = parseISO(isoDatetime);
    if (!isValid(date)) {
      return "";
    }
    return format(date, "dd/MM/yyyy H:mm");
  }
  return "";
}

function scrollMessagesToBottom() {
  nextTick(() => {
    nextTick(() => {
      const chatElement = messagesContainerRef.value;
      if (chatElement) {
        chatElement.scrollTop = chatElement.scrollHeight;
      }
    });
  });
}

function getAlignItems(
  message: FzChatContainerProps["messages"][number],
): string {
  const alignItems = {
    primary: "start",
    invisible: "end",
  };
  return alignItems[message.variant];
}

function getCardColor(
  message: FzChatContainerProps["messages"][number],
): FzCardColor {
  const cardColor: Record<string, any> = {
    primary: "default",
    invisible: "grey",
  };
  return cardColor[message.variant];
}

onMounted(() => {
  scrollMessagesToBottom();
});
</script>

<template>
  <div
    ref="messagesContainerRef"
    class="grow overflow-y-auto no-scrollbar pb-8"
  >
    <FzContainer
      :alignItems="messages.length === 0 ? 'center' : undefined"
      class="min-h-full"
    >
      <FzContainer v-if="showEmptyMessage" alignItems="center" gap="xs">
        <h2 v-color:grey="400">{{ emptyMessage }}</h2>
        <p v-if="showEmptyMessageDescription" v-color:grey="500" v-small>
          {{ emptyMessageDescription }}
        </p>
      </FzContainer>
      <template v-for="message in messages" :key="message.timestamp">
        <FzContainer :alignItems="getAlignItems(message)">
          <FzContainer alignItems="end" gap="xs">
            <FzContainer alignItems="end" gap="xs" horizontal>
              <FzAvatar
                v-if="message.variant === 'primary'"
                environment="frontoffice"
                :firstName="message.user.firstName"
                :lastName="message.user.lastName"
                size="lg"
              />
              <FzContainer gap="xs">
                <p
                  v-if="message.variant === 'primary'"
                  v-color:grey="400"
                  v-small
                >
                  {{ message.user.firstName }} {{ message.user.lastName }}
                </p>
                <FzCard :color="getCardColor(message)">
                  <FzContainer alignItems="end" gap="xs">
                    <p>{{ message.message }}</p>
                    <FzContainer
                      v-for="attachment in message.attachments"
                      :key="attachment.name"
                      gap="xs"
                      horizontal
                    >
                      <FzIcon name="file" size="md" />
                      <p v-small>{{ attachment.name }}</p>
                      <FzIconButton
                        iconName="arrow-down-to-line"
                        iconPosition="before"
                        iconVariant="far"
                        variant="secondary"
                        @click="emit('download-attachment', attachment.url)"
                      />
                    </FzContainer>
                  </FzContainer>
                </FzCard>
              </FzContainer>
            </FzContainer>
            <p v-color:grey="300" v-small>
              {{ datetimeIsoToIt(message.timestamp) }}
            </p>
          </FzContainer>
        </FzContainer>
      </template>
      <FzContainer v-if="showWaitingForResponseMessage" gap="xs" horizontal>
        <FzIcon name="clock" size="sm" />
        <p v-bold v-color:grey="300" v-small>
          {{ waitingForResponseMessage }}
        </p>
      </FzContainer>
    </FzContainer>
  </div>
</template>

<style scoped></style>
