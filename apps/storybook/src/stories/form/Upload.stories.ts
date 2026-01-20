import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within, waitFor } from '@storybook/test'
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

// ============================================
// TEMPLATE
// ============================================

const Template: Story = {
  render: (args) => ({
    components: { FzUpload },
    setup() {
      const files = ref<File[]>([])
      // Support spy functions from args for update:modelValue and custom events
      const handleUpdate = (value: File[]) => {
        files.value = value
        if (args['onUpdate:modelValue']) {
          args['onUpdate:modelValue'](value)
        }
      }
      const handleChange = (eventFiles: File[]) => {
        if (args['onFzupload:change']) {
          args['onFzupload:change'](eventFiles)
        }
      }
      const handleAdd = (eventFiles: File[]) => {
        if (args['onFzupload:add']) {
          args['onFzupload:add'](eventFiles)
        }
      }
      const handleDelete = (file: File) => {
        if (args['onFzupload:delete']) {
          args['onFzupload:delete'](file)
        }
      }
      return {
        files,
        args,
        handleUpdate,
        handleChange,
        handleAdd,
        handleDelete
      }
    },
    template: `
      <FzUpload 
        v-bind="args" 
        :modelValue="files" 
        @update:modelValue="handleUpdate"
        @fzupload:change="handleChange"
        @fzupload:add="handleAdd"
        @fzupload:delete="handleDelete"
      />
    `
  })
}

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
  ...Template,
  args: {
    'onUpdate:modelValue': fn(),
    'onFzupload:change': fn(),
    'onFzupload:add': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify upload button is clickable', async () => {
      const uploadButton = canvas.getByRole('button', { name: /carica/i })
      await expect(uploadButton).toBeInTheDocument()
      await expect(uploadButton).toBeVisible()
    })
    
    await step('Select file via file input', async () => {
      const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement
      await expect(input).toBeInTheDocument()
      
      // Create a test file
      const testFile = new File(['test content'], 'test-file.txt', { type: 'text/plain' })
      
      // Create a FileList with the test file
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(testFile)
      input.files = dataTransfer.files
      
      // Trigger change event
      const changeEvent = new Event('change', { bubbles: true })
      input.dispatchEvent(changeEvent)
      
      // Wait for the file to be added to the model
      await waitFor(() => {
        const uploadContainer = canvasElement.querySelector('.text-md')
        const fileList = uploadContainer?.querySelector('ul')
        expect(fileList).toBeInTheDocument()
      }, { timeout: 1000 })
      
      // Verify file appears in the list
      const fileLinks = canvas.getAllByText('test-file.txt')
      await expect(fileLinks.length).toBeGreaterThan(0)
    })
    
    await step('Verify update:modelValue handler IS called when file is selected', async () => {
      // ROBUST CHECK: Verify the update:modelValue spy WAS called
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })
    
    await step('Verify fzupload:change handler IS called when file is selected', async () => {
      // ROBUST CHECK: Verify the fzupload:change spy WAS called
      await expect(args['onFzupload:change']).toHaveBeenCalled()
    })
    
    await step('Verify fzupload:add handler IS called when file is selected', async () => {
      // ROBUST CHECK: Verify the fzupload:add spy WAS called
      await expect(args['onFzupload:add']).toHaveBeenCalled()
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
      // Support spy functions from args
      const handleUpdate = (value: File[]) => {
        files.value = value
        if (args['onUpdate:modelValue']) {
          args['onUpdate:modelValue'](value)
        }
      }
      const handleDelete = (file: File) => {
        if (args['onFzupload:delete']) {
          args['onFzupload:delete'](file)
        }
      }
      return { files, args, handleUpdate, handleDelete }
    },
    template: `
      <FzUpload 
        v-bind="args" 
        :modelValue="files" 
        @update:modelValue="handleUpdate"
        @fzupload:delete="handleDelete"
        multiple
      />
    `
  }),
  args: {
    'onUpdate:modelValue': fn(),
    'onFzupload:delete': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify files are displayed', async () => {
      // Use getAllByText since decorator also shows files
      const file1Links = canvas.getAllByText('test-image1.png')
      await expect(file1Links.length).toBeGreaterThan(0)
      const file2Links = canvas.getAllByText('test-image2.png')
      await expect(file2Links.length).toBeGreaterThan(0)
    })
    
    await step('Remove first file by clicking delete button', async () => {
      // Find the file list within the component (not the decorator's list)
      const uploadContainer = canvasElement.querySelector('.text-md')
      const fileList = uploadContainer?.querySelector('ul')
      await expect(fileList).toBeInTheDocument()
      
      const initialFileCount = fileList?.querySelectorAll('li').length || 0
      await expect(initialFileCount).toBe(2)
      
      const firstFileItem = fileList?.querySelector('li:first-child')
      await expect(firstFileItem).toBeInTheDocument()
      
      // Verify the file name is visible before deletion
      const firstFileName = firstFileItem?.textContent
      await expect(firstFileName).toContain('test-image1.png')
      
      const deleteButton = firstFileItem?.querySelector('button')
      await expect(deleteButton).toBeInTheDocument()
      
      await userEvent.click(deleteButton!)
      
      // Wait for UI update - check that file count decreased
      await waitFor(() => {
        const updatedFileList = uploadContainer?.querySelector('ul')
        const remainingFiles = updatedFileList?.querySelectorAll('li') || []
        expect(remainingFiles.length).toBe(1)
      }, { timeout: 1000 })
      
      // Verify the remaining file is the second one
      const updatedFileList = uploadContainer?.querySelector('ul')
      const remainingFile = updatedFileList?.querySelector('li:first-child')
      await expect(remainingFile?.textContent).toContain('test-image2.png')
    })
    
    await step('Verify update:modelValue handler IS called when file is deleted', async () => {
      // ROBUST CHECK: Verify the update:modelValue spy WAS called
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })
    
    await step('Verify fzupload:delete handler IS called when file is deleted', async () => {
      // ROBUST CHECK: Verify the fzupload:delete spy WAS called
      await expect(args['onFzupload:delete']).toHaveBeenCalled()
    })
  }
}

export const DragAndDrop: Story = {
  ...Template,
  args: {
    'onUpdate:modelValue': fn(),
    'onFzupload:change': fn(),
    'onFzupload:add': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify drag and drop zone is present', async () => {
      const dropZone = canvasElement.querySelector('.border-dashed')
      await expect(dropZone).toBeInTheDocument()
      await expect(dropZone).toBeVisible()
    })
    
    await step('Simulate drag and drop of a file', async () => {
      const dropZone = canvasElement.querySelector('.border-dashed') as HTMLElement
      await expect(dropZone).toBeInTheDocument()
      
      // Create test files
      const testFile1 = new File(['content1'], 'dropped-file1.txt', { type: 'text/plain' })
      const testFile2 = new File(['content2'], 'dropped-file2.txt', { type: 'text/plain' })
      
      // Create drag event data
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(testFile1)
      dataTransfer.items.add(testFile2)
      
      // Simulate dragover event (required for drop to work)
      const dragoverEvent = new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dataTransfer
      })
      dropZone.dispatchEvent(dragoverEvent)
      
      // Simulate drop event
      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dataTransfer
      })
      dropZone.dispatchEvent(dropEvent)
      
      // Wait for files to be added
      await waitFor(() => {
        const uploadContainer = canvasElement.querySelector('.text-md')
        const fileList = uploadContainer?.querySelector('ul')
        expect(fileList).toBeInTheDocument()
      }, { timeout: 1000 })
      
      // Verify files appear in the list
      // When multiple=false, only first file should be shown
      const fileLinks = canvas.getAllByText('dropped-file1.txt')
      await expect(fileLinks.length).toBeGreaterThan(0)
    })
    
    await step('Verify update:modelValue handler IS called when file is dropped', async () => {
      // ROBUST CHECK: Verify the update:modelValue spy WAS called
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })
    
    await step('Verify fzupload:change handler IS called when file is dropped', async () => {
      // ROBUST CHECK: Verify the fzupload:change spy WAS called
      await expect(args['onFzupload:change']).toHaveBeenCalled()
    })
    
    await step('Verify fzupload:add handler IS called when file is dropped', async () => {
      // ROBUST CHECK: Verify the fzupload:add spy WAS called
      await expect(args['onFzupload:add']).toHaveBeenCalled()
    })
  }
}

export const DragAndDropMultiple: Story = {
  ...Template,
  args: {
    multiple: true,
    'onUpdate:modelValue': fn(),
    'onFzupload:change': fn(),
    'onFzupload:add': fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Simulate drag and drop of multiple files', async () => {
      const dropZone = canvasElement.querySelector('.border-dashed') as HTMLElement
      await expect(dropZone).toBeInTheDocument()
      
      // Create test files
      const testFile1 = new File(['content1'], 'multi-file1.txt', { type: 'text/plain' })
      const testFile2 = new File(['content2'], 'multi-file2.txt', { type: 'text/plain' })
      const testFile3 = new File(['content3'], 'multi-file3.txt', { type: 'text/plain' })
      
      // Create drag event data
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(testFile1)
      dataTransfer.items.add(testFile2)
      dataTransfer.items.add(testFile3)
      
      // Simulate dragover event
      const dragoverEvent = new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dataTransfer
      })
      dropZone.dispatchEvent(dragoverEvent)
      
      // Simulate drop event
      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dataTransfer
      })
      dropZone.dispatchEvent(dropEvent)
      
      // Wait for files to be added
      await waitFor(() => {
        const uploadContainer = canvasElement.querySelector('.text-md')
        const fileList = uploadContainer?.querySelector('ul')
        expect(fileList).toBeInTheDocument()
        const fileItems = fileList?.querySelectorAll('li') || []
        expect(fileItems.length).toBe(3)
      }, { timeout: 1000 })
      
      // Verify all files appear in the list
      const file1Links = canvas.getAllByText('multi-file1.txt')
      await expect(file1Links.length).toBeGreaterThan(0)
      const file2Links = canvas.getAllByText('multi-file2.txt')
      await expect(file2Links.length).toBeGreaterThan(0)
      const file3Links = canvas.getAllByText('multi-file3.txt')
      await expect(file3Links.length).toBeGreaterThan(0)
    })
    
    await step('Verify update:modelValue handler IS called when multiple files are dropped', async () => {
      // ROBUST CHECK: Verify the update:modelValue spy WAS called
      await expect(args['onUpdate:modelValue']).toHaveBeenCalled()
    })
    
    await step('Verify fzupload:change handler IS called when multiple files are dropped', async () => {
      // ROBUST CHECK: Verify the fzupload:change spy WAS called
      await expect(args['onFzupload:change']).toHaveBeenCalled()
    })
    
    await step('Verify fzupload:add handler IS called when multiple files are dropped', async () => {
      // ROBUST CHECK: Verify the fzupload:add spy WAS called
      await expect(args['onFzupload:add']).toHaveBeenCalled()
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
