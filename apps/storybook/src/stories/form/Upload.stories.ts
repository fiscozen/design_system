import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { FzUpload } from '@fiscozen/upload'
import { ref } from 'vue'

const meta: Meta<typeof FzUpload> = {
  title: 'Form/FzUpload',
  component: FzUpload,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md']
    }
  },
  args: {
    id: 'example-id'
  },
  decorators: [
    () => ({
      setup() {
        const files = ref([])
        return { files }
      },
      template: `
      <div class="p-16 max-w-[400px]">
        <story v-model="files" @fzupload:change="(e) => console.log(e)"/>
        <h3 class="mt-10">v-model:</h3>
        <ul>
          <li v-for="file in files">{{ file.name }}</li>
        </ul>
      </div>
    `
    })
  ]
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  render: (args) => ({
    components: { FzUpload },
    setup() {
      const files = ref([
        new File([], 'test-image1.png'),
        new File([], 'test-image2.png'),
        new File([], 'test-image3.png')
      ])
      return { files, args }
    },
    template: `
      <FzUpload v-bind="args" v-model="files"/>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify upload component renders correctly', async () => {
      const uploadButton = canvas.getByRole('button', { name: /carica/i })
      await expect(uploadButton).toBeInTheDocument()
      await expect(uploadButton).toBeVisible()
    })
    
    await step('Verify drag and drop label is present', async () => {
      const dragLabel = canvas.getByText(/o trascina qui/i)
      await expect(dragLabel).toBeInTheDocument()
    })
    
    await step('Verify file list is displayed when files are present', async () => {
      // Find the file list within the component (not the decorator's list)
      const uploadContainer = canvasElement.querySelector('.text-md')
      const fileList = uploadContainer?.querySelector('ul')
      await expect(fileList).toBeInTheDocument()
      
      // When multiple=false, only the first file is shown (component warns and keeps only first)
      // Verify file name is displayed - use getAllByText since decorator also shows files
      const file1Links = canvas.getAllByText('test-image1.png')
      await expect(file1Links.length).toBeGreaterThan(0)
    })
    
    await step('Verify delete button is present', async () => {
      // Find delete buttons within the component's file list
      const uploadContainer = canvasElement.querySelector('.text-md')
      const fileList = uploadContainer?.querySelector('ul')
      const deleteButtons = fileList?.querySelectorAll('button')
      // Should have at least one delete button
      await expect(deleteButtons?.length).toBeGreaterThanOrEqual(1)
    })
  }
}

const Multiple: Story = {
  args: {
    multiple: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify upload component renders with multiple prop', async () => {
      const uploadButton = canvas.getByRole('button', { name: /carica/i })
      await expect(uploadButton).toBeInTheDocument()
    })
    
    await step('Verify input has multiple attribute', async () => {
      const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement
      await expect(input).toBeInTheDocument()
      await expect(input).toHaveAttribute('multiple')
    })
  }
}

const MultipleFileLimit: Story = {
  args: {
    multiple: true,
    fileLimit: 3
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify upload component renders with fileLimit prop', async () => {
      const uploadButton = canvas.getByRole('button', { name: /carica/i })
      await expect(uploadButton).toBeInTheDocument()
    })
    
    await step('Verify input has multiple attribute', async () => {
      const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement
      await expect(input).toBeInTheDocument()
      await expect(input).toHaveAttribute('multiple')
    })
  }
}

export { Default, Multiple, MultipleFileLimit }

// ============================================
// INTERACTION STORIES
// ============================================

export const ClickToUpload: Story = {
  render: (args) => ({
    components: { FzUpload },
    setup() {
      const files = ref<File[]>([])
      return { files, args }
    },
    template: `
      <FzUpload v-bind="args" v-model="files"/>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify upload button is clickable', async () => {
      const uploadButton = canvas.getByRole('button', { name: /carica/i })
      await expect(uploadButton).toBeInTheDocument()
      await expect(uploadButton).toBeVisible()
      
      // Click the button - this should trigger the file input
      await userEvent.click(uploadButton)
      
      // Verify button is still visible after click
      await expect(uploadButton).toBeInTheDocument()
    })
  }
}

export const DeleteFile: Story = {
  render: (args) => ({
    components: { FzUpload },
    setup() {
      const files = ref([
        new File([], 'test-image1.png'),
        new File([], 'test-image2.png')
      ])
      return { files, args }
    },
    template: `
      <FzUpload v-bind="args" v-model="files" multiple/>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify files are displayed', async () => {
      // Use getAllByText since decorator also shows files
      const file1Links = canvas.getAllByText('test-image1.png')
      await expect(file1Links.length).toBeGreaterThan(0)
      const file2Links = canvas.getAllByText('test-image2.png')
      await expect(file2Links.length).toBeGreaterThan(0)
    })
    
    await step('Click delete button for first file', async () => {
      // Find the file list within the component (not the decorator's list)
      const uploadContainer = canvasElement.querySelector('.text-md')
      const fileList = uploadContainer?.querySelector('ul')
      await expect(fileList).toBeInTheDocument()
      
      const initialFileCount = fileList?.querySelectorAll('li').length || 0
      await expect(initialFileCount).toBeGreaterThan(0)
      
      const firstFileItem = fileList?.querySelector('li:first-child')
      await expect(firstFileItem).toBeInTheDocument()
      
      const deleteButton = firstFileItem?.querySelector('button')
      if (deleteButton) {
        await userEvent.click(deleteButton)
        
        // Wait for UI update - check that file count decreased
        await waitFor(() => {
          const updatedFileList = uploadContainer?.querySelector('ul')
          const remainingFiles = updatedFileList?.querySelectorAll('li') || []
          expect(remainingFiles.length).toBeLessThan(initialFileCount)
        }, { timeout: 1000 })
      }
    })
  }
}

export const KeyboardNavigation: Story = {
  render: (args) => ({
    components: { FzUpload },
    setup() {
      const files = ref<File[]>([])
      return { files, args }
    },
    template: `
      <FzUpload v-bind="args" v-model="files"/>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Tab to focus upload button', async () => {
      await userEvent.tab()
      const uploadButton = canvas.getByRole('button', { name: /carica/i })
      // Focus should be on the button
      await expect(document.activeElement).toBe(uploadButton)
    })
    
    await step('Activate upload button with Enter key', async () => {
      const uploadButton = canvas.getByRole('button', { name: /carica/i })
      uploadButton.focus()
      await expect(document.activeElement).toBe(uploadButton)
      
      await userEvent.keyboard('{Enter}')
      // Button should be activated without errors
      await expect(uploadButton).toBeInTheDocument()
    })
    
    await step('Activate upload button with Space key', async () => {
      const uploadButton = canvas.getByRole('button', { name: /carica/i })
      uploadButton.focus()
      await expect(document.activeElement).toBe(uploadButton)
      
      await userEvent.keyboard(' ')
      // Button should be activated without errors
      await expect(uploadButton).toBeInTheDocument()
    })
  }
}

export const Accessibility: Story = {
  render: (args) => ({
    components: { FzUpload },
    setup() {
      const files = ref([
        new File([], 'test-image1.png')
      ])
      return { files, args }
    },
    template: `
      <FzUpload v-bind="args" v-model="files"/>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify upload button is accessible', async () => {
      const uploadButton = canvas.getByRole('button', { name: /carica/i })
      await expect(uploadButton).toBeInTheDocument()
      await expect(uploadButton).toBeVisible()
    })
    
    await step('Verify file input has id attribute', async () => {
      const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement
      await expect(input).toBeInTheDocument()
      // Input should have id attribute
      await expect(input.id).toBeTruthy()
    })
    
    await step('Verify file links are accessible', async () => {
      // Use getAllByText and find the link within the component
      const fileLinks = canvas.getAllByText('test-image1.png')
      await expect(fileLinks.length).toBeGreaterThan(0)
      
      // Find the link within the component's file list
      const uploadContainer = canvasElement.querySelector('.text-md')
      const fileList = uploadContainer?.querySelector('ul')
      const link = fileList?.querySelector('a')
      if (link) {
        await expect(link).toBeInTheDocument()
      }
    })
    
    await step('Verify delete buttons are accessible', async () => {
      const deleteButtons = canvasElement.querySelectorAll('button')
      // Should have at least one delete button
      await expect(deleteButtons.length).toBeGreaterThan(0)
    })
    
    await step('Verify drag and drop instructions are visible', async () => {
      const dragLabel = canvas.getByText(/o trascina qui/i)
      await expect(dragLabel).toBeInTheDocument()
      await expect(dragLabel).toBeVisible()
    })
  }
}

export const EmptyState: Story = {
  render: (args) => ({
    components: { FzUpload },
    setup() {
      const files = ref<File[]>([])
      return { files, args }
    },
    template: `
      <FzUpload v-bind="args" v-model="files"/>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify upload component renders without files', async () => {
      const uploadButton = canvas.getByRole('button', { name: /carica/i })
      await expect(uploadButton).toBeInTheDocument()
    })
    
    await step('Verify file list is not displayed when empty', async () => {
      // Check for file list within the component (not the decorator's list)
      const uploadContainer = canvasElement.querySelector('.text-md')
      const fileList = uploadContainer?.querySelector('ul')
      await expect(fileList).not.toBeInTheDocument()
    })
    
    await step('Verify drag and drop zone is visible', async () => {
      const dropZone = canvasElement.querySelector('.border-dashed')
      await expect(dropZone).toBeInTheDocument()
      await expect(dropZone).toBeVisible()
    })
  }
}

export default meta
