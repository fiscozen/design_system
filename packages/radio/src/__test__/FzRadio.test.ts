import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { FzRadio, FzRadioProps } from "..";

const createWrapper = async (props: FzRadioProps) => {
  const content = mount(FzRadio, {
    props,
  });
  return content;
};

describe("FzRadio", () => {
  it("should render correctly", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should have checked attribute", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      checked: true,
    });

    expect(wrapper.find("input").element.checked).toBe(true);
  });

  it("should have disabled attribute", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      disabled: true,
    });

    expect(wrapper.find("input").element.disabled).toBe(true);
  });

  it("should show error text and error icon", async () => {
    const wrapper = mount(FzRadio, {
      props: {
        label: "Radio",
        size: "md",
        error: true,
      },
      slots: {
        error: "Error text",
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("p")).toBeTruthy();
    expect(wrapper.find("p").text()).toBe("Error text");
    expect(wrapper.find("p").find("svg")).toBeTruthy();
  });

  it("should toggle error text when error switch from true to false", async () => {
    const wrapper = mount(FzRadio, {
      props: {
        label: "Radio",
        size: "md",
        error: true,
      },
      slots: {
        error: "Error text",
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("p")).toBeTruthy();
    expect(wrapper.find("p").text()).toBe("Error text");

    await wrapper.setProps({ error: false });

    expect(wrapper.find("p").exists()).toBeFalsy();
  });

  it("should not show label when standalone is true", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      standalone: true,
    });

    expect(wrapper.find("label").text()).toBeFalsy();
  });

  it("should have emphasized class", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      emphasis: true,
    });

    expect(wrapper.find("input").classes()).toContain("radio--emphasized");
  });
});
