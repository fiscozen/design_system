import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { FzBadge } from "..";

describe("FzBadge", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with default props", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "Badge",
        },
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain("Badge");
    });

    it("should render slot content", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "Custom Content",
        },
      });

      expect(wrapper.text()).toContain("Custom Content");
    });

    it("should render numeric content", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "5",
        },
      });

      expect(wrapper.text()).toContain("5");
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("color prop", () => {
      it.each([
        ["black", "bg-core-black"],
        ["error", "bg-semantic-error"],
        ["warning", "bg-semantic-warning"],
        ["success", "bg-semantic-success"],
        ["info", "bg-semantic-info"],
        ["blue", "bg-blue-500"],
        ["light", "bg-grey-100"],
        ["dark", "bg-grey-500"],
      ])("should apply %s color classes", (color, expectedClass) => {
        const wrapper = mount(FzBadge, {
          props: {
            color: color as any,
            size: "md",
          },
          slots: {
            default: "Badge",
          },
        });

        expect(wrapper.classes()).toContain(expectedClass);
      });

      it("should default to black color", () => {
        const wrapper = mount(FzBadge, {
          props: {
            color: "black",
            size: "md",
          },
          slots: {
            default: "Badge",
          },
        });

        expect(wrapper.classes()).toContain("bg-core-black");
      });
    });

    describe("size prop", () => {
      it.each([
        ["sm", "text-xs", "px-8", "size-20"],
        ["md", "text-sm", "px-12", "size-24"],
        ["lg", "text-base", "px-14", "size-28"],
      ])("should apply %s size classes", (size, textClass, pxClass, sizeClass) => {
        const wrapper = mount(FzBadge, {
          props: {
            color: "black",
            size: size as any,
          },
          slots: {
            default: "Badge",
          },
        });

        expect(wrapper.classes()).toContain(textClass);
        expect(wrapper.classes()).toContain(pxClass);
        expect(wrapper.classes()).toContain(sizeClass);
      });

      it("should default to md size", () => {
        const wrapper = mount(FzBadge, {
          props: {
            color: "black",
            size: "md",
          },
          slots: {
            default: "Badge",
          },
        });

        expect(wrapper.classes()).toContain("text-sm");
        expect(wrapper.classes()).toContain("px-12");
        expect(wrapper.classes()).toContain("size-24");
      });
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply static base classes", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "Badge",
        },
      });

      expect(wrapper.classes()).toContain("flex");
      expect(wrapper.classes()).toContain("items-center");
      expect(wrapper.classes()).toContain("justify-center");
      expect(wrapper.classes()).toContain("font-medium");
    });

    it("should have rounded-full class when default slot is a string with 1 character", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "1",
        },
      });

      expect(wrapper.classes()).toContain("rounded-full");
      expect(wrapper.classes()).toContain("!px-0");
    });

    it("should not have rounded-full class when default slot is a string with more than 1 character", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "Fiscozen",
        },
      });

      expect(wrapper.classes()).not.toContain("rounded-full");
      expect(wrapper.classes()).toContain("rounded-2xl");
      expect(wrapper.classes()).toContain("!w-fit");
    });

    it("should apply rounded-2xl for multi-character content", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "Badge Text",
        },
      });

      expect(wrapper.classes()).toContain("rounded-2xl");
      expect(wrapper.classes()).toContain("!w-fit");
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("ARIA attributes", () => {
      it("should support aria-label for status indication", () => {
        const wrapper = mount(FzBadge, {
          props: {
            color: "black",
            size: "md",
          },
          attrs: {
            "aria-label": "Status: Active",
          },
          slots: {
            default: "Active",
          },
        });

        expect(wrapper.attributes("aria-label")).toBe("Status: Active");
      });

      it("should support role attribute when provided", () => {
        const wrapper = mount(FzBadge, {
          props: {
            color: "black",
            size: "md",
          },
          attrs: {
            role: "status",
          },
          slots: {
            default: "New",
          },
        });

        expect(wrapper.attributes("role")).toBe("status");
      });

      it("should be accessible without aria-label when content is descriptive", () => {
        const wrapper = mount(FzBadge, {
          props: {
            color: "black",
            size: "md",
          },
          slots: {
            default: "Active",
          },
        });

        // Badge content should be readable by screen readers
        expect(wrapper.text()).toBe("Active");
      });
    });

    describe("Semantic HTML", () => {
      it("should render as a div element", () => {
        const wrapper = mount(FzBadge, {
          props: {
            color: "black",
            size: "md",
          },
          slots: {
            default: "Badge",
          },
        });

        expect(wrapper.element.tagName).toBe("DIV");
      });

      it("should have visible text content for screen readers", () => {
        const wrapper = mount(FzBadge, {
          props: {
            color: "black",
            size: "md",
          },
          slots: {
            default: "5",
          },
        });

        expect(wrapper.text()).toBe("5");
        expect(wrapper.text().trim()).not.toBe("");
      });
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle very long text content", () => {
      const longText = "A".repeat(100);
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: longText,
        },
      });

      expect(wrapper.text()).toContain(longText);
      expect(wrapper.classes()).toContain("rounded-2xl");
    });

    it("should handle single character correctly", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "X",
        },
      });

      expect(wrapper.classes()).toContain("rounded-full");
      expect(wrapper.classes()).toContain("!px-0");
    });

    it("should handle numeric single digit", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "9",
        },
      });

      expect(wrapper.classes()).toContain("rounded-full");
    });

    it("should handle two character content", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "99",
        },
      });

      expect(wrapper.classes()).toContain("rounded-2xl");
      expect(wrapper.classes()).not.toContain("rounded-full");
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "Badge",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - black color", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "Fiscozen",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - error color", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "error",
          size: "md",
        },
        slots: {
          default: "Fiscozen",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - warning color", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "warning",
          size: "md",
        },
        slots: {
          default: "Fiscozen",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - success color", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "success",
          size: "md",
        },
        slots: {
          default: "Fiscozen",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - info color", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "info",
          size: "md",
        },
        slots: {
          default: "Fiscozen",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - single character", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "md",
        },
        slots: {
          default: "1",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - small size", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "sm",
        },
        slots: {
          default: "Badge",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - large size", () => {
      const wrapper = mount(FzBadge, {
        props: {
          color: "black",
          size: "lg",
        },
        slots: {
          default: "Badge",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
