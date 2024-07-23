import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzInput } from "..";

describe.concurrent("FzInput", () => {
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
      },
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders label", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
      },
      slots: {},
    });

    expect(wrapper.text()).toContain("Label");
  });

  it("renders leftIcon", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
        leftIcon: "calendar-lines",
      },
      slots: {},
    });

    expect(wrapper.find(".fa-calendar-lines")).toBeTruthy();
  });

  it("renders rightIcon", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
        rightIcon: "credit-card",
      },
      slots: {},
    });

    expect(wrapper.find(".fa-credit-card")).toBeTruthy();
  });

  it("renders helpText", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
      },
      slots: {
        helpText: "This is a helper text",
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("This is a helper text");
  });

  it("renders errorMessage", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
        error: true,
      },
      slots: {
        errorMessage: "This is an error message",
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("This is an error message");
  });

  it("renders disabled", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
        disabled: true,
      },
      slots: {},
    });

    expect(wrapper.find("input").attributes("disabled")).toBe("");
  });

  it("renders required", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
        required: true,
      },
      slots: {},
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find("input").attributes("required")).toBe("");
    expect(wrapper.text()).toContain("*");
  });

  it("renders email type", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
        type: "email",
      },
      slots: {},
    });

    expect(wrapper.find("input").attributes("type")).toBe("email");
  });

  it("renders tel type", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
        type: "tel",
      },
      slots: {},
    });

    expect(wrapper.find("input").attributes("type")).toBe("tel");
  });

  it("renders password type", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {
        label: "Label",
        type: "password",
      },
      slots: {},
    });

    expect(wrapper.find("input").attributes("type")).toBe("password");
  });
});
