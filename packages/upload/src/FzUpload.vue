<template>
  <div :class="{ 'text-sm': size === 'sm', 'text-md': size === 'md' }">
    <div
      class="relative flex items-center gap-8 p-12 border-1 border-dashed rounded border-grey-300 bg-background-alice-blue"
      @drop="handleDrop"
      @dragover="$event.preventDefault()"
    >
      <input
        ref="input"
        type="file"
        class="hidden"
        :id
        :name
        :multiple
        :accept
        @change="handleInputChange"
      />
      <FzButton
        ref="fzButton"
        variant="secondary"
        iconName="cloud-arrow-up"
        iconPosition="before"
        iconVariant="fas"
        class="select-none"
        :size
        @click="input?.click()"
      >
        {{ buttonLabel }}
      </FzButton>
      {{ dragAndDropLabel }}
    </div>

    <ul v-if="model?.length" class="mt-8 border-1 border-grey-300 rounded px-8">
      <li
        v-for="file in model"
        class="border-b-1 last:border-b-0 py-8 flex items-center justify-between"
        :key="getFileUrl(file)"
      >
        <FzLink
          :size="size === 'sm' ? 'xs' : 'sm'"
          :to="getFileUrl(file)"
          external
          target="_blank"
          class="truncate block"
        >
          {{ file.name }}
        </FzLink>

        <FzIconButton
          iconName="xmark-circle"
          variant="invisible"
          :size="size === 'sm' ? 'xs' : 'sm'"
          @click="deleteFile(file)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { FzUploadProps } from "./types";
import { FzButton, FzIconButton } from "@fiscozen/button";
import { FzLink } from "@fiscozen/link";

const props = withDefaults(defineProps<FzUploadProps>(), {
  size: "md",
  buttonLabel: "Carica",
  dragAndDropLabel: "o trascina qui",
});
const emit = defineEmits<{
  "fzupload:change": [files: File[]];
  "fzupload:add": [files: File[]];
  "fzupload:delete": [File];
}>();

function modelSetter(value: File[]) {
  if (value.length > 1 && !props.multiple) {
    console.warn(
      "[Fiscozen Design System]: FzUpload prop 'multiple' is set to false, but multiple files are provided. Only the first file will be used.",
    );
    return [value[0]];
  }
  return value;
}

const model = defineModel<File[]>({
  default: [],
  set: modelSetter,
});

const input = ref<HTMLInputElement | null>(null);
const urlByFileMap = ref(new Map<File, string>());

onMounted(() => {
  // this call is needed to make sure the model is correctly set when passed as a prop
  nextTick(() => {
    model.value = modelSetter(model.value);
  });
});

onUnmounted(() => {
  urlByFileMap.value.forEach((value) => {
    window.URL.revokeObjectURL(value);
  });
});

function handleDrop(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer) return;
  const draggedFiles = [...event.dataTransfer?.items]
    .filter((item) => item.kind === "file")
    .map((item) => item.getAsFile())
    .filter(Boolean) as File[];
  addFiles(draggedFiles);
}

function handleInputChange(event: Event) {
  if (!input.value?.files) return;
  addFiles([...input.value.files]);
  input.value.value = "";
}

function addFiles(filesToAdd: File[]) {
  let newFiles = [];
  if (props.multiple) {
    newFiles = [...(model.value ?? []), ...filesToAdd];
  } else {
    newFiles = [filesToAdd[0]];
  }

  model.value = newFiles;
  emit("fzupload:add", filesToAdd);
  emit("fzupload:change", newFiles);
}

function getFileUrl(file: File) {
  let url = urlByFileMap.value.get(file);
  if (!url) {
    url = window.URL.createObjectURL(file);
    urlByFileMap.value.set(file, url);
  }
  return url;
}

function deleteFile(file: File) {
  if (!model.value?.length) return;
  const index = model.value?.indexOf(file);
  if (index !== -1) {
    const newArr = [...model.value];
    newArr.splice(index, 1);
    model.value = newArr;
  }
  emit("fzupload:delete", file);
  emit("fzupload:change", model.value);
}
</script>

<style scoped></style>
