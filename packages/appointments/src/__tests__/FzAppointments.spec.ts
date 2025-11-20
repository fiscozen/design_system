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

  it("generates slots correctly with ISO slotStartTime", async ({ expect }) => {
    const wrapper = mount(FzAppointments, {
      props: {
        slotStartTime: "2024-01-01T10:00:00",
        slotCount: 2,
        slotInterval: 30,
      },
    });

    expect(wrapper.text()).toContain("10:00");
    expect(wrapper.text()).toContain("10:30");
  });
});
