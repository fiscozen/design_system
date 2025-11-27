import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { vueRouter } from 'storybook-vue3-router'
import { FzActionList, FzActionSection, FzAction } from '@fiscozen/action'

const meta: Meta<typeof FzActionList> = {
  title: 'Navigation/FzActionList',
  component: FzActionList,
  tags: ['autodocs'],
  argTypes: {
    listClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the action list container'
    }
  },
  args: {
    listClass: ''
  },
  decorators: [vueRouter()]
}

type Story = StoryObj<typeof meta>

// Basic ActionList with actions only
const Basic: Story = {
  render: () => ({
    components: { FzActionList, FzActionSection, FzAction },
    template: `
      <div class="max-w-[500px]">   
        <FzActionList>
          <FzActionSection>
            <FzAction label="Save Changes" iconRightName="face-smile"  @click="() => console.log('Save clicked')" />
            <FzAction label="Cancel" iconRightName="face-smile"  @click="() => console.log('Cancel clicked')" />
            <FzAction label="Delete" iconRightName="face-smile"  @click="() => console.log('Delete clicked')" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  })
}

// ActionList with sections and labels
const WithSections: Story = {
  render: () => ({
    components: { FzActionList, FzAction, FzActionSection },
    template: `
      <div class="max-w-[500px]">
        <FzActionList>
          <FzActionSection label="File Operations">
            <FzAction label="New File" iconRightName="face-smile"  @click="() => console.log('New file')" />
            <FzAction label="Open File" iconRightName="face-smile"  @click="() => console.log('Open file')" />
            <FzAction label="Save File" iconRightName="face-smile"  @click="() => console.log('Save file')" />
          </FzActionSection>
          <FzActionSection label="Edit Operations">
            <FzAction label="Undo" iconRightName="face-smile"  @click="() => console.log('Undo')" />
            <FzAction label="Redo" iconRightName="face-smile"  @click="() => console.log('Redo')" />
            <FzAction label="Cut" iconRightName="face-smile"  @click="() => console.log('Cut')" />
            <FzAction label="Copy" iconRightName="face-smile"  @click="() => console.log('Copy')" />
            <FzAction label="Paste" iconRightName="face-smile"  @click="() => console.log('Paste')" />
          </FzActionSection>
          <FzActionSection label="View Options">
            <FzAction label="Zoom In" iconRightName="face-smile"  @click="() => console.log('Zoom in')" />
            <FzAction label="Zoom Out" iconRightName="face-smile"  @click="() => console.log('Zoom out')" />
            <FzAction label="Reset View" iconRightName="face-smile"  @click="() => console.log('Reset view')" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  })
}

// ActionList with different action variants
const MixedVariants: Story = {
  render: () => ({
    components: { FzActionList, FzAction, FzActionSection },
    template: `
      <div class="max-w-[500px]">
        <FzActionList>
          <FzActionSection label="Layout Variants">
            <FzAction label="Text Left" subLabel="With sub-label" iconRightName="align-left"  @click="() => console.log('Text left')" />
            <FzAction variant="textCenter" label="Text Center" subLabel="Centered layout" iconLeftName="house"  iconRightName="face-smile"  @click="() => console.log('Text center')" />
            <FzAction variant="onlyIcon" iconName="face-smile" @click="() => console.log('Icon only')" />
          </FzActionSection>
          <FzActionSection label="States">
            <FzAction label="Normal Action" iconRightName="face-smile"  @click="() => console.log('Normal')" />
            <FzAction label="Disabled Action" iconRightName="face-smile"  disabled @click="() => console.log('Disabled')" />
            <FzAction label="Action with both iconLeft and iconRight" iconLeftName="house" iconRightName="face-smile"  @click="() => console.log('Both icons')" />
            <FzAction label="Very long label that will not truncate because of the isTextTruncated prop setted to false" iconRightName="face-smile"  @click="() => console.log('Not Truncated')" />
            <FzAction label="Very long Text that will truncate because of the isTextTruncated prop setted to true" isTextTruncated iconRightName="face-smile"  @click="() => console.log('Truncated')" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  })
}

// ActionList with links
const WithLinks: Story = {
  render: () => ({
    components: { FzActionList, FzAction, FzActionSection },
    template: `
      <div class="max-w-[500px]">
        <FzActionList>
          <FzActionSection label="Navigation">
            <FzAction type="link" to="/dashboard" label="Dashboard" iconRightName="face-smile"  />
            <FzAction type="link" to="/profile" label="Profile" iconRightName="face-smile"  />
            <FzAction type="link" to="/settings" label="Settings" iconRightName="face-smile"  />
          </FzActionSection>
          <FzActionSection label="External Links">
            <FzAction type="link" to="https://help.example.com" label="Help Center" iconRightName="face-smile"  external target="_blank" />
            <FzAction type="link" to="https://docs.example.com" label="Documentation" iconRightName="face-smile"  external target="_blank" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  })
}

// ActionList with custom styling
const CustomStyling: Story = {
  args: {
    listClass: 'border-2 border-blue-200 bg-blue-50'
  },
  render: (args) => ({
    components: { FzActionList, FzAction, FzActionSection },
    setup() {
      return { args }
    },
    template: `
      <div class="max-w-[500px]">
        <FzActionList :listClass="args.listClass">
          <FzActionSection label="Custom Styled List">
            <FzAction label="Action 1" iconRightName="face-smile"  @click="() => console.log('Action 1')" />
            <FzAction label="Action 2" iconRightName="face-smile"  @click="() => console.log('Action 2')" />
            <FzAction label="Action 3" iconRightName="face-smile"  @click="() => console.log('Action 3')" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  })
}

// ActionList with complex content
const ComplexContent: Story = {
  render: () => ({
    components: { FzActionList, FzAction, FzActionSection },
    template: `
      <div class="max-w-[500px]">
        <FzActionList>
          <FzActionSection label="User Management">
            <FzAction label="Add User" subLabel="Create a new user account" iconRightName="face-smile"  @click="() => console.log('Add user')" />
            <FzAction label="Edit User" subLabel="Modify existing user" iconRightName="face-smile"  @click="() => console.log('Edit user')" />
            <FzAction label="Delete User" subLabel="Remove user account" iconRightName="face-smile"  disabled @click="() => console.log('Delete user')" />
          </FzActionSection>
          <FzActionSection label="System Actions">
            <FzAction variant="textCenter" label="Backup" subLabel="Create system backup" iconLeftName="house"  iconRightName="face-smile"  @click="() => console.log('Backup')" />
            <FzAction variant="textCenter" label="Restore" subLabel="Restore from backup" iconLeftName="house"  iconRightName="face-smile"  @click="() => console.log('Restore')" />
          </FzActionSection>
          <FzActionSection label="Quick Actions">
            <FzAction variant="onlyIcon" iconName="face-smile" iconVariant="solid" @click="() => console.log('Refresh')" />
            <FzAction variant="onlyIcon" iconName="face-smile" iconVariant="solid" @click="() => console.log('Sync')" />
            <FzAction variant="onlyIcon" iconName="face-smile" iconVariant="solid" @click="() => console.log('Shutdown')" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  })
}

export { Basic, WithSections, MixedVariants, WithLinks, CustomStyling, ComplexContent }

export default meta
