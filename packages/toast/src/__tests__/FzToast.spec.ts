import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzToast } from "..";

describe.concurrent("FzToast", () => {
  it("success matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzToast, {
      props: {
        type: "success",
      },
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("warning matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzToast, {
      props: {
        type: "warning",
      },
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("error matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzToast, {
      props: {
        type: "error",
      },
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
