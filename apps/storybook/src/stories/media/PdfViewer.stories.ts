import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from 'storybook/test'
import { FzPdfViewer } from '@fiscozen/pdf-viewer'

const PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
const SINGLE_PAGE_PDF_URL = '/single-page.pdf'
const XML_DATA_URL =
  'data:application/xml;charset=utf-8,' +
  encodeURIComponent(
    `<?xml version="1.0" encoding="UTF-8"?>
<FatturaElettronica versione="FPR12">
  <FatturaElettronicaHeader>
    <DatiTrasmissione>
      <IdTrasmittente>
        <IdPaese>IT</IdPaese>
        <IdCodice>12345678901</IdCodice>
      </IdTrasmittente>
      <ProgressivoInvio>00001</ProgressivoInvio>
      <FormatoTrasmissione>FPR12</FormatoTrasmissione>
      <CodiceDestinatario>XXXXXXX</CodiceDestinatario>
    </DatiTrasmissione>
    <CedentePrestatore>
      <DatiAnagrafici>
        <IdFiscaleIVA>
          <IdPaese>IT</IdPaese>
          <IdCodice>12345678901</IdCodice>
        </IdFiscaleIVA>
        <Anagrafica>
          <Denominazione>Fornitore SRL</Denominazione>
        </Anagrafica>
        <RegimeFiscale>RF19</RegimeFiscale>
      </DatiAnagrafici>
    </CedentePrestatore>
  </FatturaElettronicaHeader>
  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <TipoDocumento>TD01</TipoDocumento>
        <Divisa>EUR</Divisa>
        <Data>2024-01-15</Data>
        <Numero>2024-001</Numero>
        <ImportoTotaleDocumento>1220.00</ImportoTotaleDocumento>
      </DatiGeneraliDocumento>
    </DatiGenerali>
    <DatiBeniServizi>
      <DettaglioLinee>
        <NumeroLinea>1</NumeroLinea>
        <Descrizione>Servizio di consulenza</Descrizione>
        <Quantita>1.00</Quantita>
        <PrezzoUnitario>1000.00</PrezzoUnitario>
        <PrezzoTotale>1000.00</PrezzoTotale>
        <AliquotaIVA>22.00</AliquotaIVA>
      </DettaglioLinee>
      <DatiRiepilogo>
        <AliquotaIVA>22.00</AliquotaIVA>
        <ImponibileImporto>1000.00</ImponibileImporto>
        <Imposta>220.00</Imposta>
      </DatiRiepilogo>
    </DatiBeniServizi>
  </FatturaElettronicaBody>
</FatturaElettronica>`
  )
const PDF_LOAD_TIMEOUT = 5000
const PDF_CLEANUP_DELAY = 300

const waitForPdfLoad = async (canvasElement: HTMLElement): Promise<void> => {
  await waitFor(
    () => {
      expect(canvasElement.querySelector('[data-testid="pdf-page"]')).toBeInTheDocument()
    },
    { timeout: PDF_LOAD_TIMEOUT }
  )
}

const waitForPdfCleanup = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, PDF_CLEANUP_DELAY))
}

const waitForSinglePagePdfLoad = async (canvasElement: HTMLElement): Promise<void> => {
  await waitFor(
    () => {
      expect(canvasElement.querySelector('canvas')).toBeInTheDocument()
    },
    { timeout: PDF_LOAD_TIMEOUT }
  )
}

const meta: Meta<typeof FzPdfViewer> = {
  title: 'Media/FzPdfViewer',
  component: FzPdfViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    environment: {
      control: 'select',
      options: ['frontoffice', 'backoffice']
    },
    toolbarVariant: {
      control: 'select',
      options: ['basic', 'advanced']
    },
    toolbarPosition: {
      control: 'select',
      options: ['bottom', 'top']
    },
    initialScale: {
      control: { type: 'range', min: 0.25, max: 2, step: 0.25 }
    },
    minScale: {
      control: { type: 'range', min: 0.25, max: 1, step: 0.25 }
    },
    maxScale: {
      control: { type: 'range', min: 1, max: 4, step: 0.25 }
    },
    scaleStep: {
      control: { type: 'range', min: 0.25, max: 1, step: 0.25 }
    },
    initialPage: {
      control: 'number'
    },
    height: {
      control: 'text'
    },
    width: {
      control: 'text'
    },
    selectable: {
      control: 'boolean'
    },
    rotatable: {
      control: 'boolean'
    },
    xmlSrc: {
      control: 'text'
    },
    pdfContainerClass: {
      control: false
    },
    containerClass: {
      control: false
    }
  },
  args: {
    src: PDF_URL,
    environment: 'frontoffice',
    toolbarVariant: 'basic',
    toolbarPosition: 'bottom',
    initialScale: 1,
    initialPage: 1,
    minScale: 0.25,
    maxScale: 2,
    scaleStep: 0.25,
    height: '100vh',
    width: '100%',
    selectable: false,
    rotatable: false,
    xmlSrc: ''
  }
}

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    toolbarVariant: 'basic'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })

    await step('Verify scale display shows 100%', async () => {
      const scaleDisplay = canvas.getByTestId('pdf-scale')
      await expect(scaleDisplay).toBeVisible()
      await expect(scaleDisplay.textContent).toMatch(/100\s*%/)
    })

    await step('Verify page navigation is present', async () => {
      const pageDisplay = canvas.getByTestId('pdf-page')
      await expect(pageDisplay).toBeVisible()
      await expect(pageDisplay.textContent).toMatch(/1\s*\/\s*\d+/)
    })

    await step('Zoom in and verify scale increases', async () => {
      const zoomIn = canvas.getByRole('button', { name: 'Zoom in' }) as HTMLButtonElement
      await userEvent.click(zoomIn)
      await waitFor(
        () => {
          expect(canvas.getByTestId('pdf-scale').textContent).toContain('125')
        },
        { timeout: 2000 }
      )
    })

    await step('Navigate to next page', async () => {
      const next = canvas.getByRole('button', { name: 'Next page' }) as HTMLButtonElement
      await waitFor(() => expect(next).not.toBeDisabled(), { timeout: 3000 })
      await userEvent.click(next)
      await waitFor(
        () => {
          expect(canvas.getByTestId('pdf-page').textContent).toContain('2 /')
        },
        { timeout: 2000 }
      )
    })

    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const Advanced: Story = {
  args: {
    toolbarVariant: 'advanced'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })

    await step('Verify download button is present', async () => {
      await expect(canvas.getByRole('button', { name: 'Download' })).toBeInTheDocument()
    })

    await step('Verify tabs are NOT shown without xmlSrc', async () => {
      await expect(canvasElement.querySelector('.tab-container')).not.toBeInTheDocument()
    })

    await step('Zoom in and verify scale increases', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Zoom in' }))
      await waitFor(
        () => {
          const value = parseInt(
            canvas.getByTestId('pdf-scale').textContent?.replace('%', '').trim() ?? '0'
          )
          expect(value).toBeGreaterThan(100)
        },
        { timeout: 2000 }
      )
    })

    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const AdvancedWithXmlViewer: Story = {
  name: 'Advanced — PDF/XML toggle',
  args: {
    toolbarVariant: 'advanced',
    xmlSrc: XML_DATA_URL
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })

    await step('Verify PDF/XML tabs are shown', async () => {
      await expect(canvasElement.querySelector('.tab-container')).toBeInTheDocument()
    })

    await step('Verify download button is present in PDF mode', async () => {
      await expect(canvas.getByRole('button', { name: 'Download' })).toBeInTheDocument()
    })

    await step('Verify zoom and page controls are visible in PDF mode', async () => {
      await expect(canvas.getByTestId('pdf-scale')).toBeInTheDocument()
      await expect(canvas.getByTestId('pdf-page')).toBeInTheDocument()
    })

    await step('Switch to XML view', async () => {
      const tabs = canvasElement.querySelectorAll('.tab-container button')
      const xmlTab = Array.from(tabs).find(
        (btn) => btn.getAttribute('title')?.toLowerCase() === 'xml'
      ) as HTMLButtonElement
      await userEvent.click(xmlTab)
    })

    await step('Verify iframe is shown in XML mode', async () => {
      await waitFor(
        () => {
          expect(canvasElement.querySelector('iframe')).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })

    await step('Verify zoom and page controls are hidden in XML mode', async () => {
      await expect(canvas.queryByTestId('pdf-scale')).not.toBeInTheDocument()
      await expect(canvas.queryByTestId('pdf-page')).not.toBeInTheDocument()
    })

    await step('Verify download button remains visible in XML mode', async () => {
      await expect(canvas.getByRole('button', { name: 'Download' })).toBeInTheDocument()
    })

    await step('Switch back to PDF view', async () => {
      const pdfTab = Array.from(canvasElement.querySelectorAll('.tab-container button')).find(
        (btn) => btn.getAttribute('title')?.toLowerCase() === 'pdf'
      ) as HTMLButtonElement
      await userEvent.click(pdfTab)
      await waitFor(
        () => {
          expect(canvas.getByTestId('pdf-scale')).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })

    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const Backoffice: Story = {
  args: {
    environment: 'backoffice'
  },
  play: async ({ canvasElement, step }) => {
    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })

    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const ToolbarAtTop: Story = {
  args: {
    toolbarPosition: 'top'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })

    await step('Verify container uses flex-col-reverse for top position', async () => {
      await expect(canvasElement.querySelector('.flex-col-reverse')).toBeInTheDocument()
    })

    await step('Navigate to next page from top toolbar', async () => {
      const next = canvas.getByRole('button', { name: 'Next page' }) as HTMLButtonElement
      await waitFor(() => expect(next).not.toBeDisabled(), { timeout: 3000 })
      await userEvent.click(next)
      await waitFor(
        () => {
          expect(canvas.getByTestId('pdf-page').textContent).toContain('2 /')
        },
        { timeout: 2000 }
      )
    })

    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const AdvancedToolbarAtTop: Story = {
  args: {
    toolbarVariant: 'advanced',
    toolbarPosition: 'top',
    xmlSrc: XML_DATA_URL
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })

    await step('Verify container uses flex-col-reverse', async () => {
      await expect(canvasElement.querySelector('.flex-col-reverse')).toBeInTheDocument()
    })

    await step('Verify advanced toolbar controls are present', async () => {
      await expect(canvasElement.querySelector('.tab-container')).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: 'Download' })).toBeInTheDocument()
    })

    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const Accessibility: Story = {
  args: {
    initialPage: 2
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })

    await step('Activate next page button with Enter key', async () => {
      const next = canvas.getByRole('button', { name: 'Next page' }) as HTMLButtonElement
      await waitFor(() => expect(next).not.toBeDisabled(), { timeout: 3000 })
      next.focus()
      await waitFor(() => expect(document.activeElement).toBe(next), { timeout: 500 })
      await userEvent.keyboard('{Enter}')
      await waitFor(
        () => {
          expect(canvas.getByTestId('pdf-page').textContent).toContain('3 /')
        },
        { timeout: 2000 }
      )
    })

    await step('Activate previous page button with Space key', async () => {
      const prev = canvas.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement
      prev.focus()
      await expect(document.activeElement).toBe(prev)
      await userEvent.keyboard(' ')
      await waitFor(
        () => {
          expect(canvas.getByTestId('pdf-page').textContent).toContain('2 /')
        },
        { timeout: 2000 }
      )
    })

    await step('Activate zoom in button with Enter key', async () => {
      const zoomIn = canvas.getByRole('button', { name: 'Zoom in' }) as HTMLButtonElement
      zoomIn.focus()
      await expect(document.activeElement).toBe(zoomIn)
      await userEvent.keyboard('{Enter}')
      await waitFor(
        () => {
          const value = parseInt(
            canvas.getByTestId('pdf-scale').textContent?.replace('%', '').trim() ?? '0'
          )
          expect(value).toBeGreaterThan(100)
        },
        { timeout: 2000 }
      )
    })

    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const SinglePage: Story = {
  args: {
    src: SINGLE_PAGE_PDF_URL
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Wait for PDF to load', async () => {
      await waitForSinglePagePdfLoad(canvasElement)
    })

    await step('Verify page navigation is not shown for single-page PDF', async () => {
      await expect(canvas.queryByTestId('pdf-page')).not.toBeInTheDocument()
      await expect(canvas.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument()
      await expect(canvas.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument()
    })

    await step('Verify zoom controls are still present', async () => {
      await expect(canvas.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument()
    })

    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const TextSelection: Story = {
  args: {
    selectable: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })

    await step('Verify zoom and page controls are present', async () => {
      await expect(canvas.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument()
      await expect(canvas.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument()
      await expect(canvas.getByTestId('pdf-page')).toBeInTheDocument()
    })

    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  }
}

export const WithRotation: Story = {
  args: {
    toolbarVariant: 'advanced',
    rotatable: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Wait for PDF to load', async () => {
      await waitForPdfLoad(canvasElement)
    })

    await step('Verify rotate button is present', async () => {
      await expect(canvas.getByRole('button', { name: 'Rotate' })).toBeInTheDocument()
    })

    await step('Click rotate and verify button remains available', async () => {
      const rotateBtn = canvas.getByRole('button', { name: 'Rotate' }) as HTMLButtonElement
      await userEvent.click(rotateBtn)
      await expect(rotateBtn).toBeInTheDocument()
    })

    await step('Allow PDF library cleanup', async () => {
      await waitForPdfCleanup()
    })
  },
}

export default meta
