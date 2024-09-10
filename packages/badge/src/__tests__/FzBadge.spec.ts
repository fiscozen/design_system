import { describe, it } from "vitest";
import { mount } from "@vue/test-utils";
import { FzBadge } from "..";

describe.concurrent("FzBadge", () => {
  it("black color matches snapshot", async ({ expect }) => {
    const wrapper = mount(FzBadge, {
      props: {
        color: "black",
      },
      slots: {
        default: "Fiscozen",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("error color matches snapshot", async ({ expect }) => {
    const wrapper = mount(FzBadge, {
      props: {
        color: "error",
      },
      slots: {
        default: "Fiscozen",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("warning color matches snapshot", async ({ expect }) => {
    const wrapper = mount(FzBadge, {
      props: {
        color: "warning",
      },
      slots: {
        default: "Fiscozen",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("success color matches snapshot", async ({ expect }) => {
    const wrapper = mount(FzBadge, {
      props: {
        color: "success",
      },
      slots: {
        default: "Fiscozen",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("info color matches snapshot", async ({ expect }) => {
    const wrapper = mount(FzBadge, {
      props: {
        color: "info",
      },
      slots: {
        default: "Fiscozen",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should have rounded-full class when default slot is a string with 1 character", async ({ expect }) => {
    const wrapper = mount(FzBadge, {
      slots: {
        default: "1",
      },
    });

    expect(wrapper.classes()).toContain("rounded-full");
  });

  it("should not have rounded-full class when default slot is a string with more than 1 character", async ({ expect }) => {
    const wrapper = mount(FzBadge, {
      slots: {
        default: "Fiscozen",
      },
    });

    expect(wrapper.classes()).not.toContain("rounded-full");
  });
});
