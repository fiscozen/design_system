<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { FzChatContainerProps } from "./types";
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

function datetimeIsoToDateString(isoDatetime: string): string {
  if (!isoDatetime) {
    return "";
  }

  const date = parseISO(isoDatetime);
  if (!isValid(date)) {
    return "";
  }
  const formatted = format(date, "dd MMM, HH:mm", { locale: it });
  return formatted.replace(
    /(\d{2}) (\w)/,
    (_, day, firstChar) => `${day} ${firstChar.toUpperCase()}`,
  );
}

function scrollMessagesToBottom(): void {
  nextTick(() => {
    nextTick(() => {
      const chatElement = messagesContainerRef.value;
      if (chatElement) {
        chatElement.scrollTop = chatElement.scrollHeight;
      }
    });
  });
}

function downloadAttachment(fileUrl: string): void {
  window.open(fileUrl, "_blank");
}

const alignItems = {
  primary: "end",
  invisible: "start",
};

function getAlignItems(
  message: FzChatContainerProps["messages"][number],
): string {
  return alignItems[message.variant];
}

const cardColor: Record<string, FzCardColor> = {
  primary: "grey",
  invisible: "default",
};

function getCardColor(
  message: FzChatContainerProps["messages"][number],
): FzCardColor {
  return cardColor[message.variant];
}

const SCROLL_TOP_THRESHOLD = 10;
const canLoadMore = ref(true);

function onContainerScroll(): void {
  const el = messagesContainerRef.value;
  if (el && el.scrollTop <= SCROLL_TOP_THRESHOLD && canLoadMore.value) {
    canLoadMore.value = false;
    emit("load-more");
  }
}

onMounted(() => {
  scrollMessagesToBottom();
  messagesContainerRef.value?.addEventListener("scroll", onContainerScroll);
});

onUnmounted(() => {
  messagesContainerRef.value?.removeEventListener("scroll", onContainerScroll);
});

// Riabilita load-more quando cambiano i messaggi
watch(
  () => props.messages.length,
  () => {
    canLoadMore.value = true;
  },
);

// Scroll solo quando viene aggiunto un messaggio in fondo (nuovo messaggio),
// non quando si caricano messaggi più vecchi in cima (prepend)
watch(
  () => lastMessage.value,
  () => {
    scrollMessagesToBottom();
  },
);
</script>

<template>
  <div ref="messagesContainerRef" class="overflow-y-auto">
    <FzContainer
      :alignItems="messages.length === 0 ? 'center' : undefined"
      class="min-h-full mb-8"
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
                v-if="message.variant === 'invisible'"
                environment="frontoffice"
                :firstName="message.user.firstName"
                :lastName="message.user.lastName"
                size="lg"
              />
              <FzContainer gap="xs">
                <p
                  v-if="message.variant === 'invisible'"
                  v-color:grey="400"
                  v-small
                >
                  {{ message.user.firstName }} {{ message.user.lastName }}
                </p>
                <FzCard :color="getCardColor(message)">
                  <FzContainer alignItems="end" gap="none">
                    <p v-small>{{ message.message }}</p>
                    <FzContainer
                      v-if="message.attachments?.length"
                      gap="none"
                      class="mt-16 w-full"
                    >
                      <FzContainer
                        v-for="(attachment, i) in message.attachments"
                        gap="none"
                        :key="attachment.url"
                      >
                        <FzContainer
                          horizontal
                          layout="expand-first"
                          alignItems="center"
                          gap="xs"
                        >
                          <FzContainer
                            horizontal
                            alignItems="center"
                            gap="xs"
                            class="min-w-0"
                          >
                            <span class="flex-shrink-0">
                              <FzIcon name="file" size="md" variant="far" />
                            </span>
                            <p v-small class="truncate min-w-0">
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
                        <FzDivider v-if="i < message.attachments.length - 1" />
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
      </template>
      <FzContainer v-if="showWaitingForResponseMessage" alignItems="center">
        <FzContainer gap="xs" horizontal alignItems="center">
          <FzIcon name="clock" size="sm" variant="far" class="text-grey-300" />
          <p v-bold v-color:grey="300" v-small>
            {{ waitingForResponseMessage }}
          </p>
        </FzContainer>
      </FzContainer>
    </FzContainer>
  </div>
</template>

<style scoped></style>
