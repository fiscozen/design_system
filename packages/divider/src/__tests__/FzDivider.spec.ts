import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzDivider } from "..";

describe.concurrent("FzDivider", () => {
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzDivider, {
      props: {},
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
