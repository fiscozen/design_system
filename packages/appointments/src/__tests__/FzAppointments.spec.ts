import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzAppointments } from "..";

describe.concurrent("FzAppointments", () => {
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzAppointments, {
      props: {},
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
