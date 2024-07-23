import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzInput } from "..";

describe.concurrent("FzInput", () => {
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzInput, {
      props: {},
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
