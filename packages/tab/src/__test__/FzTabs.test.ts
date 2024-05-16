import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { FzTab, FzTabs } from "..";
import { h } from "vue";
import { FzTabProps, FzTabsProps } from "../types";

const createWrapper = async (
  props: FzTabsProps,
  tab1Props: FzTabProps,
  tab2Props: FzTabProps,
) => {
  const content = mount(FzTabs, {
    props,
    slots: {
      default: () => [
        h(FzTab, tab1Props, "Content tab1"),
        h(FzTab, tab2Props, "Content tab2"),
      ],
    },
  });

  await content.vm.$nextTick();
  return content;
};

describe("FzTabs", () => {
  beforeEach(() => {
    globalThis.HTMLElement.prototype.scrollIntoView = () => {};
  });
  it("renders with base case", async () => {
    const wrapper = await createWrapper(
      {
        size: "sm",
      },
      {
        title: "tab1",
      },
      {
        title: "tab2",
      },
    );

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders with md size", async () => {
    const wrapper = await createWrapper(
      { size: "md" },
      { title: "tab1" },
      { title: "tab2" },
    );

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders with badgeContent on tab1", async () => {
    const wrapper = await createWrapper(
      { size: "sm" },
      { title: "tab1", badgeContent: "1" },
      { title: "tab2" },
    );

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders with icon on tab1", async () => {
    const wrapper = await createWrapper(
      { size: "sm" },
      { title: "tab1", icon: "bell" },
      { title: "tab2" },
    );

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("change tab", async () => {
    const wrapper = await createWrapper(
      { size: "sm" },
      { title: "tab1" },
      { title: "tab2" },
    );

    await wrapper.findAll("button[title='tab2']")[0].trigger("click");

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders with vertical direction", async () => {
    const wrapper = await createWrapper(
      { size: "sm", vertical: true },
      { title: "tab1" },
      { title: "tab2" },
    );

    expect(wrapper.html()).toMatchSnapshot();
  })
});
