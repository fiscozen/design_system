// FzSelect.spec.ts
import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import FzSelect from "../FzSelect.vue";

beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe("FzSelect", () => {
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
    expect(wrapper.findAll('button[test-id="fzselect-option"]').length).toBe(
      25,
    );
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
    expect(wrapper.findAll('button[test-id="fzselect-option"]').length).toBe(
      25,
    );

    const container = wrapper.find(
      '[test-id="fzselect-options-container"]',
    ).element;
    container.scrollTop = container.scrollHeight;
    await wrapper
      .find('[test-id="fzselect-options-container"]')
      .trigger("scroll");

    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('button[test-id="fzselect-option"]').length).toBe(
      50,
    );
  });
});
