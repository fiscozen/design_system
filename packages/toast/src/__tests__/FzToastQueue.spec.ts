import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzToastQueue } from "..";

describe.concurrent("FzToastQueue", () => {
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzToastQueue);

    expect(wrapper.html()).toMatchSnapshot();
  });
});
