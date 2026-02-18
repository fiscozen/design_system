import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FzCheckboxCard } from "..";
import type { FzCheckboxCardProps } from "../types";

const createWrapper = (
  props: Partial<FzCheckboxCardProps> & { modelValue?: (string | number | boolean)[] },
) => {
  return mount(FzCheckboxCard, {
    props: {
      label: "Checkbox",
      title: "Card title",
      modelValue: [],
      ...props,
    } as any,
  });
};

describe("FzCheckboxCard", () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  describe("Rendering", () => {
    it("should render correctly", () => {
      const wrapper = createWrapper({});
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should render title", () => {
      const wrapper = createWrapper({ title: "My Card Title" });
      expect(wrapper.text()).toContain("My Card Title");
    });

    it("should render subtitle when provided", () => {
      const wrapper = createWrapper({
        title: "Title",
        subtitle: "A subtitle",
      });
      expect(wrapper.text()).toContain("A subtitle");
    });

    it("should not render subtitle when not provided", () => {
      const wrapper = createWrapper({ title: "Title" });
      const paragraphs = wrapper.findAll("p");
      expect(paragraphs.length).toBe(1);
    });

    it("should render image when hasImage is true and imageUrl is set", () => {
      const wrapper = createWrapper({
        hasImage: true,
        imageUrl: "test.jpg",
        imageAlt: "Test image",
      });
      const img = wrapper.find("img");
      expect(img.exists()).toBe(true);
      expect(img.attributes("src")).toBe("test.jpg");
      expect(img.attributes("alt")).toBe("Test image");
    });

    it("should not render image when hasImage is false", () => {
      const wrapper = createWrapper({
        hasImage: false,
        imageUrl: "test.jpg",
      });
      expect(wrapper.find("img").exists()).toBe(false);
    });

    it("should not render image when imageUrl is not set even if hasImage is true", () => {
      const wrapper = createWrapper({
        hasImage: true,
      });
      expect(wrapper.find("img").exists()).toBe(false);
    });

    it("should render a checkbox input", () => {
      const wrapper = createWrapper({});
      const input = wrapper.find("input[type='checkbox']");
      expect(input.exists()).toBe(true);
    });
  });

  describe("Checked state", () => {
    it("should be checked when value is in modelValue array", async () => {
      const wrapper = createWrapper({
        value: "option1",
        modelValue: ["option1"],
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("input").element.checked).toBe(true);
    });

    it("should not be checked when value is not in modelValue array", () => {
      const wrapper = createWrapper({
        value: "option1",
        modelValue: ["option2"],
      });
      expect(wrapper.find("input").element.checked).toBe(false);
    });

    it("should not be checked when modelValue is empty", () => {
      const wrapper = createWrapper({
        value: "option1",
        modelValue: [],
      });
      expect(wrapper.find("input").element.checked).toBe(false);
    });

    it("should fall back to label as value when value prop is not provided", async () => {
      const wrapper = createWrapper({
        label: "My Label",
        modelValue: [],
      });

      await wrapper.find("input").trigger("change");
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0][0]).toEqual([
        "My Label",
      ]);
    });
  });

  describe("Events", () => {
    it("should emit update:modelValue with value added when clicking unchecked card", async () => {
      const wrapper = createWrapper({
        value: "option1",
        modelValue: [],
      });

      await wrapper.find("input").trigger("change");
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0][0]).toEqual(["option1"]);
    });

    it("should emit update:modelValue with value removed when clicking checked card", async () => {
      const wrapper = createWrapper({
        value: "option1",
        modelValue: ["option1", "option2"],
      });

      await wrapper.find("input").trigger("change");
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0][0]).toEqual(["option2"]);
    });

    it("should not emit when disabled", async () => {
      const wrapper = createWrapper({
        value: "option1",
        modelValue: [],
        disabled: true,
      });

      await wrapper.find("input").trigger("change");
      expect(wrapper.emitted("update:modelValue")).toBeFalsy();
    });
  });

  describe("Disabled state", () => {
    it("should set disabled attribute on input", () => {
      const wrapper = createWrapper({ disabled: true });
      expect(wrapper.find("input").element.disabled).toBe(true);
    });

    it("should apply disabled border styling", () => {
      const wrapper = createWrapper({
        disabled: true,
        value: "opt",
        modelValue: ["opt"],
      });
      const label = wrapper.find("label");
      expect(label.classes()).toContain("border-grey-300");
    });
  });

  describe("hasCheckbox prop", () => {
    it("should render checkbox icon by default", () => {
      const wrapper = createWrapper({});
      const icons = wrapper.findAllComponents({ name: "FzIcon" });
      const checkboxIcon = icons.find(
        (icon) =>
          icon.props("name") === "square" ||
          icon.props("name") === "square-check",
      );
      expect(checkboxIcon).toBeDefined();
    });

    it("should hide checkbox icon when hasCheckbox is false", () => {
      const wrapper = createWrapper({ hasCheckbox: false });
      const icons = wrapper.findAllComponents({ name: "FzIcon" });
      const checkboxIcon = icons.find(
        (icon) =>
          icon.props("name") === "square" ||
          icon.props("name") === "square-check",
      );
      expect(checkboxIcon).toBeUndefined();
    });
  });

  describe("Variant prop", () => {
    it("should apply horizontal classes by default", () => {
      const wrapper = createWrapper({});
      const label = wrapper.find("label");
      expect(label.classes()).toContain("flex-row");
    });

    it("should apply vertical classes when variant is vertical", () => {
      const wrapper = createWrapper({ variant: "vertical" });
      const label = wrapper.find("label");
      expect(label.classes()).toContain("flex-col");
    });

    it("should apply horizontal classes when variant is horizontal", () => {
      const wrapper = createWrapper({ variant: "horizontal" });
      const label = wrapper.find("label");
      expect(label.classes()).toContain("flex-row");
    });
  });

  describe("Selected styling", () => {
    it("should apply selected border when checked and not disabled", () => {
      const wrapper = createWrapper({
        value: "opt",
        modelValue: ["opt"],
      });
      const label = wrapper.find("label");
      expect(label.classes()).toContain("border-blue-500");
      expect(label.classes()).toContain("border-2");
    });

    it("should apply default border when not checked", () => {
      const wrapper = createWrapper({
        value: "opt",
        modelValue: [],
      });
      const label = wrapper.find("label");
      expect(label.classes()).toContain("border-grey-300");
    });
  });

  describe("Emphasis styling", () => {
    it("should apply emphasis color to checkbox icon when emphasis is true", () => {
      const wrapper = createWrapper({ emphasis: true });
      const icons = wrapper.findAllComponents({ name: "FzIcon" });
      const checkboxIcon = icons.find(
        (icon) =>
          icon.props("name") === "square" ||
          icon.props("name") === "square-check",
      );
      expect(checkboxIcon?.classes()).toContain("text-blue-500");
    });
  });

  describe("Error styling", () => {
    it("should apply error color to checkbox icon when error is true", () => {
      const wrapper = createWrapper({ error: true });
      const icons = wrapper.findAllComponents({ name: "FzIcon" });
      const checkboxIcon = icons.find(
        (icon) =>
          icon.props("name") === "square" ||
          icon.props("name") === "square-check",
      );
      expect(checkboxIcon?.classes()).toContain("text-semantic-error-200");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-checked attribute", () => {
      const wrapper = createWrapper({
        value: "opt",
        modelValue: ["opt"],
      });
      expect(wrapper.find("input").attributes("aria-checked")).toBe("true");
    });

    it("should have aria-required when required", () => {
      const wrapper = createWrapper({ required: true });
      expect(wrapper.find("input").attributes("aria-required")).toBe("true");
    });

    it("should have aria-invalid when in error state", () => {
      const wrapper = createWrapper({ error: true });
      expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
    });

    it("should connect label to input via for/id", () => {
      const wrapper = createWrapper({});
      const input = wrapper.find("input");
      const label = wrapper.find("label");
      expect(label.attributes("for")).toBe(input.attributes("id"));
    });
  });

  describe("Tooltip", () => {
    it("should render tooltip when tooltip prop is provided", () => {
      const wrapper = createWrapper({ tooltip: "Help text" });
      const tooltip = wrapper.findComponent({ name: "FzTooltip" });
      expect(tooltip.exists()).toBe(true);
    });

    it("should not render tooltip when tooltip prop is not provided", () => {
      const wrapper = createWrapper({});
      const tooltip = wrapper.findComponent({ name: "FzTooltip" });
      expect(tooltip.exists()).toBe(false);
    });
  });
});
