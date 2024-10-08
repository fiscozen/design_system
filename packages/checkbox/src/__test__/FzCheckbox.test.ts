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

  it("emits an update event when clicked", async () => {
    const wrapper = mount(FzCheckbox, {
      props: {
        label: "Test Checkbox",
        value: "test",
        modelValue: false,
      },
    });
    await wrapper.find("input").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
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
});
