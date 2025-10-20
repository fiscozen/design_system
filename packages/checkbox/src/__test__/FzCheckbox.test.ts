// FzCheckbox.spec.ts
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import FzCheckbox from "../FzCheckbox.vue";

const MAX_CHECKBOX = 200;

describe("FzCheckbox", () => {
  it("renders correctly", async () => {
    const wrapper = mount(FzCheckbox, {
      props: {
        label: "Test Checkbox",
        value: "test",
        size: "md",
        modelValue: false,
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Test Checkbox");
  });

  it("is checked when v-model is true", async () => {
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

  it("is unchecked when v-model is false", async () => {
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

  it("should be emphasized", async () => {
    const wrapper = mount(FzCheckbox, {
      props: {
        label: "Test Checkbox",
        value: "test",
        size: "md",
        modelValue: false,
        emphasis: true,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("label").classes()).toContain(
      "peer-checked:[&_div]:text-blue-500",
    );
  });

  it("should be disabled", async () => {
    const wrapper = mount(FzCheckbox, {
      props: {
        label: "Test Checkbox",
        value: "test",
        size: "md",
        modelValue: false,
        disabled: true,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("input").element.disabled).toBe(true);
  });

  it(`should render ${MAX_CHECKBOX} checkbox all with different ids`, async () => {
    const checkboxes = Array.from({ length: MAX_CHECKBOX }).map((_) => {
      return mount(FzCheckbox, {
        props: {
          label: "Test Checkbox",
          value: "test",
          size: "md",
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

  it("should not throw error when modelValue is undefined", async () => {
    const wrapper = mount(FzCheckbox, {
      props: {
        label: "Test Checkbox",
        value: "test",
        size: "md",
        modelValue: undefined,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("input").element.checked).toBe(false);
  });

  it("should not throw error when modelValue is null", async () => {
    const wrapper = mount(FzCheckbox, {
      props: {
        label: "Test Checkbox",
        value: "test",
        size: "md",
        modelValue: null,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("input").element.checked).toBe(false);
  });

  it("has correct ARIA attributes (not standalone, no error)", async () => {
    const wrapper = mount(FzCheckbox, {
      props: {
        label: "Test Checkbox",
        value: "test",
        size: "md",
        modelValue: false,
        required: true,
      },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find("input[type='checkbox']");
    const id = input.attributes("id");
    expect(input.attributes("aria-checked")).toBe("false");
    expect(input.attributes("aria-label")).toBeUndefined();
    expect(input.attributes("aria-required")).toBe("true");
    expect(input.attributes("aria-invalid")).toBe("false");
    expect(input.attributes("aria-describedby")).toBeUndefined();
    expect(input.attributes("aria-labelledby")).toBe(`${id}-label`);
    expect(wrapper.find(`#${id}-label`).exists()).toBe(true);
  });

  it("has correct ARIA attributes (standalone)", async () => {
    const wrapper = mount(FzCheckbox, {
      props: {
        label: "Test Checkbox",
        value: "test",
        size: "md",
        modelValue: false,
        standalone: true,
      },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find("input[type='checkbox']");
    expect(input.attributes("aria-labelledby")).toBeUndefined();
    expect(input.attributes("aria-label")).toBe("Test Checkbox");
  });

  it("has correct ARIA attributes when error is present", async () => {
    const wrapper = mount(FzCheckbox, {
      props: {
        label: "Test Checkbox",
        value: "test",
        size: "md",
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
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(input.attributes("aria-describedby")).toBe(`${id}-error`);
    expect(wrapper.find(`#${id}-error`).exists()).toBe(true);
  });

  it("has aria-checked='mixed' when indeterminate", async () => {
    const wrapper = mount(FzCheckbox, {
      props: {
        label: "Test Checkbox",
        value: "test",
        size: "md",
        modelValue: false,
        indeterminate: true,
      },
    });
    await wrapper.vm.$nextTick();
    const input = wrapper.find("input[type='checkbox']");
    expect(input.attributes("aria-checked")).toBe("mixed");
  });
});
