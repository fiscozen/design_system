import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzTextarea } from "..";

describe.concurrent("FzTextarea", () => {
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzTextarea, {
      props: {},
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
