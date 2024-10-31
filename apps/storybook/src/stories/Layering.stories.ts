import type { Meta, StoryObj } from '@storybook/vue3'
import {ref} from 'vue';
import { FzButton, FzButtonGroup } from '@fiscozen/button'
import { FzDatepicker } from '@fiscozen/datepicker'
import { FzConfirmDialog } from '@fiscozen/dialog'
import { FzDropdown } from '@fiscozen/dropdown'
import { FzNavbar } from '@fiscozen/navbar'
import { FzSelect } from '@fiscozen/select'
import { FzToast, FzToastQueue, enqueueToast } from '@fiscozen/toast'
import { FzTooltip } from '@fiscozen/tooltip'
import { FzTopbar } from '@fiscozen/topbar';
import { FzViewFlag } from '@fiscozen/view-flag';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'layering example',
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
  args: {
    position: 'auto'
  }
} 

export default meta
type Story = StoryObj<typeof meta>

const template = `
    <div class="w-screen h-screen">
        <!--FzViewFlag role="operatore" firstName="Mario" lastName="Rossi" environment="staging" /-->
        <FzNavbar />
        <FzTopbar />
        <FzToastQueue  />
        <FzButton @click="dialog.show()">Apri dialog</FzButton>
        <FzConfirmDialog title="Title" confirmLabel="OK" cancelLabel="Cancel" ref="dialog">
            <template #body>
                <div class="grid grid-cols-2 gap-8">
                    <FzDatepicker
                        :inputProps="{label: 'datepicker label'}"
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
                </tempate>
        </FzConfirmDialog>
    </div>
`

export const Layering: Story = {
  render: (args) => ({
    components: {
        FzButton,
        FzButtonGroup,
        FzDatepicker,
        FzConfirmDialog,
        FzDropdown,
        FzNavbar,
        FzSelect,
        FzToast,
        FzToastQueue,
        FzTooltip,
        FzTopbar,
        FzViewFlag
    },
    setup() {
        const dialog = ref('dialog');
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
        function handleEnqueue(type: 'success' | 'warning' | 'success') {
            enqueueToast({ type, message: 'This is a toast.' })
        }

        function handleEnqueueLong(type: 'success' | 'warning' | 'success') {
            enqueueToast({ type, message: 'This is a long long long long long long long long long long long long long long long long long long long long long long long long long toast.' })
        }

        return {
            dialog,
            date,
            options,
            selection,
            handleEnqueue,
            handleEnqueueLong
        }
    },
    template: template
  }),
}
