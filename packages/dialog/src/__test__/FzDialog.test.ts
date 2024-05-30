import { mount } from "@vue/test-utils";
import figmaTokens from "@fiscozen/style/tokens.json";
import { describe, it, expect } from "vitest";
import { FzConfirmDialog } from "../";

const viewports: Record<string, number> = Object.entries(
  figmaTokens.global.breakpoint,
).reduce((acc: Record<string, number>, curr: [string, any]) => {
  acc[curr[0]] = Number(curr[1].value.slice(0, -2));
  return acc;
}, {});

describe("FzDialog", () => {
  it("should match snapshot - md", () => {
    global.innerWidth = viewports["lg"];
    const wrapper = mount(FzConfirmDialog, {
      props: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("should match snapshot - md - xs screen", () => {
    global.innerWidth = viewports["xs"];
    const wrapper = mount(FzConfirmDialog, {
      props: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("should match snapshot - sm", () => {
    const wrapper = mount(FzConfirmDialog, {
      props: {
        size: "sm",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("should match snapshot - lg", () => {
    const wrapper = mount(FzConfirmDialog, {
      props: {
        size: "lg",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("should match snapshot - xl", () => {
    const wrapper = mount(FzConfirmDialog, {
      props: {
        size: "xl",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("should match snapshot - drawer", () => {
    const wrapper = mount(FzConfirmDialog, {
      props: {
        isDrawer: true,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
