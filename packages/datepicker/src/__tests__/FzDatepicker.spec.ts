import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzDatepicker } from "..";

describe.concurrent("FzDatepicker", () => {
  vi.mock("@fiscozen/composables", () => ({
    useBreakpoints: vi.fn().mockReturnValue({
      isSmaller: vi.fn().mockReturnValue(false),
    }),
  }));
  it("matches snapshot", async ({ expect }) => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
      },
      slots: {},
    });

    await wrapper.find("input").trigger("click");

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("matches range snapshot", async ({ expect }) => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        range: true,
      },
      slots: {},
    });

    await wrapper.find("input").trigger("click");

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("matches multicalendars range snapshot", async ({ expect }) => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        range: true,
        multiCalendars: true,
      },
      slots: {},
    });

    await wrapper.find("input").trigger("click");

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("matches weekpicker snapshot", async ({ expect }) => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        weekPicker: true,
      },
      slots: {},
    });

    await wrapper.find("input").trigger("click");

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("matches monthpicker snapshot", async ({ expect }) => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        monthPicker: true,
      },
      slots: {},
    });

    await wrapper.find("input").trigger("click");

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("matches yearpicker snapshot", async ({ expect }) => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        yearPicker: true,
      },
      slots: {},
    });

    await wrapper.find("input").trigger("click");

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("matches yearpicker snapshot", async ({ expect }) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const afterTomorrow = new Date(tomorrow);
    afterTomorrow.setDate(tomorrow.getDate() + 1);

    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        disabledDates: [tomorrow, afterTomorrow],
      },
      slots: {},
    });

    await wrapper.find("input").trigger("click");

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("matches inline timepicker snapshot", async ({ expect }) => {
    const wrapper = mount(FzDatepicker, {
      props: {
        modelValue: new Date(),
        timePickerInline: true,
        enableTimePicker: true,
        enableMinutes: true,
        is24: true,
      },
      slots: {},
    });

    await wrapper.find("input").trigger("click");

    expect(wrapper.html()).toMatchSnapshot();
  });
});
