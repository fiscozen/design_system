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
        amount: 0,
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

  it("should allow to set value at 0", async () => {
    const wrapper = mount(FzCurrencyInput, {
      props: {
        label: "Label",
        amount: 10,
        "onUpdate:amount": (e) => wrapper.setProps({ amount: e }),
      },
    });

    const inputElement = wrapper.find("input");
    await inputElement.trigger("blur");
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("10,00");
    wrapper.setProps({ amount: 0 });
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("0,00");
  });

  it("should handle pasted values using the best possible euristic to parse and render it correctly", async () => {
    const wrapper = mount(FzCurrencyInput, {
      props: {
        label: "Label",
        "onUpdate:amount": (e) => wrapper.setProps({ amount: e }),
      },
    });

    const inputElement = wrapper.find("input");
    // we need to mock the paste event
    await inputElement.trigger("paste", {
      clipboardData: {
        getData() {
          return "1.233.222,43";
        },
      },
    });
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("1233222,43");

    await inputElement.trigger("paste", {
      clipboardData: {
        getData() {
          return "1.23";
        },
      },
    });
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("1,23");

    await inputElement.trigger("paste", {
      clipboardData: {
        getData() {
          return "1,23";
        },
      },
    });
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("1,23");

    await inputElement.trigger("paste", {
      clipboardData: {
        getData() {
          return "1.232.111";
        },
      },
    });
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("1232111,00");

    await inputElement.trigger("paste", {
      clipboardData: {
        getData() {
          return "1.232";
        },
      },
    });
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("1,23");

    await inputElement.trigger("paste", {
      clipboardData: {
        getData() {
          return "1.232555";
        },
      },
    });
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("1,23");
  });

  it("should limit value according to min/max setting", async () => {
    const wrapper = mount(FzCurrencyInput, {
      props: {
        label: "Label",
        amount: 10,
        "onUpdate:amount": (e) => wrapper.setProps({ amount: e }),
        min: 2,
        max: 20,
      },
    });

    const inputElement = wrapper.find("input");
    await inputElement.trigger("blur");
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("10,00");
    await wrapper.setProps({ amount: 1 });
    await inputElement.trigger("blur");
    expect(inputElement.element.value).toBe("2,00");
    await wrapper.setProps({ amount: 23 });
    await inputElement.trigger("blur");
    expect(inputElement.element.value).toBe("20,00");
  });

  it("should step correctly when using quantization via the 'step' prop", async () => {
    const wrapper = mount(FzCurrencyInput, {
      props: {
        label: "Label",
        amount: 1,
        "onUpdate:amount": (e) => wrapper.setProps({ amount: e }),
        step: 4,
      },
    });

    const inputElement = wrapper.find("input");
    const arrowUp = wrapper.find(".fz__currencyinput__arrowup");
    const arrowDown = wrapper.find(".fz__currencyinput__arrowdown");

    await inputElement.trigger("blur");
    expect(inputElement.element.value).toBe("1,00");
    await arrowUp.trigger("click");
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("5,00");
    await arrowDown.trigger("click");
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("1,00");
    await arrowDown.trigger("click");
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("-3,00");
  });

  it("should enforce quantization via the 'forcedStep' prop", async () => {
    const wrapper = mount(FzCurrencyInput, {
      props: {
        label: "Label",
        amount: 8,
        "onUpdate:amount": (e) => wrapper.setProps({ amount: e }),
        step: 4,
        forceStep: true,
      },
    });

    const inputElement = wrapper.find("input");
    await inputElement.trigger("blur");
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("8,00");
    await wrapper.setProps({ amount: 5 });
    await inputElement.trigger("blur");
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("4,00");
    await wrapper.setProps({ amount: -7 });
    await inputElement.trigger("blur");
    await new Promise((resolve) => window.setTimeout(resolve, 100));
    expect(inputElement.element.value).toBe("-8,00");
  });
});
