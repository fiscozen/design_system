import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { defineComponent, ref, nextTick } from "vue";
import { FzCheckboxCard, FzCheckboxGroup } from "..";
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

    it("should render image when imageUrl is provided", () => {
      const wrapper = createWrapper({
        imageUrl: "test.jpg",
        imageAlt: "Test image",
      });
      const img = wrapper.find("img");
      expect(img.exists()).toBe(true);
      expect(img.attributes("src")).toBe("test.jpg");
      expect(img.attributes("alt")).toBe("Test image");
    });

    it("should not render image when imageUrl is not provided", () => {
      const wrapper = createWrapper({});
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
      const wrapper = createWrapper({ variant: "vertical", imageUrl: "test.jpg" });
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

  describe("Inside FzCheckboxGroup (integration)", () => {
    function mountGroupWithCards(initialSelected: (string | number | boolean)[] = []) {
      const Wrapper = defineComponent({
        components: { FzCheckboxGroup, FzCheckboxCard },
        setup() {
          const selected = ref<(string | number | boolean)[]>(initialSelected);
          const handleUpdate = (val: (string | number | boolean)[]) => {
            selected.value = val;
          };
          return { selected, handleUpdate };
        },
        template: `
          <FzCheckboxGroup label="Test Group">
            <template #default="{ checkboxGroupProps }">
              <FzCheckboxCard
                label="Card 1"
                title="Card 1"
                value="card1"
                :modelValue="selected"
                @update:modelValue="handleUpdate"
                v-bind="checkboxGroupProps"
              />
              <FzCheckboxCard
                label="Card 2"
                title="Card 2"
                value="card2"
                :modelValue="selected"
                @update:modelValue="handleUpdate"
                v-bind="checkboxGroupProps"
              />
              <FzCheckboxCard
                label="Card 3"
                title="Card 3"
                value="card3"
                :modelValue="selected"
                @update:modelValue="handleUpdate"
                v-bind="checkboxGroupProps"
              />
            </template>
          </FzCheckboxGroup>
        `,
      });

      return mount(Wrapper);
    }

    function getCheckboxInputs(wrapper: ReturnType<typeof mount>) {
      return wrapper
        .findAll("input[type='checkbox']")
        .map((w) => w.element as HTMLInputElement);
    }

    it("should show pre-checked cards when modelValue contains their values", async () => {
      const wrapper = mountGroupWithCards(["card1", "card3"]);
      await nextTick();

      const inputs = getCheckboxInputs(wrapper);
      expect(inputs[0].checked).toBe(true);
      expect(inputs[1].checked).toBe(false);
      expect(inputs[2].checked).toBe(true);
    });

    it("should check a card when clicking it", async () => {
      const wrapper = mountGroupWithCards();
      await nextTick();

      const wrappers = wrapper.findAll("input[type='checkbox']");
      const inputs = getCheckboxInputs(wrapper);
      expect(inputs[0].checked).toBe(false);

      await wrappers[0].trigger("change");
      await nextTick();

      expect(wrapper.vm.selected).toContain("card1");
      expect(inputs[0].checked).toBe(true);
    });

    it("should uncheck a card when clicking a checked card", async () => {
      const wrapper = mountGroupWithCards(["card2"]);
      await nextTick();

      const wrappers = wrapper.findAll("input[type='checkbox']");
      const inputs = getCheckboxInputs(wrapper);
      expect(inputs[1].checked).toBe(true);

      await wrappers[1].trigger("change");
      await nextTick();

      expect(wrapper.vm.selected).not.toContain("card2");
      expect(inputs[1].checked).toBe(false);
    });

    it("should support selecting multiple cards", async () => {
      const wrapper = mountGroupWithCards();
      await nextTick();

      const wrappers = wrapper.findAll("input[type='checkbox']");
      const inputs = getCheckboxInputs(wrapper);
      await wrappers[0].trigger("change");
      await nextTick();
      await wrappers[2].trigger("change");
      await nextTick();

      expect(wrapper.vm.selected).toEqual(["card1", "card3"]);
      expect(inputs[0].checked).toBe(true);
      expect(inputs[1].checked).toBe(false);
      expect(inputs[2].checked).toBe(true);
    });
  });
});
