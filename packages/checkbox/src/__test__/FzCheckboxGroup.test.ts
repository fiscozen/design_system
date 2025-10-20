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
    expect(wrapper.props("error")).toBe(true);
    
    // Verify error prop is propagated to individual checkboxes
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

  it("has correct ARIA attributes for accessibility", async () => {
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
    const groupId = wrapper.find("[role='group']").attributes("id");
    const labelId = groupId + "-label";
    expect(wrapper.find("[role='group']").exists()).toBe(true);
    expect(wrapper.find("[role='group']").attributes("aria-labelledby")).toBe(
      labelId,
    );
    expect(wrapper.find(`#${labelId}`).exists()).toBe(true);
    expect(
      wrapper.find("[role='group']").attributes("aria-describedby"),
    ).toBeUndefined();
  });

  it("has aria-describedby when error is present", async () => {
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
    const groupId = wrapper.find("[role='group']").attributes("id");
    const errorId = groupId + "-error";
    expect(wrapper.find("[role='group']").attributes("aria-describedby")).toBe(
      errorId,
    );
    expect(wrapper.find(`#${errorId}`).exists()).toBe(true);
  });

  it("has aria-describedby when help text is present", async () => {
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
      slots: {
        help: "This is help text",
      },
    });
    await wrapper.vm.$nextTick();
    const groupId = wrapper.find("[role='group']").attributes("id");
    const helpId = groupId + "-help";
    expect(wrapper.find("[role='group']").attributes("aria-describedby")).toBe(
      helpId,
    );
    expect(wrapper.find(`#${helpId}`).exists()).toBe(true);
    expect(wrapper.find(`#${helpId}`).text()).toBe("This is help text");
  });

  it("has aria-describedby with both help and error", async () => {
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
        help: "This is help text",
        error: "This is an error",
      },
    });
    await wrapper.vm.$nextTick();
    const groupId = wrapper.find("[role='group']").attributes("id");
    const helpId = groupId + "-help";
    const errorId = groupId + "-error";
    const describedby = wrapper.find("[role='group']").attributes("aria-describedby");
    
    // Should contain both IDs separated by space
    expect(describedby).toContain(helpId);
    expect(describedby).toContain(errorId);
    expect(describedby).toBe(`${helpId} ${errorId}`);
  });

  it("propagates error prop to child checkboxes in hierarchical structure", async () => {
    const wrapper = mount(FzCheckboxGroup, {
      props: {
        label: "Test Checkbox Group",
        size: "md",
        modelValue: [],
        options: [
          {
            label: "Parent Option",
            value: "parent",
            children: [
              { label: "Child 1", value: "child1" },
              { label: "Child 2", value: "child2" },
            ],
          },
        ],
        error: true,
      },
      slots: {
        error: "Test error message",
      },
    });

    await wrapper.vm.$nextTick();
    const allCheckboxes = wrapper.findAllComponents(FzCheckbox);
    
    // Should have parent + 2 children = 3 checkboxes
    expect(allCheckboxes.length).toBe(3);
    
    // All checkboxes should have error prop set to true
    allCheckboxes.forEach((checkbox) => {
      expect(checkbox.props("error")).toBe(true);
    });
  });
});
