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

  it("matches snaphost with initial file", async ({ expect }) => {
    const mockCreateObjectURL = vi.fn();
    mockCreateObjectURL.mockReturnValue("https://example.png");
    window.URL.createObjectURL = mockCreateObjectURL;

    const wrapper = mount(FzUpload, {
      props: {
        modelValue: [new File([], "test-image1.png")],
      },
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
        multiple: true,
      },
      slots: {},
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should print a warning message if multiple values are passed without multiple prop", async ({
    expect,
  }) => {
    const warn = vi.spyOn(console, "warn");
    warn.mockImplementation(() => {});

    const wrapper = mount(FzUpload, {
      props: {
        modelValue: [
          new File([], "test-image1.png"),
          new File([], "test-image2.png"),
          new File([], "test-image3.png"),
        ],
        "onUpdate:modelValue": (modelValue: any) =>
          wrapper.setProps({ modelValue }),
      },
      slots: {},
    });

    expect(warn).toHaveBeenCalled();

    // awaiting to be sure the ui is updated. Using "await wrapper.vm.$nextTick" didn't work
    setTimeout(() => {
      expect(wrapper.findAll("ul > li").length).toBe(1);
    }, 50);
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
        multiple: true,
      },
      slots: {},
    });

    expect(wrapper.findAll("ul > li").length).toBe(3);
    await wrapper.get("ul > li:first-child > button").trigger("click");
    expect(wrapper.findAll("ul > li").length).toBe(2);
  });

  it("should emit change event when file is added", async ({ expect }) => {
    const mockCreateObjectURL = vi.fn();
    mockCreateObjectURL.mockReturnValue("https://example.png");
    window.URL.createObjectURL = mockCreateObjectURL;

    const wrapper = mount(FzUpload, {
      props: {},
      slots: {},
    });

    const file = new File(["content"], "test.txt", { type: "text/plain" });

    const input = wrapper.get("input").element as HTMLInputElement;
    Object.defineProperty(input, "files", {
      value: [file],
      writable: false,
    });

    await wrapper.get("input").trigger("change");
    expect(wrapper.emitted("fzupload:change")![0][0]).toEqual([file]);
  });
});
