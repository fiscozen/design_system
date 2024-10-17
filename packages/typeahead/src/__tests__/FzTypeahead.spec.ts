import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzTypeahead } from "..";

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

describe.concurrent("FzTypeahead", () => {
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzTypeahead, {
      props: {
        selectProps: {
          options: [
            { label: "some", value: "some" },
            { label: "other", value: "other" },
          ],
        },
      },
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
  it("should reset if programmatically set to empty", async ({ expect }) => {
    const wrapper = mount(FzTypeahead, {
      props: {
        modelValue: "some",
        selectProps: {
          options: [
            { label: "some", value: "some" },
            { label: "other", value: "other" },
          ],
        },
      },
      slots: {},
    });

    const input = await wrapper.find("input");
    expect(input.element.value).toBe("some");
    await wrapper.setProps({ modelValue: "" });
    expect(input.element.value).toBe("");
  });
});
