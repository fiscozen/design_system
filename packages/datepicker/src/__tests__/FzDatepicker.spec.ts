import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzDatepicker } from "..";

describe.concurrent("FzDatepicker", () => {
  vi.mock('@fiscozen/composables', () => ({
    useBreakpoints: vi.fn().mockReturnValue({
      isSmaller: vi.fn().mockReturnValue(false)
    })
  }))
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date()
      },
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
