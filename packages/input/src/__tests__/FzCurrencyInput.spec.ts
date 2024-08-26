import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { FzCurrencyInput } from "..";

describe.concurrent("FzCurrencyInput", () => {
  it("renders floating numbers as currency", async () => {
    const wrapper = mount(FzCurrencyInput, {
      props: {
        label: "Label",
        amount: 1234.56,
        "onUpdate:amount": (e) => wrapper.setProps({ amount: e }),
      },
    });

    const inputElement = wrapper.find("input");
    await inputElement.trigger("blur");
    // flushPromises doesn't seem to be enoughsince the implementation
    // of the composable uses setTimeout itself
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("1234,56");
  });
  it("should not allow inputs other than digits and separators", async () => {
    const wrapper = mount(FzCurrencyInput, {
      props: {
        label: "Label",
        amount: "",
        "onUpdate:amount": (e) => wrapper.setProps({ amount: e }),
      },
    });

    const inputElement = wrapper.find("input");
    await inputElement.setValue("as12.3");
    await inputElement.trigger("input");
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("12.3");
    await inputElement.trigger("blur");
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("12,30");
  });
});
