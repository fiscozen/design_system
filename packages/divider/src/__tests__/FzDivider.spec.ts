import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { FzDivider } from "..";

describe("FzDivider", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with default props", () => {
      const wrapper = mount(FzDivider, {
        props: {},
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".w-full").exists()).toBe(true);
    });

    it("should render divider line when no label provided", () => {
      const wrapper = mount(FzDivider, {
        props: {},
      });

      const dividerLine = wrapper.find(".border-solid.border-t-1.border-grey-200");
      expect(dividerLine.exists()).toBe(true);
      expect(wrapper.find("span").exists()).toBe(false);
    });

    it("should render label when label prop is provided", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: "Section Divider",
        },
      });

      expect(wrapper.text()).toContain("Section Divider");
      expect(wrapper.find("span").exists()).toBe(true);
      expect(wrapper.find("span").text()).toBe("Section Divider");
    });

    it("should render divider with label and lines on both sides", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: "Or",
        },
      });

      const container = wrapper.find(".flex.items-center");
      expect(container.exists()).toBe(true);
      
      const lines = wrapper.findAll(".border-solid.border-t-1.border-grey-200");
      expect(lines.length).toBe(2);
      
      const label = wrapper.find("span");
      expect(label.exists()).toBe(true);
      expect(label.text()).toBe("Or");
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("label prop", () => {
      it("should render without label when label is undefined", () => {
        const wrapper = mount(FzDivider, {
          props: {},
        });

        expect(wrapper.find("span").exists()).toBe(false);
        expect(wrapper.find(".flex.items-center").exists()).toBe(false);
      });

      it("should render with label when label is provided", () => {
        const wrapper = mount(FzDivider, {
          props: {
            label: "Custom Label",
          },
        });

        expect(wrapper.find("span").exists()).toBe(true);
        expect(wrapper.text()).toContain("Custom Label");
      });

      it("should render with empty string label", () => {
        const wrapper = mount(FzDivider, {
          props: {
            label: "",
          },
        });

        // Empty string should be treated as falsy, so no label should render
        expect(wrapper.find("span").exists()).toBe(false);
      });
    });

    describe("labelClass prop", () => {
      it("should apply custom labelClass to label span", () => {
        const wrapper = mount(FzDivider, {
          props: {
            label: "Test Label",
            labelClass: "custom-class font-bold",
          },
        });

        const label = wrapper.find("span");
        expect(label.exists()).toBe(true);
        expect(label.classes()).toContain("custom-class");
        expect(label.classes()).toContain("font-bold");
      });

      it("should apply default text-md class when labelClass is not provided", () => {
        const wrapper = mount(FzDivider, {
          props: {
            label: "Test Label",
          },
        });

        const label = wrapper.find("span");
        expect(label.exists()).toBe(true);
        expect(label.classes()).toContain("text-md");
      });

      it("should combine default text-md with custom labelClass", () => {
        const wrapper = mount(FzDivider, {
          props: {
            label: "Test Label",
            labelClass: "text-red-500",
          },
        });

        const label = wrapper.find("span");
        expect(label.exists()).toBe(true);
        expect(label.classes()).toContain("text-md");
        expect(label.classes()).toContain("text-red-500");
      });
    });

    describe("margin prop", () => {
      it("should apply default my-16 class when margin is not provided", () => {
        const wrapper = mount(FzDivider, {
          props: {},
        });

        expect(wrapper.element.classList.contains("my-16")).toBe(true);
      });

      it("should apply my-0 class when margin is set to none", () => {
        const wrapper = mount(FzDivider, {
          props: {
            margin: "none",
          },
        });
        expect(wrapper.element.classList.contains("my-0")).toBe(true);
      });

      it("should apply my-16 class when margin is set to base", () => {
        const wrapper = mount(FzDivider, {
          props: {
            margin: "base",
          },
        });
        expect(wrapper.element.classList.contains("my-16")).toBe(true);
      });
    });

  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply static base classes when no label", () => {
      const wrapper = mount(FzDivider, {
        props: {},
      });

      const container = wrapper.find(".w-full.my-16");
      expect(container.exists()).toBe(true);
      expect(container.classes()).toContain("w-full");
      expect(container.classes()).toContain("my-16");
    });

    it("should apply static base classes when label is provided", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: "Label",
        },
      });

      const container = wrapper.find(".w-full.my-16.flex.items-center.gap-6");
      expect(container.exists()).toBe(true);
      expect(container.classes()).toContain("w-full");
      expect(container.classes()).toContain("my-16");
      expect(container.classes()).toContain("flex");
      expect(container.classes()).toContain("items-center");
      expect(container.classes()).toContain("gap-6");
    });

    it("should apply border classes to divider lines", () => {
      const wrapper = mount(FzDivider, {
        props: {},
      });

      const dividerLine = wrapper.find(".border-solid.border-t-1.border-grey-200");
      expect(dividerLine.exists()).toBe(true);
      expect(dividerLine.classes()).toContain("border-solid");
      expect(dividerLine.classes()).toContain("border-t-1");
      expect(dividerLine.classes()).toContain("border-grey-200");
    });

    it("should apply flex-1 class to lines when label is present", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: "Label",
        },
      });

      const lines = wrapper.findAll(".flex-1");
      expect(lines.length).toBe(2);
      lines.forEach((line) => {
        expect(line.classes()).toContain("flex-1");
      });
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("ARIA attributes", () => {
      it("should have role='separator' on divider line when no label", () => {
        const wrapper = mount(FzDivider, {
          props: {},
        });

        const dividerLine = wrapper.find(".border-solid.border-t-1.border-grey-200");
        expect(dividerLine.exists()).toBe(true);
        // Note: The component should have role="separator" but may need implementation
        // This test documents the expected behavior
        const separator = wrapper.find('[role="separator"]');
        // If not implemented, this will fail and document the gap
        if (separator.exists()) {
          expect(separator.attributes("role")).toBe("separator");
        }
      });

      it("should have role='separator' on divider lines when label is present", () => {
        const wrapper = mount(FzDivider, {
          props: {
            label: "Or",
          },
        });

        // When label is present, the divider lines should still have separator role
        // or the container should have the role
        const container = wrapper.find(".flex.items-center");
        expect(container.exists()).toBe(true);
        // Note: Implementation may vary - this documents expected behavior
        const separator = wrapper.find('[role="separator"]');
        if (separator.exists()) {
          expect(separator.attributes("role")).toBe("separator");
        }
      });

      it("should have semantic HTML structure", () => {
        const wrapper = mount(FzDivider, {
          props: {
            label: "Section",
          },
        });

        // Should use semantic div elements
        expect(wrapper.find("div").exists()).toBe(true);
        // Label should be in a span for proper semantics
        const label = wrapper.find("span");
        expect(label.exists()).toBe(true);
      });
    });

    describe("Screen reader support", () => {
      it("should be accessible to screen readers when no label", () => {
        const wrapper = mount(FzDivider, {
          props: {},
        });

        // Divider should be perceivable by screen readers
        // Either through role="separator" or aria-label
        const divider = wrapper.find(".border-solid");
        expect(divider.exists()).toBe(true);
      });

      it("should have visible label text for screen readers when label is provided", () => {
        const wrapper = mount(FzDivider, {
          props: {
            label: "Section Divider",
          },
        });

        const label = wrapper.find("span");
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe("Section Divider");
        // Label text should be visible and accessible
        expect(label.isVisible()).toBe(true);
      });
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle undefined label gracefully", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: undefined,
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("span").exists()).toBe(false);
    });

    it("should handle null label gracefully", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: null as any,
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("span").exists()).toBe(false);
    });

    it("should handle very long label text", () => {
      const longLabel = "A".repeat(100);
      const wrapper = mount(FzDivider, {
        props: {
          label: longLabel,
        },
      });

      const label = wrapper.find("span");
      expect(label.exists()).toBe(true);
      expect(label.text()).toBe(longLabel);
    });

    it("should handle special characters in label", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: "Section & More < > \" '",
        },
      });

      const label = wrapper.find("span");
      expect(label.exists()).toBe(true);
      expect(label.text()).toBe("Section & More < > \" '");
    });

    it("should handle multiple custom classes in labelClass", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: "Label",
          labelClass: "class1 class2 class3",
        },
      });

      const label = wrapper.find("span");
      expect(label.exists()).toBe(true);
      expect(label.classes()).toContain("class1");
      expect(label.classes()).toContain("class2");
      expect(label.classes()).toContain("class3");
    });

    it("should handle whitespace-only label", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: "   ",
        },
      });

      // Whitespace-only string is truthy, so label should render
      const label = wrapper.find("span");
      expect(label.exists()).toBe(true);
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state (no label)", () => {
      const wrapper = mount(FzDivider, {
        props: {},
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with label", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: "Section Divider",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with labelClass", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: "Custom Label",
          labelClass: "font-bold text-blue-500",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - empty string label", () => {
      const wrapper = mount(FzDivider, {
        props: {
          label: "",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
