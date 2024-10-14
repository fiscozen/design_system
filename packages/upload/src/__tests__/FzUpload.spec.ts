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

  it("matches snaphost with initial files", async ({ expect }) => {
    const mockCreateObjectURL = vi.fn();
    mockCreateObjectURL.mockReturnValue("https://example.png");
    window.URL.createObjectURL = mockCreateObjectURL;

    const wrapper = mount(FzUpload, {
      props: {
        modelValue: [
          new File([], "test-image1.png"),
          new File([], "test-image2.png"),
          new File([], "test-image3.png"),
        ],
      },
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("delete works", async ({ expect }) => {
    const mockCreateObjectURL = vi.fn();
    mockCreateObjectURL.mockReturnValue("https://example.png");
    window.URL.createObjectURL = mockCreateObjectURL;

    const wrapper = mount(FzUpload, {
      props: {
        modelValue: [
          new File([], "test-image1.png"),
          new File([], "test-image2.png"),
          new File([], "test-image3.png"),
        ],
      },
      slots: {},
    });

    expect(wrapper.findAll("ul > li").length).toBe(3);
    await wrapper.get("ul > li:first-child > button").trigger("click");
    expect(wrapper.findAll("ul > li").length).toBe(2);
  });
});
