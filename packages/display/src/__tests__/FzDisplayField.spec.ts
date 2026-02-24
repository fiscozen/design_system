import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FzDisplayField from "../FzDisplayField.vue";

const defaultProps = {
  label: "Label",
  value: "Value",
};

describe("FzDisplayField", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with required props", () => {
      const wrapper = mount(FzDisplayField, {
        props: defaultProps,
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should render the label text", () => {
      const wrapper = mount(FzDisplayField, {
        props: { label: "Email Address", value: "john@example.com" },
      });

      expect(wrapper.text()).toContain("Email Address");
    });

    it("should render the value text", () => {
      const wrapper = mount(FzDisplayField, {
        props: { label: "Email Address", value: "john@example.com" },
      });

      expect(wrapper.text()).toContain("john@example.com");
    });

    it("should render label and value as separate span elements", () => {
      const wrapper = mount(FzDisplayField, {
        props: defaultProps,
      });

      const spans = wrapper.findAll("span");
      expect(spans).toHaveLength(2);
      expect(spans[0].text()).toBe("Label");
      expect(spans[1].text()).toBe("Value");
    });

    it("should render the root container with data-testid", () => {
      const wrapper = mount(FzDisplayField, {
        props: defaultProps,
      });

      expect(wrapper.find('[data-testid="fz-display-field"]').exists()).toBe(
        true,
      );
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("label prop", () => {
      it("should display the provided label", () => {
        const wrapper = mount(FzDisplayField, {
          props: { label: "Full Name", value: "John Doe" },
        });

        const labelSpan = wrapper.findAll("span")[0];
        expect(labelSpan.text()).toBe("Full Name");
      });
    });

    describe("value prop", () => {
      it("should display the provided value", () => {
        const wrapper = mount(FzDisplayField, {
          props: { label: "Full Name", value: "John Doe" },
        });

        const valueSpan = wrapper.findAll("span")[1];
        expect(valueSpan.text()).toBe("John Doe");
      });
    });

    describe("size prop", () => {
      it("should default to normal size (text-sm on label)", () => {
        const wrapper = mount(FzDisplayField, {
          props: defaultProps,
        });

        const labelSpan = wrapper.findAll("span")[0];
        expect(labelSpan.classes()).toContain("text-sm");
      });

      it("should apply text-xs on label when size is small", () => {
        const wrapper = mount(FzDisplayField, {
          props: { ...defaultProps, size: "small" as const },
        });

        const labelSpan = wrapper.findAll("span")[0];
        expect(labelSpan.classes()).toContain("text-xs");
      });

      it("should apply text-sm on label when size is normal", () => {
        const wrapper = mount(FzDisplayField, {
          props: { ...defaultProps, size: "normal" as const },
        });

        const labelSpan = wrapper.findAll("span")[0];
        expect(labelSpan.classes()).toContain("text-sm");
      });
    });

    describe("isEmphasized prop", () => {
      it("should default to non-emphasized (font-normal on value)", () => {
        const wrapper = mount(FzDisplayField, {
          props: defaultProps,
        });

        const valueSpan = wrapper.findAll("span")[1];
        expect(valueSpan.classes()).toContain("font-normal");
      });

      it("should apply font-semibold on value when emphasized", () => {
        const wrapper = mount(FzDisplayField, {
          props: { ...defaultProps, isEmphasized: true },
        });

        const valueSpan = wrapper.findAll("span")[1];
        expect(valueSpan.classes()).toContain("font-semibold");
      });

      it("should apply font-normal on value when not emphasized", () => {
        const wrapper = mount(FzDisplayField, {
          props: { ...defaultProps, isEmphasized: false },
        });

        const valueSpan = wrapper.findAll("span")[1];
        expect(valueSpan.classes()).toContain("font-normal");
      });
    });

    describe("gap prop", () => {
      it("should default to no gap (gap-0)", () => {
        const wrapper = mount(FzDisplayField, {
          props: defaultProps,
        });

        const root = wrapper.find('[data-testid="fz-display-field"]');
        expect(root.classes()).toContain("gap-0");
      });

      it("should apply gap-0 when gap is none", () => {
        const wrapper = mount(FzDisplayField, {
          props: { ...defaultProps, gap: "none" as const },
        });

        const root = wrapper.find('[data-testid="fz-display-field"]');
        expect(root.classes()).toContain("gap-0");
      });

      it("should apply gap-8 when gap is small", () => {
        const wrapper = mount(FzDisplayField, {
          props: { ...defaultProps, gap: "small" as const },
        });

        const root = wrapper.find('[data-testid="fz-display-field"]');
        expect(root.classes()).toContain("gap-8");
      });

      it("should apply gap-12 when gap is medium", () => {
        const wrapper = mount(FzDisplayField, {
          props: { ...defaultProps, gap: "medium" as const },
        });

        const root = wrapper.find('[data-testid="fz-display-field"]');
        expect(root.classes()).toContain("gap-12");
      });
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("Semantic structure", () => {
      it("should render as a div container with flex-col layout", () => {
        const wrapper = mount(FzDisplayField, {
          props: defaultProps,
        });

        const root = wrapper.find('[data-testid="fz-display-field"]');
        expect(root.element.tagName).toBe("DIV");
        expect(root.classes()).toContain("flex");
        expect(root.classes()).toContain("flex-col");
      });

      it("should render label before value in DOM order", () => {
        const wrapper = mount(FzDisplayField, {
          props: { label: "Name", value: "Alice" },
        });

        const spans = wrapper.findAll("span");
        expect(spans[0].text()).toBe("Name");
        expect(spans[1].text()).toBe("Alice");
      });
    });

    describe("Text content for screen readers", () => {
      it("should have visible label text accessible to screen readers", () => {
        const wrapper = mount(FzDisplayField, {
          props: { label: "Fiscal Code", value: "ABC123" },
        });

        const labelSpan = wrapper.findAll("span")[0];
        expect(labelSpan.text()).toBe("Fiscal Code");
        expect(labelSpan.text().trim()).not.toBe("");
      });

      it("should have visible value text accessible to screen readers", () => {
        const wrapper = mount(FzDisplayField, {
          props: { label: "Fiscal Code", value: "ABC123" },
        });

        const valueSpan = wrapper.findAll("span")[1];
        expect(valueSpan.text()).toBe("ABC123");
        expect(valueSpan.text().trim()).not.toBe("");
      });
    });

    describe("ARIA attributes passthrough", () => {
      it("should support aria-label when provided via attrs", () => {
        const wrapper = mount(FzDisplayField, {
          props: defaultProps,
          attrs: {
            "aria-label": "Display field: Label - Value",
          },
        });

        expect(wrapper.attributes("aria-label")).toBe(
          "Display field: Label - Value",
        );
      });

      it("should support role attribute when provided via attrs", () => {
        const wrapper = mount(FzDisplayField, {
          props: defaultProps,
          attrs: {
            role: "group",
          },
        });

        expect(wrapper.attributes("role")).toBe("group");
      });
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle empty string label", () => {
      const wrapper = mount(FzDisplayField, {
        props: { label: "", value: "Some value" },
      });

      const labelSpan = wrapper.findAll("span")[0];
      expect(labelSpan.text()).toBe("");
    });

    it("should handle empty string value", () => {
      const wrapper = mount(FzDisplayField, {
        props: { label: "Some label", value: "" },
      });

      const valueSpan = wrapper.findAll("span")[1];
      expect(valueSpan.text()).toBe("");
    });

    it("should handle very long label text", () => {
      const longLabel = "A".repeat(200);
      const wrapper = mount(FzDisplayField, {
        props: { label: longLabel, value: "Value" },
      });

      expect(wrapper.text()).toContain(longLabel);
    });

    it("should handle very long value text", () => {
      const longValue = "B".repeat(200);
      const wrapper = mount(FzDisplayField, {
        props: { label: "Label", value: longValue },
      });

      expect(wrapper.text()).toContain(longValue);
    });

    it("should handle special characters in label and value", () => {
      const wrapper = mount(FzDisplayField, {
        props: {
          label: "Price (€)",
          value: "1.234,56 €/anno",
        },
      });

      expect(wrapper.text()).toContain("Price (€)");
      expect(wrapper.text()).toContain("1.234,56 €/anno");
    });

    it("should render multiple instances independently", () => {
      const wrapper1 = mount(FzDisplayField, {
        props: { label: "Name", value: "Alice" },
      });
      const wrapper2 = mount(FzDisplayField, {
        props: { label: "Email", value: "alice@example.com" },
      });

      expect(wrapper1.text()).toContain("Alice");
      expect(wrapper1.text()).not.toContain("alice@example.com");
      expect(wrapper2.text()).toContain("alice@example.com");
      expect(wrapper2.text()).not.toContain("Alice");
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", () => {
      const wrapper = mount(FzDisplayField, {
        props: defaultProps,
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - small size", () => {
      const wrapper = mount(FzDisplayField, {
        props: { ...defaultProps, size: "small" as const },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - emphasized value", () => {
      const wrapper = mount(FzDisplayField, {
        props: { ...defaultProps, isEmphasized: true },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - small gap", () => {
      const wrapper = mount(FzDisplayField, {
        props: { ...defaultProps, gap: "small" as const },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - medium gap", () => {
      const wrapper = mount(FzDisplayField, {
        props: { ...defaultProps, gap: "medium" as const },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - all props combined", () => {
      const wrapper = mount(FzDisplayField, {
        props: {
          label: "Total Amount",
          value: "€ 1.234,56",
          size: "small" as const,
          isEmphasized: true,
          gap: "medium" as const,
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
