// FzSelect.spec.ts
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import FzSelect from "../FzSelect.vue";
import { calculateContainerWidth } from "../common";

describe("FzSelect", () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders correctly", () => {
    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        modelValue: "",
        isOpen: false,
        size: "md",
        placeholder: "Select an option",
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
    });
    expect(wrapper.html()).to.include("Test Select *");
    expect(wrapper.html()).to.include("Select an option");
  });

  it("displays selected option label", async () => {
    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        modelValue: "",
        isOpen: false,
        size: "md",
        placeholder: "Select an option",
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
    });
    await wrapper.setProps({ modelValue: "option1" });
    expect(wrapper.html()).to.include("Option 1");
  });

  it("displays error slot when error prop is true", async () => {
    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        size: "md",
        placeholder: "Select an option",
        modelValue: "",
        isOpen: false,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
        error: true,
      },
      slots: {
        error: "<div>Error message</div>",
        help: "<div>Help message</div>",
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).to.include("Error message");
  });

  it("displays help slot when help slots is set and error is false", async () => {
    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        size: "md",
        placeholder: "Select an option",
        modelValue: "",
        isOpen: false,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
      slots: {
        error: "<div>Error message</div>",
        help: "<div>Help message</div>",
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.html()).to.include("Help message");
  });

  it("switch to error slot when error prop is set to true", async () => {
    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        size: "md",
        placeholder: "Select an option",
        modelValue: "",
        isOpen: false,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
      slots: {
        error: "<div>Error message</div>",
        help: "<div>Help message</div>",
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.html()).to.include("Help message");
    await wrapper.setProps({ error: true });
    expect(wrapper.html()).to.include("Error message");
  });

  it("should be disabled when disabled prop is set to true", async () => {
    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        isOpen: false,
        size: "md",
        placeholder: "Select an option",
        modelValue: "",
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
        disabled: true,
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find("button").classes()).toContain("text-grey-300");
  });

  it("should render a bell icon", async () => {
    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        size: "md",
        isOpen: false,
        placeholder: "Select an option",
        modelValue: "",
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
        leftIcon: "bell",
        disabled: true,
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find("svg").classes()).toContain("fa-bell");
  });

  it("should render only the first 25 options", async () => {
    const wrapper = mount(FzSelect, {
      props: {
        size: "md",
        isOpen: false,
        placeholder: "Select an option",
        modelValue: "",
        options: Array.from({ length: 100 }, (_, i) => ({
          label: `option ${i % 3}`,
          value: `${i}`,
        })),
      },
    });

    await wrapper.vm.$nextTick();
    wrapper.find('button[test-id="fzselect-opener"]').trigger("click");
    expect(
      document.querySelectorAll('button[test-id="fzselect-option"]').length,
    ).toBe(25);
  });

  it("should render another 25 options when scrolling down", async () => {
    const wrapper = mount(FzSelect, {
      props: {
        size: "md",
        isOpen: false,
        placeholder: "Select an option",
        modelValue: "",
        options: Array.from({ length: 100 }, (_, i) => ({
          label: `option ${i % 3}`,
          value: `${i}`,
        })),
      },
    });

    await wrapper.vm.$nextTick();
    wrapper.find('button[test-id="fzselect-opener"]').trigger("click");
    expect(
      document.querySelectorAll('button[test-id="fzselect-option"]').length,
    ).toBe(25);

    const container = document.querySelector(
      '[test-id="fzselect-options-container"]',
    )!;
    container.scrollTop = container.scrollHeight;
    container.dispatchEvent(new Event("scroll"));

    await wrapper.vm.$nextTick();
    expect(
      document.querySelectorAll('button[test-id="fzselect-option"]').length,
    ).toBe(50);
  });

  it("toggles isOpen state when handlePickerClick is called", async () => {
    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        size: "md",
        placeholder: "Select an option",
        modelValue: "",
        isOpen: false,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
    });

    expect(wrapper.vm.isOpen).toBe(false);
    // @ts-ignore
    await wrapper.vm.handlePickerClick();
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it("calculates container width correctly", async () => {
    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        size: "md",
        placeholder: "Select an option",
        modelValue: "",
        isOpen: false,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
    });

    await wrapper.vm.$nextTick();
    const {maxWidth} = calculateContainerWidth(wrapper.vm.$refs.opener as HTMLElement);
    expect(maxWidth).toBe(window.innerWidth);
  });

  it("calculates container width correctly when element is in the center", async () => {
    const left = window.innerWidth / 2 - 50;
    const right = window.innerWidth / 2 + 50;
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          width: 100,
          right,
          left,
        }) as DOMRect,
    );

    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        size: "md",
        placeholder: "Select an option",
        modelValue: "",
        isOpen: false,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
    });

    const {maxWidth} = calculateContainerWidth(wrapper.vm.$refs.opener as HTMLElement);
    expect(maxWidth).toBe(right);
  });

  it("calculates container width correctly when element is on the left", async () => {
    const left = 29;
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          bottom: 228,
          height: 32,
          left,
          right: 213,
          top: 196,
          width: 184,
          x: 29,
          y: 196,
        }) as DOMRect,
    );

    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        size: "md",
        placeholder: "Select an option",
        modelValue: "",
        isOpen: false,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
    });

    const {maxWidth} = calculateContainerWidth(wrapper.vm.$refs.opener as HTMLElement);
    expect(maxWidth).toBe(window.innerWidth - left);
  });

  it("calculates container width correctly when element is on the right", async () => {
    const right = 1016;
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          x: 832,
          y: 34,
          width: 184,
          height: 32,
          top: 34,
          right,
          bottom: 66,
          left: 832,
        }) as DOMRect,
    );

    const wrapper = mount(FzSelect, {
      props: {
        label: "Test Select",
        required: true,
        size: "md",
        placeholder: "Select an option",
        modelValue: "",
        isOpen: false,
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
      },
    });

    const {maxWidth} = calculateContainerWidth(wrapper.vm.$refs.opener as HTMLElement);
    expect(maxWidth).toBe(right);
  });
});
