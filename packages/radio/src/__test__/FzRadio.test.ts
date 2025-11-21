import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { FzRadio, FzRadioProps } from "..";

const createWrapper = async (props: FzRadioProps) => {
  const content = mount(FzRadio, {
    props,
  });
  return content;
};

describe("FzRadio", () => {
  beforeEach(() => {
    // Mock matchMedia for useMediaQuery composable
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock IntersectionObserver
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      })),
    });
  });

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
        tone: "error",
      },
      slots: {
        error: "Error text",
      },
    });
    await wrapper.vm.$nextTick();

    // Should contain error color
    expect(wrapper.find("label").classes()).toContain(
      "before:border-semantic-error",
    );
    expect(wrapper.find("label").classes()).toContain("text-semantic-error");
  });

  it("should toggle error text when error switch from true to false", async () => {
    const wrapper = mount(FzRadio, {
      props: {
        label: "Radio",
        size: "md",
        tone: "error",
      },
      slots: {
        error: "Error text",
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("label").classes()).toContain(
      "before:border-semantic-error",
    );
    expect(wrapper.find("label").classes()).toContain("text-semantic-error");

    await wrapper.setProps({ tone: "neutral" });

    expect(wrapper.find("label").classes()).not.toContain(
      "before:border-semantic-error",
    );
    expect(wrapper.find("label").classes()).not.toContain(
      "text-semantic-error",
    );
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

    expect(wrapper.find("label").classes()).toContain(
      "peer-checked:before:border-blue-500",
    );
  });

  it("should support tone prop", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      tone: "emphasis",
    });

    expect(wrapper.find("label").classes()).toContain(
      "peer-checked:before:border-blue-500",
    );
  });

  it("should support tone=error", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      tone: "error",
    });

    expect(wrapper.find("label").classes()).toContain(
      "before:border-semantic-error",
    );
    expect(wrapper.find("label").classes()).toContain("text-semantic-error");
  });

  it("should show tooltip when tooltip is provided", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      tooltip: "This is a tooltip",
    });

    expect(wrapper.findComponent({ name: "FzTooltip" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "FzIcon" }).exists()).toBe(true);
  });

  it("should use tooltipStatus prop for tooltip", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      tooltip: "This is an error tooltip",
      tooltipStatus: "error",
    });

    const tooltip = wrapper.findComponent({ name: "FzTooltip" });
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.props("status")).toBe("error");
  });

  it("should default tooltipStatus to neutral when not provided", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      tooltip: "This is a tooltip",
    });

    const tooltip = wrapper.findComponent({ name: "FzTooltip" });
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.props("status")).toBe("neutral");
  });

  it("should not show text when hasText is false", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      hasText: false,
    });

    expect(wrapper.find("label").find("span").exists()).toBe(false);
  });

  it("should maintain backward compatibility with emphasis prop", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      emphasis: true,
    });

    expect(wrapper.find("label").classes()).toContain(
      "peer-checked:before:border-blue-500",
    );
  });

  it("should maintain backward compatibility with error prop", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      error: true,
    });

    expect(wrapper.find("label").classes()).toContain(
      "before:border-semantic-error",
    );
  });

  it("should maintain backward compatibility with standalone prop", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      standalone: true,
    });

    expect(wrapper.find("label").find("span").exists()).toBe(false);
  });
});
