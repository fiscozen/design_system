<template>
  <h1> Layering </h1>
  <p>
    This page is used to show the layering of components in the Fiscozen design system. 
    It includes a playground section where you can interact with various components and see their z-index values in action.
  </p>
  <div class="flex flex-col gap-16 h-auto w-full">
    <h2 class="text-2xl font-bold">Playground</h2>
    <div class="w-full h-screen flex gap-16 flex-col border-1 rounded p-16 relative overflow-hidden">
      <FzViewFlag role="operatore" firstName="Mario" lastName="Rossi" environment="staging" class="fz-override" />
      <FzNavbar variant="horizontal">
          <template #brand-logo>
              <FzIcon name="fiscozen" variant="fak" size="xl" class="text-core-black text-[32px] !w-[40px] ml-[-4px] cursor-pointer" />
          </template>
          <template #navigation>
              <FzNavlink label="Fatture" />
              <FzNavlink label="Spese" />
              <FzNavlink label="Corrispettivi" />
              <FzNavlink label="Adempimenti" />
              <FzNavlink label="Documenti" />
              <FzNavlink label="Dichiarazione" />
          </template>
      </FzNavbar>
      <FzTopbar>This is a Topbar</FzTopbar>
      <FzToastQueue  class="fixed top-16 right-16"/>
      <FzButton class="w-fit" @click="dialog?.show()">Open dialog</FzButton>
      <FzConfirmDialog title="Title" confirmLabel="OK" cancelLabel="Cancel" ref="dialog">
          <template #body>
              <div class="grid grid-cols-2 gap-8 !mb-8">
                  <FzDatepicker
                      :inputProps="{label: 'datepicker label'}"
                      valueFormat="YYYY-MM-DD"
                      teleport
                      v-model="date" />
                  <FzSelect
                      label="select label"
                      :options
                      v-model="selection" />
                  <FzTooltip text="tooltip text" status="neutral">
                      <FzButton>hover</FzButton>
                  </FzTooltip>
              </div>
              <div class="flex my-4 gap-8 items-start">
                  <FzButton @click="handleEnqueue('success')">Success</FzButton>
                  <FzButton @click="handleEnqueue('warning')">Warning</FzButton>
                  <FzButton @click="handleEnqueue('error')" class="mb-6">Error</FzButton>
                  <FzButton @click="handleEnqueueLong('error')" class="mb-6 mr-auto">Error long</FzButton>
              </div>
          </template>
      </FzConfirmDialog>
    </div>
    <h2 class="text-2xl font-bold">Z-index values</h2>
    <table class="w-full !m-0">
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Description</th>
          <th>Components</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>-z-1</td>
          <td>z-index:-1</td>
          <td>Deep z-index can be used to move an element behind everything else</td>
          <td> -/- </td>
        </tr>
        <tr>
          <td>z-0</td>
          <td>z-index:0</td>
          <td>Base z-index for just leveling up an element in z-stack</td>
          <td> FzLayout </td>
        </tr>
        <tr>
          <td>z-10</td>
          <td>z-index:10</td>
          <td>Z-index for sticky elements</td>
          <td>FzTopbar, FzNavbar</td>
        </tr>
        <tr>
          <td>z-20</td>
          <td>z-index:20</td>
          <td>Z-index for overlay elements like backdrops</td>
          <td>backdrop of FzDialog</td>
        </tr>
        <tr>
          <td>z-30</td>
          <td>z-index:30</td>
          <td>Z-index value for the chat button </td>
          <td>-/-</td>
        </tr>
        <tr>
          <td> z-40</td>
          <td> z-index:40</td>
          <td> Z-index for dialog and modals </td>
          <td> FzDialog, FzConfirmDialog </td>
        </tr>
        <tr>
          <td> z-50</td>
          <td> z-index:50</td>
          <td> Z-index for view-flag </td>
          <td> FzViewFlag </td>
        </tr>
        <tr>
          <td> z-60</td>
          <td> z-index:60</td>
          <td> Top z-index for showing toast or notification elements </td>
          <td> FzToastQueue, FzToast </td>
        </tr>
        <tr>
          <td> z-70</td>
          <td> z-index:70</td>
          <td> Z-index value for popover items </td>
          <td> FzDropdown, FzSelect</td>
        </tr>
        <tr>
          <td> z-80</td>
          <td> z-index:80</td>
          <td> Z-index value for tooltip items </td>
          <td> FzTooltip </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { FzButton } from '@fiscozen/button'
  import { FzDatepicker } from '@fiscozen/datepicker'
  import { FzConfirmDialog } from '@fiscozen/dialog'
  import { FzNavbar } from '@fiscozen/navbar'
  import { FzSelect } from '@fiscozen/select'
  import { FzToastQueue, enqueueToast } from '@fiscozen/toast'
  import { FzTooltip } from '@fiscozen/tooltip'
  import { FzTopbar } from '@fiscozen/topbar';
  import { FzViewFlag } from '@fiscozen/view-flag';
  import { FzNavlink } from '@fiscozen/navlink';
  import { FzIcon } from '@fiscozen/icons';

  const dialog = ref<typeof FzConfirmDialog>();
  const date = ref();

  const selection = ref();
  const options = ref([
      {
          label: 'one',
          value: 'one',
      },
      {
          label: 'two',
          value: 'two',
      },
      {
          label: 'three',
          value: 'three',
      },
      {
          label: 'four',
          value: 'four',
      },
      {
          label: 'five',
          value: 'five',
      },
  ]);
  function handleEnqueue(type: 'success' | 'warning' | 'error') {
      enqueueToast({ type, message: 'This is a toast.' })
  }

  function handleEnqueueLong(type: 'success' | 'warning' | 'error') {
      enqueueToast({ type, message: 'This is a long long long long long long long long long long long long long long long long long long long long long long long long long toast.' })
  }
</script>

<style scoped>
  div {
    font-family: 'Inter', sans-serif;
  }

  td:nth-child(4n), td:nth-child(4n+1) {
    font-weight: bold;
  }

  :deep(.fixed) {
    position: absolute !important;
  }
  :deep(.fz-dialog__backdrop) {
    width: 100% !important;
  }
</style>
