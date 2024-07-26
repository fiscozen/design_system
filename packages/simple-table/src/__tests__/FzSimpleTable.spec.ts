import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzSimpleTable } from "..";

describe.concurrent("FzSimpleTable", () => {
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzSimpleTable, {
      props: {},
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
