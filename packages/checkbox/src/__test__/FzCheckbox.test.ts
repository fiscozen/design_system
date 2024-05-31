// FzCheckbox.spec.ts
import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import FzCheckbox from "../FzCheckbox.vue";

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
    expect(wrapper.html()).toMatchSnapshot();
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
});
