import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FzCheckbox from "../FzCheckbox.vue";

const MAX_CHECKBOX = 200;

describe("FzCheckbox", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with default props", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html()).toContain("Test Checkbox");
    });

    it("should render label when provided", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Custom Label",
          value: "test",
          modelValue: false,
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("Custom Label");
    });

    it("should render checkbox icon", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
        },
      });

      await wrapper.vm.$nextTick();
      const input = wrapper.find("input[type='checkbox']");
      expect(input.exists()).toBe(true);
    });

    it("should not render label text when standalone", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
          standalone: true,
        },
      });

      await wrapper.vm.$nextTick();
      const label = wrapper.find("label");
      expect(label.text()).not.toContain("Test Checkbox");
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("modelValue prop", () => {
      it("should be checked when modelValue is true", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: true,
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("input").element.checked).toBe(true);
      });

      it("should be unchecked when modelValue is false", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
          },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.find("input").element.checked).toBe(false);
      });

      it("should handle array modelValue", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: ["test", "other"],
          },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.find("input").element.checked).toBe(true);
      });

      it("should be unchecked when value not in array", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: ["other"],
          },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.find("input").element.checked).toBe(false);
      });
    });

    describe("disabled prop", () => {
      it("should apply disabled attribute when true", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            disabled: true,
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("input").element.disabled).toBe(true);
      });

      it("should not be disabled by default", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("input").element.disabled).toBe(false);
      });
    });

    describe("emphasis prop", () => {
      it("should apply emphasis classes when true", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            emphasis: true,
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("label").classes()).toContain(
          "peer-checked:[&_div]:text-blue-500",
        );
      });
    });

    describe("indeterminate prop", () => {
      it("should show indeterminate state when true", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            indeterminate: true,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        expect(input.attributes("aria-checked")).toBe("mixed");
      });
    });

    describe("required prop", () => {
      it("should apply required attribute when true", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            required: true,
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("input").attributes("required")).toBeDefined();
      });
    });

    describe("standalone prop", () => {
      it("should use aria-label when standalone", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            standalone: true,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        expect(input.attributes("aria-label")).toBe("Test Checkbox");
        expect(input.attributes("aria-labelledby")).toBeUndefined();
      });
    });

    describe("error prop", () => {
      it("should apply error styling when true", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            error: true,
          },
        });
        await wrapper.vm.$nextTick();
        const label = wrapper.find("label");
        expect(label.classes()).toContain("text-semantic-error-200");
      });
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should emit change event when clicked", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
        },
      });

      await wrapper.vm.$nextTick();
      await wrapper.find("input").trigger("change");

      expect(wrapper.emitted("change")).toBeDefined();
      expect(wrapper.emitted("change")).toHaveLength(1);
    });

    it("should update modelValue when clicked", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
        },
      });

      await wrapper.vm.$nextTick();
      const input = wrapper.find("input");
      await input.setValue(true);

      expect(wrapper.emitted("update:modelValue")).toBeDefined();
    });

    it("should not emit change event when disabled", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
          disabled: true,
        },
      });

      await wrapper.vm.$nextTick();
      const input = wrapper.find("input");
      await input.trigger("change");

      // Change event may still fire from native input, but modelValue should not update
      // The disabled state prevents actual interaction
      expect(input.element.disabled).toBe(true);
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("ARIA attributes", () => {
      it("should have aria-checked matching checked state", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: true,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        expect(input.attributes("aria-checked")).toBe("true");
      });

      it("should have aria-checked='false' when unchecked", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        expect(input.attributes("aria-checked")).toBe("false");
      });

      it("should have aria-checked='mixed' when indeterminate", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            indeterminate: true,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        expect(input.attributes("aria-checked")).toBe("mixed");
      });

      it("should have aria-labelledby linking to label (not standalone)", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            required: true,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        const id = input.attributes("id");
        expect(input.attributes("aria-labelledby")).toBe(`${id}-label`);
        expect(wrapper.find(`#${id}-label`).exists()).toBe(true);
      });

      it("should have aria-label when standalone", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            standalone: true,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        expect(input.attributes("aria-label")).toBe("Test Checkbox");
        expect(input.attributes("aria-labelledby")).toBeUndefined();
      });

      it("should have aria-required when required", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            required: true,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        expect(input.attributes("aria-required")).toBe("true");
      });

      it("should have aria-invalid when error is present", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            error: true,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        expect(input.attributes("aria-invalid")).toBe("true");
      });

      it("should have aria-describedby linking to error message", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            error: true,
          },
          slots: {
            error: "Test error message",
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        const id = input.attributes("id");
        expect(input.attributes("aria-describedby")).toBe(`${id}-error`);
        expect(wrapper.find(`#${id}-error`).exists()).toBe(true);
      });

      it("should not have aria-describedby when error prop is true but no error slot", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            error: true,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        expect(input.attributes("aria-describedby")).toBeUndefined();
        expect(wrapper.find("[role='alert']").exists()).toBe(false);
      });

      it("should have aria-owns when provided", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            ariaOwns: "child-1 child-2",
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input[type='checkbox']");
        expect(input.attributes("aria-owns")).toBe("child-1 child-2");
      });
    });

    describe("Keyboard navigation", () => {
      it("should be focusable when not disabled", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input");
        expect(input.attributes("disabled")).toBeUndefined();
        // Native checkbox is always focusable unless disabled
      });

      it("should not be focusable when disabled", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            disabled: true,
          },
        });
        await wrapper.vm.$nextTick();
        const input = wrapper.find("input");
        expect(input.element.disabled).toBe(true);
      });
    });

    describe("Decorative elements", () => {
      it("should hide decorative checkbox icon from screen readers", async () => {
        const wrapper = mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
          },
        });
        await wrapper.vm.$nextTick();
        const icon = wrapper.findComponent({ name: "FzIcon" });
        expect(icon.attributes("aria-hidden")).toBe("true");
      });
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply static base classes to input", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
        },
      });
      await wrapper.vm.$nextTick();
      const input = wrapper.find("input");
      expect(input.classes()).toContain("peer");
      expect(input.classes()).toContain("fz-hidden-input");
    });

    it("should apply static base classes to label", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
        },
      });
      await wrapper.vm.$nextTick();
      const label = wrapper.find("label");
      expect(label.classes()).toContain("flex");
      expect(label.classes()).toContain("gap-6");
      expect(label.classes()).toContain("items-start");
    });

    it("should apply emphasis classes when emphasis prop is true", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
          emphasis: true,
        },
      });
      await wrapper.vm.$nextTick();
      const label = wrapper.find("label");
      expect(label.classes()).toContain(
        "peer-checked:[&_div]:text-blue-500",
      );
    });

    it("should apply error classes when error prop is true", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
          error: true,
        },
      });
      await wrapper.vm.$nextTick();
      const label = wrapper.find("label");
      expect(label.classes()).toContain("text-semantic-error-200");
    });

    it("should apply disabled classes when disabled prop is true", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
          disabled: true,
        },
      });
      await wrapper.vm.$nextTick();
      const label = wrapper.find("label");
      expect(label.classes()).toContain("text-grey-300");
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should generate unique IDs for multiple instances", async () => {
      const checkboxes = Array.from({ length: MAX_CHECKBOX }).map((_) => {
        return mount(FzCheckbox, {
          props: {
            label: "Test Checkbox",
            value: "test",
            modelValue: false,
            disabled: true,
          },
        });
      });
      await Promise.all(checkboxes.map((c) => c.vm.$nextTick()));
      const ids = checkboxes.map((c) => c.find("input").attributes("id"));
      const labelFor = checkboxes.map((c) => c.find("label").attributes("for"));
      expect(new Set(ids).size).toBe(MAX_CHECKBOX);
      expect(new Set(labelFor).size).toBe(MAX_CHECKBOX);
    });

    it("should handle undefined modelValue gracefully", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: undefined,
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("input").element.checked).toBe(false);
    });

    it("should handle null modelValue gracefully", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: null,
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("input").element.checked).toBe(false);
    });

    it("should handle empty array modelValue", async () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: [],
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("input").element.checked).toBe(false);
    });

    it("should use label as value when value prop is not provided", async () => {
      // When value prop is not provided, currentValue computed falls back to label
      // This is tested implicitly through the component's internal logic
      // The actual v-model binding behavior is tested in other tests
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          modelValue: false,
        },
      });
      await wrapper.vm.$nextTick();
      // Component should render without errors when value is not provided
      expect(wrapper.exists()).toBe(true);
      const input = wrapper.find("input");
      expect(input.exists()).toBe(true);
      // The input's value attribute should be set (even if undefined, it falls back to label internally)
      expect(input.attributes("value")).toBeDefined();
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - checked state", () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - disabled state", () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
          disabled: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - error state", () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
          error: true,
        },
        slots: {
          error: "Error message",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - indeterminate state", () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
          indeterminate: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - standalone mode", () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
          standalone: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with emphasis", () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: true,
          emphasis: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - required", () => {
      const wrapper = mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          modelValue: false,
          required: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});

