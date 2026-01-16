import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FzRadioCard, FzRadioCardProps } from "..";

const createWrapper = async (props: FzRadioCardProps) => {
  const content = mount(FzRadioCard, {
    props,
  });
  return content;
};

describe("FzRadioCard", () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });
  it("should render correctly", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      title: "This is a title",
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should have checked attribute when modelValue matches value", async () => {
    const wrapper = mount(FzRadioCard, {
      props: {
        label: "Radio",
        size: "md",
        value: "option1",
        modelValue: "option1",
        title: "This is a title",
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("input").element.checked).toBe(true);
  });

  it("should have disabled attribute", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      disabled: true,
      title: "This is a title",
    });

    expect(wrapper.find("input").element.disabled).toBe(true);
  });

  it("should have emphasized class", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      emphasis: true,
      title: "This is a title",
    });

    expect(wrapper.find("label").classes()).toContain(
      "peer-checked:before:border-blue-500",
    );
  });

  it("should support hasRadio prop", async () => {
    const wrapperWithRadio = await createWrapper({
      label: "Radio",
      size: "md",
      title: "This is a title",
      hasRadio: true,
    });
    expect(wrapperWithRadio.find("label").classes()).not.toContain(
      "before:!hidden",
    );

    const wrapperWithoutRadio = await createWrapper({
      label: "Radio",
      size: "md",
      title: "This is a title",
      hasRadio: false,
    });
    expect(wrapperWithoutRadio.find("label").classes()).toContain(
      "before:!hidden",
    );
  });

  it("should maintain backward compatibility with radioIcon prop", async () => {
    const wrapperWithRadioIcon = await createWrapper({
      label: "Radio",
      size: "md",
      title: "This is a title",
      radioIcon: true,
    });
    expect(wrapperWithRadioIcon.find("label").classes()).not.toContain(
      "before:!hidden",
    );

    const wrapperWithoutRadioIcon = await createWrapper({
      label: "Radio",
      size: "md",
      title: "This is a title",
      radioIcon: false,
    });
    expect(wrapperWithoutRadioIcon.find("label").classes()).toContain(
      "before:!hidden",
    );
  });

  it("should support tone prop", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      title: "This is a title",
      tone: "emphasis",
    });

    expect(wrapper.find("label").classes()).toContain(
      "peer-checked:before:border-blue-500",
    );
  });
});
