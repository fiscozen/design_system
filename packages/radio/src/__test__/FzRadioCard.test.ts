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

  it("should have checked attribute", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      checked: true,
      title: "This is a title",
    });

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
});
