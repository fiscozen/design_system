import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzUpload } from "..";

describe.concurrent("FzUpload", () => {
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzUpload, {
      props: {},
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
