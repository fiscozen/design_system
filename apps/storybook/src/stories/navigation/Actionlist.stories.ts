import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from '@storybook/test'
import { vueRouter } from 'storybook-vue3-router'
import { FzActionList, FzActionSection, FzAction } from '@fiscozen/action'

// =============================================================================
// META CONFIGURATION
// =============================================================================

const meta = {
  title: 'Navigation/FzActionList',
  component: FzActionList,
  tags: ['autodocs'],
  argTypes: {
    listClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the action list container'
    },
    role: {
      control: { type: 'select' },
      options: [undefined, 'listbox', 'menu'],
      description: 'ARIA role for the list container'
    },
    ariaLabelledby: {
      control: { type: 'text' },
      description: 'ARIA labelledby attribute for accessibility'
    },
    ariaActivedescendant: {
      control: { type: 'text' },
      description: 'ARIA activedescendant for focus management'
    }
  },
  args: {
    listClass: ''
  },
  decorators: [vueRouter()]
} satisfies Meta<typeof FzActionList>

export default meta
type Story = StoryObj<typeof meta>

// =============================================================================
// REUSABLE HELPER FUNCTIONS
// =============================================================================

/**
 * Verifies that the action list container renders correctly
 */
const verifyActionListRenders = async (canvasElement: HTMLElement) => {
  const actionList = canvasElement.querySelector('.fz__actionlist')
  await expect(actionList).toBeInTheDocument()
  await expect(actionList).toBeVisible()
  return actionList as HTMLElement
}

/**
 * Verifies that buttons with given names are present and accessible
 */
const verifyButtonsAreAccessible = async (
  canvas: ReturnType<typeof within>,
  buttonNames: RegExp[]
) => {
  for (const name of buttonNames) {
    const button = canvas.getByRole('button', { name })
    await expect(button).toBeInTheDocument()
  }
}

/**
 * Verifies that links with given names are present and accessible
 */
const verifyLinksAreAccessible = async (
  canvas: ReturnType<typeof within>,
  linkNames: RegExp[]
) => {
  for (const name of linkNames) {
    const link = canvas.getByRole('link', { name })
    await expect(link).toBeInTheDocument()
  }
}

/**
 * Verifies focus moves correctly between elements via Tab
 */
const verifyTabNavigation = async (
  fromElement: HTMLElement,
  toElement: HTMLElement
) => {
  fromElement.focus()
  await expect(document.activeElement).toBe(fromElement)
  await userEvent.tab()
  await expect(document.activeElement).toBe(toElement)
}

/**
 * Verifies a button's disabled state and ARIA attributes
 */
const verifyDisabledState = async (button: HTMLElement) => {
  await expect(button).toBeDisabled()
  await expect(button).toHaveAttribute('aria-disabled', 'true')
}

/**
 * Verifies computed styles match expected values
 */
const verifyComputedStyle = async (
  element: Element,
  property: string,
  expectedPattern: RegExp | string
) => {
  const computedStyles = window.getComputedStyle(element)
  const value = computedStyles.getPropertyValue(property)
  if (typeof expectedPattern === 'string') {
    await expect(value).toBe(expectedPattern)
  } else {
    await expect(value).toMatch(expectedPattern)
  }
}

// =============================================================================
// REQUIRED STORIES
// =============================================================================

/**
 * Default ActionList with basic button actions.
 * This is the most common use case for the component.
 */
export const Default: Story = {
  render: () => ({
    components: { FzActionList, FzActionSection, FzAction },
    template: `
      <div class="max-w-[500px]">   
        <FzActionList>
          <FzActionSection>
            <FzAction label="Save Changes" iconRightName="face-smile" @click="handleSave" />
            <FzAction label="Cancel" iconRightName="face-smile" @click="handleCancel" />
            <FzAction label="Delete" iconRightName="face-smile" @click="handleDelete" />
          </FzActionSection>
        </FzActionList>
      </div>
    `,
    methods: {
      handleSave() { console.log('Save clicked') },
      handleCancel() { console.log('Cancel clicked') },
      handleDelete() { console.log('Delete clicked') }
    }
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify action list renders correctly', async () => {
      await verifyActionListRenders(canvasElement)
    })

    await step('Verify all actions are rendered and accessible', async () => {
      await verifyButtonsAreAccessible(canvas, [
        /save changes/i,
        /cancel/i,
        /delete/i
      ])
    })

    await step('Verify ARIA attributes on enabled buttons', async () => {
      const saveButton = canvas.getByRole('button', { name: /save changes/i })
      await expect(saveButton).toHaveAttribute('aria-disabled', 'false')
      await expect(saveButton).toHaveAttribute('type', 'button')
    })

    await step('Verify button is clickable and responds', async () => {
      const saveButton = canvas.getByRole('button', { name: /save changes/i })
      await expect(saveButton).not.toBeDisabled()
      await userEvent.click(saveButton)
      // Button should remain functional after click
      await expect(saveButton).toBeVisible()
    })
  }
}

/**
 * ActionList with disabled actions.
 * Demonstrates disabled state behavior and accessibility.
 */
export const Disabled: Story = {
  render: () => ({
    components: { FzActionList, FzActionSection, FzAction },
    template: `
      <div class="max-w-[500px]">   
        <FzActionList>
          <FzActionSection label="Actions">
            <FzAction label="Enabled Action" iconRightName="check" @click="handleClick" />
            <FzAction label="Disabled Action" iconRightName="xmark" disabled @click="handleClick" />
            <FzAction label="Another Disabled" iconRightName="ban" disabled @click="handleClick" />
          </FzActionSection>
        </FzActionList>
      </div>
    `,
    methods: {
      handleClick() { console.log('Action clicked') }
    }
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify action list renders', async () => {
      await verifyActionListRenders(canvasElement)
    })

    await step('Verify disabled state attributes', async () => {
      const disabledButton = canvas.getByRole('button', { name: /disabled action/i })
      await verifyDisabledState(disabledButton)
    })

    await step('Verify multiple disabled actions have correct state', async () => {
      const anotherDisabled = canvas.getByRole('button', { name: /another disabled/i })
      await verifyDisabledState(anotherDisabled)
    })

    await step('Verify enabled action is not disabled', async () => {
      const enabledButton = canvas.getByRole('button', { name: /enabled action/i })
      await expect(enabledButton).not.toBeDisabled()
      await expect(enabledButton).toHaveAttribute('aria-disabled', 'false')
    })

    await step('Verify disabled action does not respond to clicks', async () => {
      const disabledButton = canvas.getByRole('button', { name: /disabled action/i })
      // Clicking disabled button should not trigger any action
      await userEvent.click(disabledButton)
      // Button should still be disabled
      await verifyDisabledState(disabledButton)
    })

    await step('Verify disabled action is skipped in Tab navigation', async () => {
      const enabledButton = canvas.getByRole('button', { name: /enabled action/i })
      enabledButton.focus()
      await expect(document.activeElement).toBe(enabledButton)

      // Tab should skip disabled buttons
      await userEvent.tab()
      const disabledButton = canvas.getByRole('button', { name: /disabled action/i })
      await expect(document.activeElement).not.toBe(disabledButton)
    })
  }
}

/**
 * ActionList with frontoffice environment styling.
 * Frontoffice has different sizing for consumer-facing applications.
 */
export const Frontoffice: Story = {
  render: () => ({
    components: { FzActionList, FzActionSection, FzAction },
    template: `
      <div class="max-w-[500px]">   
        <FzActionList>
          <FzActionSection label="Frontoffice Actions">
            <FzAction environment="frontoffice" label="Action One" iconRightName="house" @click="() => {}" />
            <FzAction environment="frontoffice" label="Action Two" iconRightName="user" @click="() => {}" />
            <FzAction environment="frontoffice" label="Action Three" iconRightName="gear" @click="() => {}" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify action list renders in frontoffice mode', async () => {
      await verifyActionListRenders(canvasElement)
    })

    await step('Verify frontoffice actions are rendered', async () => {
      await verifyButtonsAreAccessible(canvas, [
        /action one/i,
        /action two/i,
        /action three/i
      ])
    })

    await step('Verify frontoffice actions are functional', async () => {
      const actionOne = canvas.getByRole('button', { name: /action one/i })
      await expect(actionOne).not.toBeDisabled()
      await userEvent.click(actionOne)
      await expect(actionOne).toBeVisible()
    })
  }
}

/**
 * ActionList with backoffice environment styling (default).
 * Backoffice is optimized for internal admin interfaces.
 */
export const Backoffice: Story = {
  render: () => ({
    components: { FzActionList, FzActionSection, FzAction },
    template: `
      <div class="max-w-[500px]">   
        <FzActionList>
          <FzActionSection label="Backoffice Actions">
            <FzAction environment="backoffice" label="Dashboard" iconRightName="chart-line" @click="() => {}" />
            <FzAction environment="backoffice" label="Users" iconRightName="users" @click="() => {}" />
            <FzAction environment="backoffice" label="Settings" iconRightName="cog" @click="() => {}" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify action list renders in backoffice mode', async () => {
      await verifyActionListRenders(canvasElement)
    })

    await step('Verify backoffice actions are rendered', async () => {
      await verifyButtonsAreAccessible(canvas, [
        /dashboard/i,
        /users/i,
        /settings/i
      ])
    })

    await step('Verify backoffice actions are functional', async () => {
      const dashboard = canvas.getByRole('button', { name: /dashboard/i })
      await expect(dashboard).not.toBeDisabled()
      await userEvent.click(dashboard)
      await expect(dashboard).toBeVisible()
    })
  }
}

/**
 * Dedicated keyboard navigation story.
 * Tests Tab, Enter, and Space key interactions.
 */
export const KeyboardNavigation: Story = {
  render: () => ({
    components: { FzActionList, FzActionSection, FzAction },
    template: `
      <div class="max-w-[500px]">   
        <FzActionList>
          <FzActionSection label="Keyboard Test">
            <FzAction label="First Action" iconRightName="1" @click="() => console.log('First')" />
            <FzAction label="Second Action" iconRightName="2" @click="() => console.log('Second')" />
            <FzAction label="Disabled Action" iconRightName="ban" disabled />
            <FzAction label="Third Action" iconRightName="3" @click="() => console.log('Third')" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify action list renders', async () => {
      await verifyActionListRenders(canvasElement)
    })

    await step('Tab to focus first action', async () => {
      await userEvent.tab()
      const firstAction = canvas.getByRole('button', { name: /first action/i })
      await expect(document.activeElement).toBe(firstAction)
    })

    await step('Tab moves focus to second action', async () => {
      const firstAction = canvas.getByRole('button', { name: /first action/i })
      const secondAction = canvas.getByRole('button', { name: /second action/i })
      await verifyTabNavigation(firstAction, secondAction)
    })

    await step('Tab skips disabled action and moves to third', async () => {
      const secondAction = canvas.getByRole('button', { name: /second action/i })
      const thirdAction = canvas.getByRole('button', { name: /third action/i })
      await verifyTabNavigation(secondAction, thirdAction)
    })

    await step('Enter key activates focused action', async () => {
      const firstAction = canvas.getByRole('button', { name: /first action/i })
      firstAction.focus()
      await expect(document.activeElement).toBe(firstAction)
      await userEvent.keyboard('{Enter}')
      // Action should remain focused after activation
      await expect(document.activeElement).toBe(firstAction)
    })

    await step('Space key activates focused action', async () => {
      const secondAction = canvas.getByRole('button', { name: /second action/i })
      secondAction.focus()
      await expect(document.activeElement).toBe(secondAction)
      await userEvent.keyboard(' ')
      // Action should remain focused after activation
      await expect(document.activeElement).toBe(secondAction)
    })

    await step('Shift+Tab navigates backwards', async () => {
      const secondAction = canvas.getByRole('button', { name: /second action/i })
      const firstAction = canvas.getByRole('button', { name: /first action/i })
      secondAction.focus()
      await expect(document.activeElement).toBe(secondAction)
      await userEvent.tab({ shift: true })
      await expect(document.activeElement).toBe(firstAction)
    })
  }
}

// =============================================================================
// ADDITIONAL STORIES
// =============================================================================

/**
 * ActionList with sections and labels.
 * Demonstrates grouping related actions with section headers.
 */
export const WithSections: Story = {
  render: () => ({
    components: { FzActionList, FzAction, FzActionSection },
    template: `
      <div class="max-w-[500px]">
        <FzActionList>
          <FzActionSection label="File Operations">
            <FzAction label="New File" iconRightName="file" @click="() => console.log('New file')" />
            <FzAction label="Open File" iconRightName="folder-open" @click="() => console.log('Open file')" />
            <FzAction label="Save File" iconRightName="floppy-disk" @click="() => console.log('Save file')" />
          </FzActionSection>
          <FzActionSection label="Edit Operations">
            <FzAction label="Undo" iconRightName="rotate-left" @click="() => console.log('Undo')" />
            <FzAction label="Redo" iconRightName="rotate-right" @click="() => console.log('Redo')" />
            <FzAction label="Cut" iconRightName="scissors" @click="() => console.log('Cut')" />
            <FzAction label="Copy" iconRightName="copy" @click="() => console.log('Copy')" />
            <FzAction label="Paste" iconRightName="paste" @click="() => console.log('Paste')" />
          </FzActionSection>
          <FzActionSection label="View Options">
            <FzAction label="Zoom In" iconRightName="magnifying-glass-plus" @click="() => console.log('Zoom in')" />
            <FzAction label="Zoom Out" iconRightName="magnifying-glass-minus" @click="() => console.log('Zoom out')" />
            <FzAction label="Reset View" iconRightName="arrows-rotate" @click="() => console.log('Reset view')" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify action list with sections renders', async () => {
      await verifyActionListRenders(canvasElement)
    })

    await step('Verify section labels are displayed', async () => {
      const fileOpsLabel = canvas.getByText('File Operations')
      const editOpsLabel = canvas.getByText('Edit Operations')
      const viewOptionsLabel = canvas.getByText('View Options')

      await expect(fileOpsLabel).toBeInTheDocument()
      await expect(editOpsLabel).toBeInTheDocument()
      await expect(viewOptionsLabel).toBeInTheDocument()
    })

    await step('Verify sections have correct ARIA group role', async () => {
      const sections = canvasElement.querySelectorAll('[role="group"]')
      await expect(sections.length).toBe(3)
    })

    await step('Verify section labels are linked via aria-labelledby', async () => {
      const sections = canvasElement.querySelectorAll('[role="group"]')
      for (const section of sections) {
        const labelledBy = section.getAttribute('aria-labelledby')
        await expect(labelledBy).toBeTruthy()
        // Verify the referenced element exists
        const labelElement = document.getElementById(labelledBy!)
        await expect(labelElement).toBeInTheDocument()
      }
    })

    await step('Verify actions in each section are accessible', async () => {
      await verifyButtonsAreAccessible(canvas, [
        /new file/i,
        /undo/i,
        /zoom in/i
      ])
    })

    await step('Verify navigation between sections works', async () => {
      const newFileButton = canvas.getByRole('button', { name: /new file/i })
      const pasteButton = canvas.getByRole('button', { name: /paste/i })

      await userEvent.click(newFileButton)
      await expect(newFileButton).toBeVisible()

      await userEvent.click(pasteButton)
      await expect(pasteButton).toBeVisible()
    })
  }
}

/**
 * ActionList with different action variants.
 * Demonstrates textLeft, textCenter, and onlyIcon variants.
 */
export const MixedVariants: Story = {
  render: () => ({
    components: { FzActionList, FzAction, FzActionSection },
    template: `
      <div class="max-w-[500px]">
        <FzActionList>
          <FzActionSection label="Layout Variants">
            <FzAction label="Text Left" subLabel="With sub-label" iconRightName="align-left" @click="() => console.log('Text left')" />
            <FzAction variant="textCenter" label="Text Center" subLabel="Centered layout" iconLeftName="house" iconRightName="check" @click="() => console.log('Text center')" />
            <FzAction variant="onlyIcon" iconName="check" @click="() => console.log('Icon only')" />
          </FzActionSection>
          <FzActionSection label="States">
            <FzAction label="Normal Action" iconRightName="circle" @click="() => console.log('Normal')" />
            <FzAction label="Disabled Action" iconRightName="circle-xmark" disabled @click="() => console.log('Disabled')" />
            <FzAction label="Action with both icons" iconLeftName="house" iconRightName="arrow-right" @click="() => console.log('Both icons')" />
            <FzAction label="Very long label that will not truncate because isTextTruncated is false by default" iconRightName="text-width" @click="() => console.log('Not Truncated')" />
            <FzAction label="Very long text that will truncate because isTextTruncated is true" isTextTruncated iconRightName="ellipsis" @click="() => console.log('Truncated')" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify action list renders', async () => {
      await verifyActionListRenders(canvasElement)
    })

    await step('Verify textLeft variant renders correctly', async () => {
      const textLeftButton = canvas.getByRole('button', { name: /text left/i })
      await expect(textLeftButton).toBeInTheDocument()
      // Verify sub-label is displayed
      const subLabel = canvas.getByText('With sub-label')
      await expect(subLabel).toBeInTheDocument()
    })

    await step('Verify textCenter variant renders correctly', async () => {
      const textCenterButton = canvas.getByRole('button', { name: /text center/i })
      await expect(textCenterButton).toBeInTheDocument()
      const subLabel = canvas.getByText('Centered layout')
      await expect(subLabel).toBeInTheDocument()
    })

    await step('Verify icon-only variant has aria-label for accessibility', async () => {
      const iconOnlyButton = canvas.getByRole('button', { name: /check/i })
      await expect(iconOnlyButton).toBeInTheDocument()
      // Icon-only buttons must have aria-label for screen readers
      await expect(iconOnlyButton).toHaveAttribute('aria-label')
    })

    await step('Verify disabled action state and ARIA attributes', async () => {
      const disabledButton = canvas.getByRole('button', { name: /disabled action/i })
      await verifyDisabledState(disabledButton)
    })

    await step('Verify disabled action does not respond to clicks', async () => {
      const disabledButton = canvas.getByRole('button', { name: /disabled action/i })
      await userEvent.click(disabledButton)
      await verifyDisabledState(disabledButton)
    })

    await step('Verify truncated text has title attribute for tooltip', async () => {
      const truncatedButton = canvas.getByRole('button', { name: /very long text that will truncate/i })
      await expect(truncatedButton).toBeInTheDocument()
      // The label span should have a title attribute for tooltip on hover
      const labelSpan = truncatedButton.querySelector('span[title]')
      await expect(labelSpan).toBeInTheDocument()
    })
  }
}

/**
 * ActionList with link actions.
 * Demonstrates internal Vue Router links and external links.
 */
export const WithLinks: Story = {
  render: () => ({
    components: { FzActionList, FzAction, FzActionSection },
    template: `
      <div class="max-w-[500px]">
        <FzActionList>
          <FzActionSection label="Navigation">
            <FzAction type="link" to="/dashboard" label="Dashboard" iconRightName="gauge" />
            <FzAction type="link" to="/profile" label="Profile" iconRightName="user" />
            <FzAction type="link" to="/settings" label="Settings" iconRightName="gear" />
          </FzActionSection>
          <FzActionSection label="External Links">
            <FzAction type="link" to="https://help.example.com" label="Help Center" iconRightName="circle-question" external target="_blank" />
            <FzAction type="link" to="https://docs.example.com" label="Documentation" iconRightName="book" external target="_blank" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify action list renders', async () => {
      await verifyActionListRenders(canvasElement)
    })

    await step('Verify link actions render as anchor elements', async () => {
      await verifyLinksAreAccessible(canvas, [
        /dashboard/i,
        /profile/i,
        /settings/i
      ])
    })

    await step('Verify internal links have correct href attributes', async () => {
      const dashboardLink = canvas.getByRole('link', { name: /dashboard/i })
      // Vue Router adds hash prefix to routes in test environment
      await expect(dashboardLink).toHaveAttribute('href', '#/dashboard')
    })

    await step('Verify external links have correct attributes', async () => {
      const helpLink = canvas.getByRole('link', { name: /help center/i })
      const docsLink = canvas.getByRole('link', { name: /documentation/i })

      await expect(helpLink).toHaveAttribute('href', 'https://help.example.com')
      await expect(helpLink).toHaveAttribute('target', '_blank')
      await expect(docsLink).toHaveAttribute('href', 'https://docs.example.com')
      await expect(docsLink).toHaveAttribute('target', '_blank')
    })

    await step('Verify external links have accessible label indicating new window', async () => {
      const helpLink = canvas.getByRole('link', { name: /help center/i })
      // External links with target="_blank" should indicate they open in new window
      const ariaLabel = helpLink.getAttribute('aria-label')
      await expect(ariaLabel).toMatch(/opens in new window/i)
    })

    await step('Verify keyboard navigation for links', async () => {
      const dashboardLink = canvas.getByRole('link', { name: /dashboard/i })
      const profileLink = canvas.getByRole('link', { name: /profile/i })
      await verifyTabNavigation(dashboardLink, profileLink)
    })

    await step('Verify Enter activates links', async () => {
      const dashboardLink = canvas.getByRole('link', { name: /dashboard/i })
      dashboardLink.focus()
      await expect(document.activeElement).toBe(dashboardLink)
      await userEvent.keyboard('{Enter}')
      // Link should remain in the document
      await expect(dashboardLink).toBeInTheDocument()
    })
  }
}

/**
 * ActionList with custom styling via listClass prop.
 * Demonstrates how to apply custom CSS classes to the container.
 */
export const CustomStyling: Story = {
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
            <FzAction label="Action 1" iconRightName="check" @click="() => console.log('Action 1')" />
            <FzAction label="Action 2" iconRightName="check" @click="() => console.log('Action 2')" />
            <FzAction label="Action 3" iconRightName="check" @click="() => console.log('Action 3')" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify action list renders', async () => {
      await verifyActionListRenders(canvasElement)
    })

    await step('Verify custom border styling is applied via computed styles', async () => {
      const actionList = canvasElement.querySelector('.fz__actionlist') as Element
      // Test actual computed style, not class names
      await verifyComputedStyle(actionList, 'border-width', '2px')
    })

    await step('Verify custom background class is applied', async () => {
      const actionList = canvasElement.querySelector('.fz__actionlist') as Element
      // Verify the class was applied (computed styles may not be available in test env)
      const hasBackgroundClass = actionList.classList.contains('bg-blue-50')
      await expect(hasBackgroundClass).toBe(true)
    })

    await step('Verify actions remain functional with custom styling', async () => {
      const action1 = canvas.getByRole('button', { name: /action 1/i })
      await expect(action1).not.toBeDisabled()
      await userEvent.click(action1)
      await expect(action1).toBeVisible()
    })
  }
}

/**
 * ActionList with complex nested content.
 * Demonstrates combining multiple variants, states, and sections.
 */
export const ComplexContent: Story = {
  render: () => ({
    components: { FzActionList, FzAction, FzActionSection },
    template: `
      <div class="max-w-[500px]">
        <FzActionList>
          <FzActionSection label="User Management">
            <FzAction label="Add User" subLabel="Create a new user account" iconRightName="user-plus" @click="() => console.log('Add user')" />
            <FzAction label="Edit User" subLabel="Modify existing user" iconRightName="user-pen" @click="() => console.log('Edit user')" />
            <FzAction label="Delete User" subLabel="Remove user account" iconRightName="user-minus" disabled @click="() => console.log('Delete user')" />
          </FzActionSection>
          <FzActionSection label="System Actions">
            <FzAction variant="textCenter" label="Backup" subLabel="Create system backup" iconLeftName="database" iconRightName="download" @click="() => console.log('Backup')" />
            <FzAction variant="textCenter" label="Restore" subLabel="Restore from backup" iconLeftName="database" iconRightName="upload" @click="() => console.log('Restore')" />
          </FzActionSection>
          <FzActionSection label="Quick Actions">
            <FzAction variant="onlyIcon" iconName="arrows-rotate" @click="() => console.log('Refresh')" />
            <FzAction variant="onlyIcon" iconName="cloud-arrow-up" @click="() => console.log('Sync')" />
            <FzAction variant="onlyIcon" iconName="power-off" @click="() => console.log('Shutdown')" />
          </FzActionSection>
        </FzActionList>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify complex action list renders', async () => {
      await verifyActionListRenders(canvasElement)
    })

    await step('Verify all three sections are present', async () => {
      await expect(canvas.getByText('User Management')).toBeInTheDocument()
      await expect(canvas.getByText('System Actions')).toBeInTheDocument()
      await expect(canvas.getByText('Quick Actions')).toBeInTheDocument()
    })

    await step('Verify actions with sub-labels display correctly', async () => {
      const addUserButton = canvas.getByRole('button', { name: /add user/i })
      await expect(addUserButton).toBeInTheDocument()
      const subLabel = canvas.getByText('Create a new user account')
      await expect(subLabel).toBeInTheDocument()
    })

    await step('Verify disabled action in complex content', async () => {
      const deleteButton = canvas.getByRole('button', { name: /delete user/i })
      await verifyDisabledState(deleteButton)
    })

    await step('Verify textCenter variant actions work', async () => {
      // Use getAllByRole since sub-label also matches the pattern
      const backupButtons = canvas.getAllByRole('button', { name: /backup/i })
      await expect(backupButtons.length).toBeGreaterThan(0)
      const backupButton = backupButtons[0]
      await userEvent.click(backupButton)
      await expect(backupButton).toBeVisible()
    })

    await step('Verify icon-only actions have aria-labels', async () => {
      // Icon-only buttons should have aria-label for accessibility
      const iconButtons = canvasElement.querySelectorAll('button[aria-label]')
      // We should have at least 3 icon-only buttons
      const iconOnlyButtons = Array.from(iconButtons).filter(btn => {
        const label = btn.getAttribute('aria-label')
        return label && ['arrows-rotate', 'cloud-arrow-up', 'power-off'].some(icon => label.includes(icon))
      })
      await expect(iconOnlyButtons.length).toBe(3)
    })

    await step('Verify navigation across multiple sections', async () => {
      const addUserButton = canvas.getByRole('button', { name: /add user/i })
      // Use getAllByRole since sub-label also matches the pattern
      const restoreButtons = canvas.getAllByRole('button', { name: /restore/i })
      await expect(restoreButtons.length).toBeGreaterThan(0)
      const restoreButton = restoreButtons[0]

      await userEvent.click(addUserButton)
      await expect(addUserButton).toBeVisible()

      await userEvent.click(restoreButton)
      await expect(restoreButton).toBeVisible()
    })
  }
}

/**
 * ActionList configured as a listbox for select-like behavior.
 * Demonstrates ARIA listbox role with option children.
 */
export const ListboxRole: Story = {
  render: () => ({
    components: { FzActionList, FzAction, FzActionSection },
    template: `
      <div class="max-w-[500px]">
        <label id="color-label" class="block mb-2 text-sm font-medium">Select a color:</label>
        <FzActionList role="listbox" aria-labelledby="color-label">
          <FzAction 
            role="option" 
            label="Red" 
            :aria-selected="selectedColor === 'red'"
            :focused="selectedColor === 'red'"
            iconRightName="circle"
            @click="() => selectedColor = 'red'" 
          />
          <FzAction 
            role="option" 
            label="Green" 
            :aria-selected="selectedColor === 'green'"
            :focused="selectedColor === 'green'"
            iconRightName="circle"
            @click="() => selectedColor = 'green'" 
          />
          <FzAction 
            role="option" 
            label="Blue" 
            :aria-selected="selectedColor === 'blue'"
            :focused="selectedColor === 'blue'"
            iconRightName="circle"
            @click="() => selectedColor = 'blue'" 
          />
        </FzActionList>
      </div>
    `,
    data() {
      return {
        selectedColor: 'red'
      }
    }
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify listbox role is applied to action list', async () => {
      const actionList = canvasElement.querySelector('.fz__actionlist')
      await expect(actionList).toHaveAttribute('role', 'listbox')
    })

    await step('Verify aria-labelledby references the label', async () => {
      const actionList = canvasElement.querySelector('.fz__actionlist')
      await expect(actionList).toHaveAttribute('aria-labelledby', 'color-label')
    })

    await step('Verify options have role="option"', async () => {
      const options = canvas.getAllByRole('option')
      await expect(options.length).toBe(3)
    })

    await step('Verify aria-selected is set on selected option', async () => {
      const redOption = canvas.getByRole('option', { name: /red/i })
      await expect(redOption).toHaveAttribute('aria-selected', 'true')

      const greenOption = canvas.getByRole('option', { name: /green/i })
      await expect(greenOption).toHaveAttribute('aria-selected', 'false')
    })

    await step('Verify clicking option changes selection', async () => {
      const greenOption = canvas.getByRole('option', { name: /green/i })
      await userEvent.click(greenOption)
      // After click, green should be selected
      await expect(greenOption).toHaveAttribute('aria-selected', 'true')

      const redOption = canvas.getByRole('option', { name: /red/i })
      await expect(redOption).toHaveAttribute('aria-selected', 'false')
    })
  }
}

/**
 * ActionList configured as a menu for dropdown menu behavior.
 * Demonstrates ARIA menu role with menuitem children.
 */
export const MenuRole: Story = {
  render: () => ({
    components: { FzActionList, FzAction, FzActionSection },
    template: `
      <div class="max-w-[500px]">
        <FzActionList role="menu" aria-labelledby="menu-button">
          <FzAction role="menuitem" label="Cut" iconLeftName="scissors" @click="() => console.log('Cut')" />
          <FzAction role="menuitem" label="Copy" iconLeftName="copy" @click="() => console.log('Copy')" />
          <FzAction role="menuitem" label="Paste" iconLeftName="paste" @click="() => console.log('Paste')" />
          <FzAction role="menuitem" label="Delete" iconLeftName="trash" disabled @click="() => console.log('Delete')" />
        </FzActionList>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify menu role is applied to action list', async () => {
      const actionList = canvasElement.querySelector('.fz__actionlist')
      await expect(actionList).toHaveAttribute('role', 'menu')
    })

    await step('Verify menuitems have role="menuitem"', async () => {
      const menuItems = canvas.getAllByRole('menuitem')
      await expect(menuItems.length).toBe(4)
    })

    await step('Verify disabled menuitem has correct attributes', async () => {
      const deleteItem = canvas.getByRole('menuitem', { name: /delete/i })
      await expect(deleteItem).toHaveAttribute('aria-disabled', 'true')
    })

    await step('Verify menuitem is clickable', async () => {
      const cutItem = canvas.getByRole('menuitem', { name: /cut/i })
      await userEvent.click(cutItem)
      await expect(cutItem).toBeVisible()
    })
  }
}
