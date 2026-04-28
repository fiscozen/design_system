import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { usePDF } from "@tato30/vue-pdf";
import FzPdfViewer from "../FzPdfViewer.vue";

const mockUsePDF = vi.mocked(usePDF);

// Mock ResizeObserver for jsdom environment
// Note: The global mock is already set in vitest.setup.ts, but we keep this
// for explicit clarity in this test file
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock VuePDF and usePDF from @tato30/vue-pdf
vi.mock("@tato30/vue-pdf", async () => {
  const vue = await import("vue");
  const mockUsePDF = vi.fn(() => ({
    pdf: vue.ref({ numPages: 5, getPage: vi.fn() }),
    pages: vue.ref(5),
  }));

  return {
    VuePDF: {
      name: "VuePDF",
      template: '<div data-testid="vue-pdf" :class="$attrs.class" />',
      props: ["pdf", "page", "scale", "rotation", "textLayer"],
    },
    usePDF: mockUsePDF,
  };
});

// Mock FzTabs / FzTab
const mockFzTabs = {
  name: "FzTabs",
  template: '<div data-testid="fz-tabs"><slot /></div>',
  emits: ["change"],
  props: ["environment", "tabStyle"],
};

const mockFzTab = {
  name: "FzTab",
  template:
    '<div :data-title="title" :data-initial-selected="initialSelected"></div>',
  props: ["title", "icon", "initialSelected", "disabled"],
};

// Mock FzIconButton
const mockFzIconButton = {
  name: "FzIconButton",
  template:
    '<button :disabled="disabled" @click="handleClick"><slot /></button>',
  props: ["iconName", "iconVariant", "environment", "variant", "disabled"],
  emits: ["click"],
  setup(props: any, { emit }: any) {
    const handleClick = (event: Event) => {
      if (!props.disabled) {
        emit("click", event);
      }
    };
    return { handleClick };
  },
};

describe("FzPdfViewer", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    // Reset mock
    mockUsePDF.mockReturnValue({
      pdf: ref({ numPages: 5, getPage: vi.fn() }),
      pages: ref(5),
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.clearAllMocks();
  });

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with default props", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('[data-testid="vue-pdf"]').exists()).toBe(true);
    });

    it("should render with src prop", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/document.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      expect(wrapper.exists()).toBe(true);
      expect(mockUsePDF).toHaveBeenCalledWith(
        "https://example.com/document.pdf",
      );
    });

    it("should render PDF container", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const pdfContainer = wrapper.find(".bg-grey-100");
      expect(pdfContainer.exists()).toBe(true);
    });

    it("should render navigation controls", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      expect(buttons.length).toBe(4); // minus, plus, left arrow, right arrow
    });

    it("should render page indicator", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
      expect(pageIndicator.exists()).toBe(true);
      expect(pageIndicator.text()).toContain("1 / 5");
    });

    it("should render scale indicator", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
      expect(scaleIndicator.exists()).toBe(true);
      expect(scaleIndicator.text()).toContain("100 %");
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("src prop", () => {
      it("should accept src prop", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        expect(wrapper.props("src")).toBe("https://example.com/test.pdf");
      });

      it("should call usePDF with src", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/document.pdf",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        expect(mockUsePDF).toHaveBeenCalledWith(
          "https://example.com/document.pdf",
        );
      });
    });

    describe("environment prop", () => {
      it("should default to frontoffice environment", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        expect(wrapper.props("environment")).toBe("frontoffice");
      });

      it.each(["frontoffice", "backoffice"])(
        "should apply consistent text classes for %s environment",
        async (environment) => {
          wrapper = mount(FzPdfViewer, {
            props: {
              src: "https://example.com/test.pdf",
              environment: environment as "frontoffice" | "backoffice",
            },
            global: {
              stubs: {
                FzIconButton: mockFzIconButton,
              },
            },
          });
          await nextTick();
          const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
          expect(scaleIndicator.classes()).toContain("text-base");
          expect(scaleIndicator.classes()).toContain("font-normal");
          expect(scaleIndicator.classes()).toContain("lining-nums");
          expect(scaleIndicator.classes()).toContain("tabular-nums");
        },
      );
    });

    describe("height prop", () => {
      it("should default to 768px", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const container = wrapper.find("div");
        expect(container.attributes("style")).toContain("height: 768px");
      });

      it("should apply custom height", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            height: "600px",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const container = wrapper.find("div");
        expect(container.attributes("style")).toContain("height: 600px");
      });
    });

    describe("width prop", () => {
      it("should default to 512px", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const container = wrapper.find("div");
        expect(container.attributes("style")).toContain("width: 512px");
      });

      it("should apply custom width", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            width: "800px",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const container = wrapper.find("div");
        expect(container.attributes("style")).toContain("width: 800px");
      });
    });

    describe("initialPage prop", () => {
      it("should default to page 1", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
        expect(pageIndicator.text()).toContain("1 / 5");
      });

      it("should start at specified initial page", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            initialPage: 3,
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
        expect(pageIndicator.text()).toContain("3 / 5");
      });
    });

    describe("initialScale prop", () => {
      it("should default to scale 1 (100%)", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
        expect(scaleIndicator.text()).toContain("100 %");
      });

      it("should start at specified initial scale", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            initialScale: 1.5,
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
        expect(scaleIndicator.text()).toContain("150 %");
      });
    });

    describe("containerClass prop", () => {
      it("should apply custom container class", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            containerClass: "custom-container",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const container = wrapper.find("div");
        expect(container.classes()).toContain("custom-container");
      });
    });

    describe("pdfContainerClass prop", () => {
      it("should apply custom PDF container class", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            pdfContainerClass: "custom-pdf-container",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const pdfContainer = wrapper.find(".bg-grey-100");
        expect(pdfContainer.classes()).toContain("custom-pdf-container");
      });
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should change page when previous button is clicked", async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialPage: 2,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      await nextTick();

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const prevButton = buttons[2]; // Third button is the left arrow

      await prevButton.trigger("click");
      await nextTick();

      const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
      expect(pageIndicator.text()).toContain("1 / 5");
    });

    it("should change page when next button is clicked", async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialPage: 1,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      await nextTick();

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const nextButton = buttons[3]; // Fourth button is the right arrow

      await nextButton.trigger("click");
      await nextTick();

      const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
      expect(pageIndicator.text()).toContain("2 / 5");
    });

    it("should not change page below 1", async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialPage: 1,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      await nextTick();

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const prevButton = buttons[2];

      await prevButton.trigger("click");
      await nextTick();

      const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
      expect(pageIndicator.text()).toContain("1 / 5");
    });

    it("should not change page above total pages", async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialPage: 5,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      await nextTick();

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const nextButton = buttons[3];

      await nextButton.trigger("click");
      await nextTick();

      const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
      expect(pageIndicator.text()).toContain("5 / 5");
    });

    it("should increase scale when plus button is clicked", async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialScale: 1,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      await nextTick();

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const plusButton = buttons[1]; // Second button is the plus

      await plusButton.trigger("click");
      await nextTick();

      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
      expect(scaleIndicator.text()).toContain("125 %");
    });

    it("should decrease scale when minus button is clicked", async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialScale: 1.25,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      await nextTick();

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const minusButton = buttons[0]; // First button is the minus

      await minusButton.trigger("click");
      await nextTick();

      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
      expect(scaleIndicator.text()).toContain("100 %");
    });

    it("should not decrease scale below 0.25", async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialScale: 0.25,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      await nextTick();

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const minusButton = buttons[0];

      await minusButton.trigger("click");
      await nextTick();

      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
      expect(scaleIndicator.text()).toContain("25 %");
    });

    it("should not increase scale above 2", async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialScale: 2,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      await nextTick();

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const plusButton = buttons[1];

      await plusButton.trigger("click");
      await nextTick();

      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
      expect(scaleIndicator.text()).toContain("200 %");
    });

    it("should disable previous button on first page", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialPage: 1,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const prevButton = buttons[2];
      expect(prevButton.props("disabled")).toBe(true);
    });

    it("should disable next button on last page", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialPage: 5,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const nextButton = buttons[3];
      expect(nextButton.props("disabled")).toBe(true);
    });

    it("should disable minus button at minimum scale", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialScale: 0.25,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const minusButton = buttons[0];
      expect(minusButton.props("disabled")).toBe(true);
    });

    it("should disable plus button at maximum scale", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialScale: 2,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const plusButton = buttons[1];
      expect(plusButton.props("disabled")).toBe(true);
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply static container classes", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const container = wrapper.find("div");
      expect(container.classes()).toContain("flex");
      expect(container.classes()).toContain("flex-col");
      expect(container.classes()).not.toContain("gap-12");
    });

    it("should apply static PDF container classes", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const pdfContainer = wrapper.find(".bg-grey-100");
      expect(pdfContainer.classes()).toContain("bg-grey-100");
      expect(pdfContainer.classes()).toContain("p-24");
      expect(pdfContainer.classes()).toContain("flex");
      expect(pdfContainer.classes()).toContain("overflow-hidden");
      expect(pdfContainer.classes()).toContain("rounded");
    });

    it("should apply static text classes", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
      expect(scaleIndicator.classes()).toContain("text-grey-500");
      expect(scaleIndicator.classes()).toContain("font-normal");
      expect(scaleIndicator.classes()).toContain("text-base");
      expect(scaleIndicator.classes()).toContain("lining-nums");
      expect(scaleIndicator.classes()).toContain("tabular-nums");
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("ARIA attributes", () => {
      it("should have accessible navigation buttons", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
        // All navigation buttons should be accessible
        expect(buttons.length).toBeGreaterThan(0);
        buttons.forEach((button) => {
          expect(button.exists()).toBe(true);
        });
      });

      it("should have disabled state on navigation buttons when appropriate", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            initialPage: 1,
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
        const prevButton = buttons[2];
        expect(prevButton.props("disabled")).toBe(true);
      });

      it("should display page information for screen readers", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            initialPage: 2,
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
        expect(pageIndicator.exists()).toBe(true);
        expect(pageIndicator.text()).toContain("2 / 5");
      });

      it("should display scale information for screen readers", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            initialScale: 1.5,
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
        expect(scaleIndicator.exists()).toBe(true);
        expect(scaleIndicator.text()).toContain("150 %");
      });
    });

    describe("Keyboard navigation", () => {
      it("should have focusable navigation buttons", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
          },
          global: {
            stubs: {
              FzIconButton: mockFzIconButton,
            },
          },
        });
        const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
        buttons.forEach((button) => {
          const buttonElement = button.find("button");
          if (buttonElement.exists()) {
            expect(buttonElement.element.tagName).toBe("BUTTON");
          }
        });
      });
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle single page PDF", () => {
      mockUsePDF.mockReturnValueOnce({
        pdf: ref({ numPages: 1, getPage: vi.fn() }),
        pages: ref(1),
      });

      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/single-page.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });

      // Navigation is hidden entirely for single-page PDFs
      const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
      expect(pageIndicator.exists()).toBe(false);

      // Only zoom controls are rendered (2 buttons)
      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      expect(buttons).toHaveLength(2);
    });

    it("should handle PDF with many pages", () => {
      mockUsePDF.mockReturnValueOnce({
        pdf: ref({ numPages: 100, getPage: vi.fn() }),
        pages: ref(100),
      });

      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/large.pdf",
          initialPage: 50,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });

      const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
      expect(pageIndicator.text()).toContain("50 / 100");
    });

    it("should handle scale at boundaries", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialScale: 0.25,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const minusButton = buttons[0];
      expect(minusButton.props("disabled")).toBe(true);
    });

    it("should handle invalid page numbers gracefully", async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialPage: 1,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      await nextTick();

      // Try to go to page 0
      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const prevButton = buttons[2];
      await prevButton.trigger("click");
      await nextTick();

      const pageIndicator = wrapper.find('[data-testid="pdf-page"]');
      expect(pageIndicator.text()).toContain("1 / 5");
    });

    it("should handle scale changes at boundaries", async () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialScale: 0.25,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      await nextTick();

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      const minusButton = buttons[0];
      await minusButton.trigger("click");
      await nextTick();

      const scaleIndicator = wrapper.find('[data-testid="pdf-scale"]');
      expect(scaleIndicator.text()).toContain("25 %");
    });
  });

  // ============================================
  // TOOLBAR VARIANT TESTS
  // ============================================
  describe("Toolbar Variant", () => {
    describe("basic toolbar (default)", () => {
      it("should render 4 buttons by default (zoom + nav)", () => {
        wrapper = mount(FzPdfViewer, {
          props: { src: "https://example.com/test.pdf" },
          global: { stubs: { FzIconButton: mockFzIconButton } },
        });
        const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
        expect(buttons).toHaveLength(4);
      });

      it("should not render view mode buttons in basic toolbar", () => {
        wrapper = mount(FzPdfViewer, {
          props: { src: "https://example.com/test.pdf" },
          global: { stubs: { FzIconButton: mockFzIconButton } },
        });
        const pdfViewButton = wrapper
          .findAllComponents({ name: "FzIconButton" })
          .find((b) => b.props("iconName") === "file-pdf");
        expect(pdfViewButton).toBeUndefined();
      });
    });

    describe("advanced toolbar", () => {
      const advancedStubs = {
        FzIconButton: mockFzIconButton,
        FzTabs: mockFzTabs,
        FzTab: mockFzTab,
      };
      const XML_SRC = "https://example.com/test.xml";

      it("should render 5 icon buttons (nav + zoom + download) without rotatable", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
          },
          global: { stubs: advancedStubs },
        });
        expect(
          wrapper.findAllComponents({ name: "FzIconButton" }),
        ).toHaveLength(5);
      });

      it("should render 6 icon buttons (nav + zoom + download + rotate) when rotatable", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
            rotatable: true,
          },
          global: { stubs: advancedStubs },
        });
        expect(
          wrapper.findAllComponents({ name: "FzIconButton" }),
        ).toHaveLength(6);
      });

      it("should not render FzTabs without xmlSrc", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
          },
          global: { stubs: advancedStubs },
        });
        expect(wrapper.findComponent({ name: "FzTabs" }).exists()).toBe(false);
      });

      it("should render FzTabs when xmlSrc is provided", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
            xmlSrc: XML_SRC,
          },
          global: { stubs: advancedStubs },
        });
        expect(wrapper.findComponent({ name: "FzTabs" }).exists()).toBe(true);
      });

      it("should render FzTab children with pdf and xml titles when xmlSrc is provided", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
            xmlSrc: XML_SRC,
          },
          global: { stubs: advancedStubs },
        });
        const tabs = wrapper.findAllComponents({ name: "FzTab" });
        expect(tabs.find((t) => t.props("title") === "pdf")).toBeDefined();
        expect(tabs.find((t) => t.props("title") === "xml")).toBeDefined();
      });

      it("should render download button", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
          },
          global: { stubs: advancedStubs },
        });
        const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
        expect(
          buttons.find((b) => b.attributes("aria-label") === "Download"),
        ).toBeDefined();
      });

      it("should not render rotate button when rotatable is false", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
          },
          global: { stubs: advancedStubs },
        });
        const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
        expect(
          buttons.find((b) => b.attributes("aria-label") === "Rotate"),
        ).toBeUndefined();
      });

      it("should render rotate button when rotatable is true", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
            rotatable: true,
          },
          global: { stubs: advancedStubs },
        });
        const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
        expect(
          buttons.find((b) => b.attributes("aria-label") === "Rotate"),
        ).toBeDefined();
      });

      it("should default viewMode to pdf (pdf FzTab has initialSelected)", () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
            xmlSrc: XML_SRC,
          },
          global: { stubs: advancedStubs },
        });
        const tabs = wrapper.findAllComponents({ name: "FzTab" });
        const pdfTab = tabs.find((t) => t.props("title") === "pdf");
        const xmlTab = tabs.find((t) => t.props("title") === "xml");
        expect(pdfTab?.props("initialSelected")).toBe(true);
        expect(xmlTab?.props("initialSelected")).toBe(false);
      });

      it("should emit update:viewMode when FzTabs emits change with xml", async () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
            xmlSrc: XML_SRC,
          },
          global: { stubs: advancedStubs },
        });
        const tabs = wrapper.findComponent({ name: "FzTabs" });
        await tabs.vm.$emit("change", "xml");
        await nextTick();
        expect(wrapper.emitted("update:viewMode")).toBeDefined();
        expect(wrapper.emitted("update:viewMode")![0]).toEqual(["xml"]);
      });

      it("should emit update:viewMode with pdf when switching back", async () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
            xmlSrc: XML_SRC,
          },
          global: { stubs: advancedStubs },
        });
        const tabs = wrapper.findComponent({ name: "FzTabs" });
        await tabs.vm.$emit("change", "xml");
        await tabs.vm.$emit("change", "pdf");
        await nextTick();
        const emitted = wrapper.emitted("update:viewMode")!;
        expect(emitted[emitted.length - 1]).toEqual(["pdf"]);
      });

      it("should emit download event when download button is clicked", async () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
          },
          global: { stubs: advancedStubs },
        });
        const downloadBtn = wrapper
          .findAllComponents({ name: "FzIconButton" })
          .find((b) => b.attributes("aria-label") === "Download");
        await downloadBtn!.trigger("click");
        expect(wrapper.emitted("download")).toHaveLength(1);
      });

      it("should rotate PDF when rotate button is clicked", async () => {
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/test.pdf",
            toolbarVariant: "advanced",
            rotatable: true,
            xmlSrc: XML_SRC,
          },
          global: { stubs: advancedStubs },
        });
        const vuePdf = wrapper.findComponent({ name: "VuePDF" });
        expect(vuePdf.props("rotation")).toBe(0);

        const rotateBtn = wrapper
          .findAllComponents({ name: "FzIconButton" })
          .find((b) => b.attributes("aria-label") === "Rotate");
        await rotateBtn!.trigger("click");
        await nextTick();
        expect(vuePdf.props("rotation")).toBe(90);

        await rotateBtn!.trigger("click");
        await nextTick();
        expect(vuePdf.props("rotation")).toBe(180);
      });

      describe("XML mode (viewMode = xml)", () => {
        it("should render iframe with xmlSrc when viewMode is xml", async () => {
          wrapper = mount(FzPdfViewer, {
            props: {
              src: "https://example.com/test.pdf",
              toolbarVariant: "advanced",
              xmlSrc: XML_SRC,
              viewMode: "xml",
            },
            global: { stubs: advancedStubs },
          });
          await nextTick();
          const iframe = wrapper.find("iframe");
          expect(iframe.exists()).toBe(true);
          expect(iframe.attributes("src")).toBe(XML_SRC);
        });

        it("should hide VuePDF when viewMode is xml", async () => {
          wrapper = mount(FzPdfViewer, {
            props: {
              src: "https://example.com/test.pdf",
              toolbarVariant: "advanced",
              xmlSrc: XML_SRC,
              viewMode: "xml",
            },
            global: { stubs: advancedStubs },
          });
          await nextTick();
          expect(wrapper.find('[data-testid="vue-pdf"]').exists()).toBe(false);
        });

        it("should hide zoom and page controls when viewMode is xml", async () => {
          wrapper = mount(FzPdfViewer, {
            props: {
              src: "https://example.com/test.pdf",
              toolbarVariant: "advanced",
              xmlSrc: XML_SRC,
              viewMode: "xml",
            },
            global: { stubs: advancedStubs },
          });
          await nextTick();
          expect(wrapper.find('[data-testid="pdf-scale"]').exists()).toBe(false);
          expect(wrapper.find('[data-testid="pdf-page"]').exists()).toBe(false);
          const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
          // Only download button remains
          expect(buttons).toHaveLength(1);
          expect(buttons[0].attributes("aria-label")).toBe("Download");
        });

        it("should keep download button visible when viewMode is xml", async () => {
          wrapper = mount(FzPdfViewer, {
            props: {
              src: "https://example.com/test.pdf",
              toolbarVariant: "advanced",
              xmlSrc: XML_SRC,
              viewMode: "xml",
            },
            global: { stubs: advancedStubs },
          });
          await nextTick();
          const downloadBtn = wrapper
            .findAllComponents({ name: "FzIconButton" })
            .find((b) => b.attributes("aria-label") === "Download");
          expect(downloadBtn).toBeDefined();
        });

        it("should show VuePDF and controls when switching back to pdf", async () => {
          wrapper = mount(FzPdfViewer, {
            props: {
              src: "https://example.com/test.pdf",
              toolbarVariant: "advanced",
              xmlSrc: XML_SRC,
              viewMode: "xml",
            },
            global: { stubs: advancedStubs },
          });
          await nextTick();
          await wrapper.setProps({ viewMode: "pdf" });
          await nextTick();
          expect(wrapper.find('[data-testid="vue-pdf"]').exists()).toBe(true);
          expect(wrapper.find("iframe").exists()).toBe(false);
          expect(wrapper.find('[data-testid="pdf-scale"]').exists()).toBe(true);
        });
      });

      it("should hide navigation in advanced toolbar for single-page PDFs", () => {
        mockUsePDF.mockReturnValueOnce({
          pdf: ref({ numPages: 1, getPage: vi.fn() }),
          pages: ref(1),
        });
        wrapper = mount(FzPdfViewer, {
          props: {
            src: "https://example.com/single.pdf",
            toolbarVariant: "advanced",
          },
          global: { stubs: advancedStubs },
        });
        // minus, plus, download = 3 (no nav buttons, no rotate)
        expect(
          wrapper.findAllComponents({ name: "FzIconButton" }),
        ).toHaveLength(3);
        expect(wrapper.find('[data-testid="pdf-page"]').exists()).toBe(false);
      });
    });
  });

  // ============================================
  // TOOLBAR POSITION TESTS
  // ============================================
  describe("Toolbar Position", () => {
    it("should apply flex-col by default (bottom position)", () => {
      wrapper = mount(FzPdfViewer, {
        props: { src: "https://example.com/test.pdf" },
        global: { stubs: { FzIconButton: mockFzIconButton } },
      });
      const container = wrapper.find("div");
      expect(container.classes()).toContain("flex-col");
      expect(container.classes()).not.toContain("flex-col-reverse");
    });

    it("should apply flex-col-reverse when toolbarPosition is top", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          toolbarPosition: "top",
        },
        global: { stubs: { FzIconButton: mockFzIconButton } },
      });
      const container = wrapper.find("div");
      expect(container.classes()).toContain("flex-col-reverse");
      expect(container.classes()).not.toContain("flex-col");
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - small size", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          environment: "frontoffice",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - custom dimensions", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          height: "600px",
          width: "800px",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - page 3", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialPage: 3,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - scale 150%", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          initialScale: 1.5,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with custom classes", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          containerClass: "custom-container",
          pdfContainerClass: "custom-pdf-container",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - advanced toolbar without xmlSrc", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          toolbarVariant: "advanced",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
            FzTabs: mockFzTabs,
            FzTab: mockFzTab,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - advanced toolbar with xmlSrc in pdf mode", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          toolbarVariant: "advanced",
          xmlSrc: "https://example.com/test.xml",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
            FzTabs: mockFzTabs,
            FzTab: mockFzTab,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - advanced toolbar with xmlSrc in xml mode", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          toolbarVariant: "advanced",
          xmlSrc: "https://example.com/test.xml",
          viewMode: "xml",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
            FzTabs: mockFzTabs,
            FzTab: mockFzTab,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - toolbar at top", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          toolbarPosition: "top",
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - selectable enabled", () => {
      wrapper = mount(FzPdfViewer, {
        props: {
          src: "https://example.com/test.pdf",
          selectable: true,
        },
        global: {
          stubs: {
            FzIconButton: mockFzIconButton,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe("selectable prop", () => {
    it("should default selectable to false", () => {
      wrapper = mount(FzPdfViewer, {
        props: { src: "https://example.com/test.pdf" },
        global: { stubs: { FzIconButton: mockFzIconButton } },
      });
      expect(wrapper.props("selectable")).toBe(false);
    });

    it("should pass selectable=true to VuePDF", () => {
      wrapper = mount(FzPdfViewer, {
        props: { src: "https://example.com/test.pdf", selectable: true },
        global: { stubs: { FzIconButton: mockFzIconButton } },
      });
      const vuePdf = wrapper.findComponent({ name: "VuePDF" });
      expect(vuePdf.props("textLayer")).toBe(true);
    });

    it("should pass selectable=false to VuePDF by default", () => {
      wrapper = mount(FzPdfViewer, {
        props: { src: "https://example.com/test.pdf" },
        global: { stubs: { FzIconButton: mockFzIconButton } },
      });
      const vuePdf = wrapper.findComponent({ name: "VuePDF" });
      expect(vuePdf.props("textLayer")).toBe(false);
    });
  });

  describe("drag vs text selection interaction", () => {
    it("should not initiate drag when clicking inside a .textLayer element", async () => {
      wrapper = mount(FzPdfViewer, {
        props: { src: "https://example.com/test.pdf", selectable: true },
        global: { stubs: { FzIconButton: mockFzIconButton } },
        attachTo: document.body,
      });

      const overflowEl = wrapper.find(".overflow-auto").element;

      const selectableEl = document.createElement("div");
      selectableEl.className = "textLayer";
      overflowEl.appendChild(selectableEl);

      let wasScrolled = false;
      Object.defineProperty(overflowEl, "scrollLeft", {
        set() {
          wasScrolled = true;
        },
        get() {
          return 0;
        },
        configurable: true,
      });

      selectableEl.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
      overflowEl.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));

      expect(wasScrolled).toBe(false);
    });

    it("should initiate drag when clicking directly on the container", async () => {
      wrapper = mount(FzPdfViewer, {
        props: { src: "https://example.com/test.pdf", selectable: true },
        global: { stubs: { FzIconButton: mockFzIconButton } },
        attachTo: document.body,
      });

      const overflowEl = wrapper.find(".overflow-auto").element;

      let wasScrolled = false;
      Object.defineProperty(overflowEl, "scrollLeft", {
        set() {
          wasScrolled = true;
        },
        get() {
          return 0;
        },
        configurable: true,
      });

      overflowEl.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, target: overflowEl }),
      );
      overflowEl.dispatchEvent(
        new MouseEvent("mousemove", { bubbles: true, clientX: 50 }),
      );

      expect(wasScrolled).toBe(true);
    });
  });
});
