import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import FzCheckboxGroup from "../FzCheckboxGroup.vue";
import FzCheckbox from "../FzCheckbox.vue";

describe("FzCheckboxGroup", () => {
  it("renders correctly", async () => {
    const wrapper = mount(FzCheckboxGroup, {
      props: {
        label: "Test Checkbox Group",
        size: "md",
        modelValue: [],
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Test Checkbox Group");
    expect(wrapper.findAllComponents(FzCheckbox).length).toBe(2);
  });

  it("displays error text when error prop is true", async () => {
    const wrapper = mount(FzCheckboxGroup, {
      props: {
        label: "Test Checkbox Group",
        size: "md",
        modelValue: [],
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
        error: true,
      },
      slots: {
        error: "Test error message",
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Test error message");
    expect(wrapper.findAllComponents(FzCheckbox).length).toBe(2);
    expect(wrapper.findAllComponents(FzCheckbox).at(0)!.props("error")).toBe(
      true,
    );
    expect(wrapper.findAllComponents(FzCheckbox).at(1)!.props("error")).toBe(
      true,
    );
  });

  it("has disabled checkboxes when disabled prop is true", async () => {
    const wrapper = mount(FzCheckboxGroup, {
      props: {
        label: "Test Checkbox Group",
        size: "md",
        modelValue: [],
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
        disabled: true,
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.findAllComponents(FzCheckbox).length).toBe(2);
    expect(wrapper.findAllComponents(FzCheckbox).at(0)!.props("disabled")).toBe(
      true,
    );
    expect(wrapper.findAllComponents(FzCheckbox).at(1)!.props("disabled")).toBe(
      true,
    );
  });

  it("display emphasized checkboxes when emphasis prop is true", async () => {
    const wrapper = mount(FzCheckboxGroup, {
      props: {
        label: "Test Checkbox Group",
        size: "md",
        modelValue: [],
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
        emphasis: true,
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.findAllComponents(FzCheckbox).length).toBe(2);
    expect(wrapper.findAllComponents(FzCheckbox).at(0)!.props("emphasis")).toBe(
      true,
    );
    expect(wrapper.findAllComponents(FzCheckbox).at(1)!.props("emphasis")).toBe(
      true,
    );
  });
});
