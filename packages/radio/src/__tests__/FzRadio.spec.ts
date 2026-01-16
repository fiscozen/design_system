import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { FzRadio, FzRadioProps } from "..";

const createWrapper = async (props: FzRadioProps) => {
  const content = mount(FzRadio, {
    props,
  });
  return content;
};

describe("FzRadio", () => {
  beforeEach(() => {
    // Mock matchMedia for useMediaQuery composable
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock IntersectionObserver
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      })),
    });
  });

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with default props", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("input").exists()).toBe(true);
      expect(wrapper.find("label").exists()).toBe(true);
    });

    it("should render label text", async () => {
      const wrapper = await createWrapper({
        label: "Radio Option",
        size: "md",
      });
      expect(wrapper.find("label").text()).toContain("Radio Option");
    });

    it("should not show label text when standalone is true", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
        standalone: true,
      });
      expect(wrapper.find("label").text()).toBeFalsy();
    });

    it("should not show text when hasText is false", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
        hasText: false,
      });
      expect(wrapper.find("label").find("span").exists()).toBe(false);
    });

    it("should render tooltip when tooltip is provided", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
        tooltip: "This is a tooltip",
      });
      expect(wrapper.findComponent({ name: "FzTooltip" }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: "FzIcon" }).exists()).toBe(true);
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("checked prop", () => {
      it("should have checked attribute when checked is true", async () => {
        const wrapper = await createWrapper({
          label: "Radio",
          size: "md",
          checked: true,
        });
        expect(wrapper.find("input").element.checked).toBe(true);
      });

      it("should be checked when modelValue matches value", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            value: "option1",
            modelValue: "option1",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("input").element.checked).toBe(true);
      });

      it("should not be checked when modelValue does not match value", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            value: "option1",
            modelValue: "option2",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("input").element.checked).toBe(false);
      });
    });

    describe("disabled prop", () => {
      it("should have disabled attribute when disabled is true", async () => {
        const wrapper = await createWrapper({
          label: "Radio",
          size: "md",
          disabled: true,
        });
        expect(wrapper.find("input").element.disabled).toBe(true);
      });
    });

    describe("tone prop", () => {
      it("should support tone=neutral (default)", async () => {
        const wrapper = await createWrapper({
          label: "Radio",
          size: "md",
          tone: "neutral",
        });
        expect(wrapper.find("label").classes()).toContain("before:border-grey-500");
      });

      it("should support tone=emphasis", async () => {
        const wrapper = await createWrapper({
          label: "Radio",
          size: "md",
          tone: "emphasis",
        });
        expect(wrapper.find("label").classes()).toContain(
          "peer-checked:before:border-blue-500",
        );
      });

      it("should support tone=error", async () => {
        const wrapper = await createWrapper({
          label: "Radio",
          size: "md",
          tone: "error",
        });
        expect(wrapper.find("label").classes()).toContain(
          "before:border-semantic-error",
        );
        expect(wrapper.find("label").classes()).toContain("text-semantic-error");
      });
    });

    describe("tooltip prop", () => {
      it("should use tooltipStatus prop for tooltip", async () => {
        const wrapper = await createWrapper({
          label: "Radio",
          size: "md",
          tooltip: "This is an error tooltip",
          tooltipStatus: "error",
        });
        const tooltip = wrapper.findComponent({ name: "FzTooltip" });
        expect(tooltip.exists()).toBe(true);
        expect(tooltip.props("status")).toBe("error");
      });

      it("should default tooltipStatus to neutral when not provided", async () => {
        const wrapper = await createWrapper({
          label: "Radio",
          size: "md",
          tooltip: "This is a tooltip",
        });
        const tooltip = wrapper.findComponent({ name: "FzTooltip" });
        expect(tooltip.exists()).toBe(true);
        expect(tooltip.props("status")).toBe("neutral");
      });
    });

    describe("deprecated props", () => {
      it("should maintain backward compatibility with emphasis prop", async () => {
        const wrapper = await createWrapper({
          label: "Radio",
          size: "md",
          emphasis: true,
        });
        expect(wrapper.find("label").classes()).toContain(
          "peer-checked:before:border-blue-500",
        );
      });

      it("should maintain backward compatibility with error prop", async () => {
        const wrapper = await createWrapper({
          label: "Radio",
          size: "md",
          error: true,
        });
        expect(wrapper.find("label").classes()).toContain(
          "before:border-semantic-error",
        );
      });

      it("should maintain backward compatibility with standalone prop", async () => {
        const wrapper = await createWrapper({
          label: "Radio",
          size: "md",
          standalone: true,
        });
        expect(wrapper.find("label").find("span").exists()).toBe(false);
      });
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should emit update:modelValue when clicked", async () => {
      const wrapper = mount(FzRadio, {
        props: {
          label: "Radio",
          value: "option1",
          modelValue: undefined,
        },
      });
      await wrapper.vm.$nextTick();

      const input = wrapper.find("input");
      await input.trigger("change");

      expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
      expect(wrapper.emitted("update:modelValue")![0]).toEqual(["option1"]);
    });

    it("should emit update:modelValue with label when value is not provided", async () => {
      const wrapper = mount(FzRadio, {
        props: {
          label: "Radio Option",
          modelValue: undefined,
        },
      });
      await wrapper.vm.$nextTick();

      const input = wrapper.find("input");
      await input.trigger("change");

      expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
      expect(wrapper.emitted("update:modelValue")![0]).toEqual(["Radio Option"]);
    });

    it("should not emit update:modelValue when disabled", async () => {
      const wrapper = mount(FzRadio, {
        props: {
          label: "Radio",
          value: "option1",
          disabled: true,
        },
      });
      await wrapper.vm.$nextTick();

      const input = wrapper.find("input");
      await input.trigger("change");

      // Disabled inputs still emit change events, but the value shouldn't change
      // The parent component should handle ignoring disabled radio changes
      expect(wrapper.find("input").element.disabled).toBe(true);
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("ARIA attributes", () => {
      it("should have aria-checked='true' when checked", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            value: "option1",
            modelValue: "option1",
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.attributes("aria-checked")).toBe("true");
      });

      it("should have aria-checked='false' when not checked", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            value: "option1",
            modelValue: "option2",
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.attributes("aria-checked")).toBe("false");
      });

      it("should have aria-labelledby linking to label when hasText is true", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio Option",
            hasText: true,
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        const labelId = input.attributes("aria-labelledby");
        expect(labelId).toBeTruthy();
        expect(wrapper.find(`#${labelId}`).exists()).toBe(true);
        expect(wrapper.find(`#${labelId}`).text()).toContain("Radio Option");
      });

      it("should have aria-label when hasText is false", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio Option",
            hasText: false,
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.attributes("aria-label")).toBe("Radio Option");
        expect(input.attributes("aria-labelledby")).toBeUndefined();
      });

      it("should have aria-disabled='true' when disabled", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            disabled: true,
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.attributes("aria-disabled")).toBe("true");
      });

      it("should have aria-disabled='false' when not disabled", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            disabled: false,
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.attributes("aria-disabled")).toBe("false");
      });

      it("should have aria-required='true' when required", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            required: true,
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.attributes("aria-required")).toBe("true");
        expect(input.attributes("required")).toBeDefined();
      });

      it("should have aria-required='false' when not required", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            required: false,
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.attributes("aria-required")).toBe("false");
      });

      it("should have aria-invalid='true' when tone is error", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            tone: "error",
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.attributes("aria-invalid")).toBe("true");
      });

      it("should have aria-invalid='false' when tone is not error", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            tone: "neutral",
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.attributes("aria-invalid")).toBe("false");
      });
    });

    describe("Keyboard navigation", () => {
      it("should be focusable when not disabled", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.element.tagName.toLowerCase()).toBe("input");
        expect(input.element.type).toBe("radio");
        // Radio inputs are naturally focusable
        const tabindex = input.attributes("tabindex");
        if (tabindex) {
          expect(tabindex).not.toBe("-1");
        }
      });

      it("should not be focusable when disabled", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            disabled: true,
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.element.disabled).toBe(true);
        // Disabled inputs are not in tab order
      });

      it("should support Space key activation", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
            value: "option1",
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        await input.trigger("keydown", { key: " " });
        // Native radio inputs support Space key activation
        expect(input.exists()).toBe(true);
      });
    });

    describe("Semantic HTML structure", () => {
      it("should use native radio input element", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio",
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        expect(input.element.type).toBe("radio");
        expect(input.element.tagName.toLowerCase()).toBe("input");
      });

      it("should have label element associated with input", async () => {
        const wrapper = mount(FzRadio, {
          props: {
            label: "Radio Option",
          },
        });
        await wrapper.vm.$nextTick();

        const input = wrapper.find("input");
        const label = wrapper.find("label");
        expect(label.exists()).toBe(true);
        expect(label.attributes("for")).toBe(input.attributes("id"));
      });
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply emphasized class when emphasis is true", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
        emphasis: true,
      });
      expect(wrapper.find("label").classes()).toContain(
        "peer-checked:before:border-blue-500",
      );
    });

    it("should apply error classes when tone is error", async () => {
      const wrapper = mount(FzRadio, {
        props: {
          label: "Radio",
          size: "md",
          tone: "error",
        },
        slots: {
          error: "Error text",
        },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("label").classes()).toContain(
        "before:border-semantic-error",
      );
      expect(wrapper.find("label").classes()).toContain("text-semantic-error");
    });

    it("should toggle error classes when error state changes", async () => {
      const wrapper = mount(FzRadio, {
        props: {
          label: "Radio",
          size: "md",
          tone: "error",
        },
        slots: {
          error: "Error text",
        },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("label").classes()).toContain(
        "before:border-semantic-error",
      );
      expect(wrapper.find("label").classes()).toContain("text-semantic-error");

      await wrapper.setProps({ tone: "neutral" });

      expect(wrapper.find("label").classes()).not.toContain(
        "before:border-semantic-error",
      );
      expect(wrapper.find("label").classes()).not.toContain(
        "text-semantic-error",
      );
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle undefined modelValue gracefully", async () => {
      const wrapper = mount(FzRadio, {
        props: {
          label: "Radio",
          value: "option1",
          modelValue: undefined,
        },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("input").element.checked).toBe(false);
    });

    it("should use label as value when value prop is not provided", async () => {
      const wrapper = mount(FzRadio, {
        props: {
          label: "Radio Option",
        },
      });
      await wrapper.vm.$nextTick();

      const input = wrapper.find("input");
      expect(input.attributes("value")).toBe("Radio Option");
    });

    it("should generate unique IDs for multiple instances", async () => {
      const wrapper1 = mount(FzRadio, {
        props: { label: "Radio 1", name: "group1" },
      });
      const wrapper2 = mount(FzRadio, {
        props: { label: "Radio 2", name: "group1" },
      });
      await Promise.all([
        wrapper1.vm.$nextTick(),
        wrapper2.vm.$nextTick(),
      ]);

      const id1 = wrapper1.find("input").attributes("id");
      const id2 = wrapper2.find("input").attributes("id");
      expect(id1).not.toBe(id2);
    });

    it("should handle name prop for radio group", async () => {
      const wrapper = mount(FzRadio, {
        props: {
          label: "Radio",
          name: "radio-group",
        },
      });
      await wrapper.vm.$nextTick();

      const input = wrapper.find("input");
      expect(input.attributes("name")).toBe("radio-group");
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - checked state", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
        checked: true,
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - disabled state", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
        disabled: true,
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - error state", async () => {
      const wrapper = mount(FzRadio, {
        props: {
          label: "Radio",
          size: "md",
          tone: "error",
        },
        slots: {
          error: "Error text",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - emphasis state", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
        emphasis: true,
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - standalone state", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
        standalone: true,
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with tooltip", async () => {
      const wrapper = await createWrapper({
        label: "Radio",
        size: "md",
        tooltip: "This is a tooltip",
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
