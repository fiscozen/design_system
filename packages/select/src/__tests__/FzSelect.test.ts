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

    // Mock window.matchMedia for FzFloating component
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
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("Rendering", () => {
    it("renders correctly with required props", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.html()).toBeTruthy();
      expect(wrapper.find('button[test-id="fzselect-opener"]').exists()).toBe(
        true
      );
    });

    it("displays label when provided", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          label: "Test Select",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.html()).toContain("Test Select");
    });

    it("displays required asterisk when required is true", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          label: "Test Select",
          required: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.html()).toContain("Test Select *");
    });

    it("displays placeholder when no value is selected", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          placeholder: "Select an option",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.html()).toContain("Select an option");
    });

    it("displays selected option label when value is set", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.setProps({ modelValue: "option1" });
      expect(wrapper.html()).toContain("Option 1");
    });
  });

  describe("Environment Styling", () => {
    it("applies backoffice styling classes", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          environment: "backoffice",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.classes()).toContain("h-32");
      expect(button.classes()).toContain("text-base");
    });

    it("applies frontoffice styling classes", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          environment: "frontoffice",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.classes()).toContain("h-44");
      expect(button.classes()).toContain("text-lg");
    });

    it("defaults to frontoffice environment", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.classes()).toContain("h-44");
      expect(button.classes()).toContain("text-lg");
    });
  });

  describe("Error and Help States", () => {
    it("displays error slot when error prop is true", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          error: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
        slots: {
          error: "<div>Error message</div>",
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain("Error message");
    });

    it("displays help slot when error is false", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
        slots: {
          help: "<div>Help message</div>",
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain("Help message");
    });

    it("switches from help to error slot when error prop changes", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
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
      expect(wrapper.html()).toContain("Help message");
      expect(wrapper.html()).not.toContain("Error message");

      await wrapper.setProps({ error: true });
      expect(wrapper.html()).toContain("Error message");
      expect(wrapper.html()).not.toContain("Help message");
    });

    it("applies error styling classes when error is true", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          error: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.classes()).toContain("border-semantic-error-200");
    });
  });

  describe("Disabled State", () => {
    it("applies disabled styling classes when disabled is true", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.classes()).toContain("bg-grey-100");
      expect(button.classes()).toContain("text-grey-300");
      expect(button.classes()).toContain("cursor-not-allowed");
    });

    it("sets aria-disabled attribute when disabled", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.attributes("aria-disabled")).toBe("true");
    });

    it("prevents opening dropdown when disabled", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");

      expect(wrapper.vm.isOpen).toBe(false);
    });
  });

  describe("Icons", () => {
    it("renders left icon when leftIcon prop is provided", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          leftIcon: "bell",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.html()).toContain("bell");
    });

    it("renders right icon when rightIcon prop is provided", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          rightIcon: "xmark",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.html()).toContain("xmark");
    });

    it("renders right icon button when rightIconButton is true", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          rightIcon: "xmark",
          rightIconButton: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      // FzIconButton component should be rendered
      expect(wrapper.html()).toContain("xmark");
    });
  });

  describe("Lazy Loading", () => {
    it("renders only the first batch of options initially", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          optionsToShow: 25,
          options: Array.from({ length: 100 }, (_, i) => ({
            value: `${i}`,
            label: `Option ${i}`,
          })),
        },
      });

      await wrapper.vm.$nextTick();
      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const options = document.querySelectorAll(
        'button[test-id="fzselect-option"]'
      );
      expect(options.length).toBe(25);
    });

    it("loads more options when scrolling near bottom", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          optionsToShow: 25,
          options: Array.from({ length: 100 }, (_, i) => ({
            value: `${i}`,
            label: `Option ${i}`,
          })),
        },
      });

      await wrapper.vm.$nextTick();
      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      let options = document.querySelectorAll(
        'button[test-id="fzselect-option"]'
      );
      expect(options.length).toBe(25);

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      )!;
      container.scrollTop = container.scrollHeight;
      container.dispatchEvent(new Event("scroll"));

      await wrapper.vm.$nextTick();
      options = document.querySelectorAll('button[test-id="fzselect-option"]');
      expect(options.length).toBe(50);
    });
  });

  describe("Dropdown Interaction", () => {
    it("toggles dropdown open state when opener is clicked", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.vm.isOpen).toBe(false);

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");

      expect(wrapper.vm.isOpen).toBe(true);
    });

    it("sets aria-expanded attribute correctly", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.attributes("aria-expanded")).toBe("false");

      await button.trigger("click");
      expect(button.attributes("aria-expanded")).toBe("true");
    });

    it("closes dropdown when option is selected", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      expect(wrapper.vm.isOpen).toBe(true);

      await wrapper.vm.$nextTick();
      const optionButton = document.querySelector(
        'button[test-id="fzselect-option"]'
      ) as HTMLElement;
      optionButton?.click();

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("emits select event when option is selected", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const optionButton = document.querySelector(
        'button[test-id="fzselect-option"]'
      ) as HTMLElement;
      optionButton?.click();

      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("select")).toBeTruthy();
      expect(wrapper.emitted("select")?.[0]).toEqual(["option1"]);
    });
  });

  describe("Grouped Options", () => {
    it("renders group labels correctly", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { kind: "label", label: "Group 1" },
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const labels = document.querySelectorAll(
        'label[test-id="fzselect-label"]'
      );
      expect(labels.length).toBe(1);
      expect(labels[0].textContent).toBe("Group 1");
    });
  });

  describe("Container Width Calculation", () => {
    it("calculates container width correctly", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      const opener = wrapper.vm.$refs.opener as HTMLElement;
      const { maxWidth } = calculateContainerWidth(opener);
      expect(maxWidth).toBeGreaterThan(0);
    });

    it("calculates container width correctly when element is centered", async () => {
      const left = window.innerWidth / 2 - 50;
      const right = window.innerWidth / 2 + 50;
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
        () =>
          ({
            width: 100,
            right,
            left,
          }) as DOMRect
      );

      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const opener = wrapper.vm.$refs.opener as HTMLElement;
      const { maxWidth } = calculateContainerWidth(opener);
      expect(maxWidth).toBe(right);
    });
  });

  describe("Accessibility", () => {
    it("sets aria-haspopup attribute", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.attributes("aria-haspopup")).toBe("listbox");
    });

    it("sets aria-labelledby when label is provided", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          label: "Test Label",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.attributes("aria-labelledby")).toBeTruthy();
    });

    it("sets aria-label when label is not provided", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          placeholder: "Select...",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.attributes("aria-label")).toBe("Select...");
    });

    it("sets aria-required when required is true", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          required: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.attributes("aria-required")).toBe("true");
    });

    it("sets aria-invalid when error is true", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          error: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(button.attributes("aria-invalid")).toBe("true");
    });

    it("sets role='listbox' on options container", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      );
      expect(container?.getAttribute("role")).toBe("listbox");
    });
  });

  describe("Keyboard Navigation - Opener", () => {
    it("opens dropdown on Enter key", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(wrapper.vm.isOpen).toBe(false);

      await button.trigger("keydown", { key: "Enter" });
      expect(wrapper.vm.isOpen).toBe(true);
    });

    it("opens dropdown on Space key", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(wrapper.vm.isOpen).toBe(false);

      await button.trigger("keydown", { key: " " });
      expect(wrapper.vm.isOpen).toBe(true);
    });

    it("closes dropdown on Escape key when open", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      expect(wrapper.vm.isOpen).toBe(true);

      await button.trigger("keydown", { key: "Escape" });
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("does not open dropdown on Enter when disabled", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      expect(wrapper.vm.isOpen).toBe(false);

      await button.trigger("keydown", { key: "Enter" });
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("prevents default behavior on Enter key", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");

      await button.element.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Keyboard Navigation - Options", () => {
    it("navigates to next option on ArrowDown", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      expect(wrapper.vm.focusedIndex).toBe(0);

      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(1);
    });

    it("navigates to previous option on ArrowUp", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 2;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp" })
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(1);
    });

    it("wraps to first option when ArrowDown on last option", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 1;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(0);
    });

    it("wraps to last option when ArrowUp on first option", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp" })
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(1);
    });

    it("moves to first option on Home key", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 2;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Home" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(0);
    });

    it("moves to last option on End key", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "End" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(2);
    });

    it("selects focused option on Enter key", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 1;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.modelValue).toBe("option2");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("selects focused option on Space key", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.modelValue).toBe("option1");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("closes dropdown on Escape key", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(false);
      expect(wrapper.vm.focusedIndex).toBe(-1);
    });

    it("skips labels when navigating with arrows", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { kind: "label", label: "Group 1" },
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { kind: "label", label: "Group 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      // Should start at first selectable option (index 0 in selectableOptions)
      expect(wrapper.vm.focusedIndex).toBe(0);

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      );
      await wrapper.vm.$nextTick();
      // Should move to second selectable option, skipping labels
      expect(wrapper.vm.focusedIndex).toBe(1);
    });
  });

  describe("Focus Management - Open/Close", () => {
    it("moves focus to first option when dropdown opens", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for scrollToFocusedOption

      // Focus should be on first option
      const focusedButton = document.activeElement;
      expect(focusedButton).toBeTruthy();
      expect(focusedButton?.getAttribute("role")).toBe("option");
    });

    it("moves focus to selected option when dropdown opens", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "option2",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for scrollToFocusedOption

      // Focus should be on selected option (option2)
      expect(wrapper.vm.focusedIndex).toBe(1); // Index of option2 in selectableOptions
    });

    it("returns focus to opener button when dropdown closes", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus on option

      // Close dropdown
      wrapper.vm.isOpen = false;
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus return

      // Focus should be back on opener button
      const focusedElement = document.activeElement;
      expect(focusedElement).toBe(openerButton.element);
    });

    it("returns focus to opener button after selecting an option", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus on option

      // Select first option
      wrapper.vm.handleSelect("option1");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus return

      // Focus should be back on opener button
      const focusedElement = document.activeElement;
      expect(focusedElement).toBe(openerButton.element);
    });

    it("returns focus to opener button when closing with Escape", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus on option

      // Close with Escape
      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus return

      // Focus should be back on opener button
      const focusedElement = document.activeElement;
      expect(focusedElement).toBe(openerButton.element);
    });
  });

  describe("Focus Trap", () => {
    it("wraps to first option when Tab on last option", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 2; // Last option
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.focusedIndex).toBe(0); // Wrapped to first
    });

    it("wraps to last option when Shift+Tab on first option", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0; // First option
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", shiftKey: true })
      );
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.focusedIndex).toBe(2); // Wrapped to last
    });

    it("moves to next option when Tab on non-last option", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0; // First option
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.focusedIndex).toBe(1); // Moved to next
    });

    it("moves to previous option when Shift+Tab on non-first option", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 2; // Last option
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", shiftKey: true })
      );
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.focusedIndex).toBe(1); // Moved to previous
    });

    it("prevents default Tab behavior to trap focus", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      const event = new KeyboardEvent("keydown", { key: "Tab" });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");

      container.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Screen Reader Accessibility", () => {
    it("sets aria-activedescendant when option is focused", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      expect(container.getAttribute("aria-activedescendant")).toBeTruthy();
      expect(container.getAttribute("aria-activedescendant")).toContain(
        "option1"
      );
    });

    it("updates aria-activedescendant when navigating options", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      const firstId = container.getAttribute("aria-activedescendant");

      wrapper.vm.focusedIndex = 1;
      await wrapper.vm.$nextTick();

      const secondId = container.getAttribute("aria-activedescendant");
      expect(secondId).not.toBe(firstId);
      expect(secondId).toContain("option2");
    });

    it("removes aria-activedescendant when dropdown closes", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      expect(container.getAttribute("aria-activedescendant")).toBeTruthy();

      wrapper.vm.isOpen = false;
      await wrapper.vm.$nextTick();

      expect(container.getAttribute("aria-activedescendant")).toBeNull();
    });

    it("assigns unique IDs to option elements", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const optionButtons = document.querySelectorAll(
        'button[test-id="fzselect-option"]'
      );
      expect(optionButtons.length).toBeGreaterThan(0);

      const ids = Array.from(optionButtons).map((btn) => btn.id);
      expect(ids.every((id) => id && id.length > 0)).toBe(true);
      expect(new Set(ids).size).toBe(ids.length); // All IDs are unique
    });
  });

  describe("Keyboard Navigation - Readonly/Disabled States", () => {
    it("does not open dropdown with Enter key when readonly", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          readonly: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("keydown.enter");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("does not open dropdown with Space key when readonly", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          readonly: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("keydown.space");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("does not navigate options when readonly", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          readonly: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      // Readonly should prevent opening dropdown
      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      
      // Dropdown should not open when readonly
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("does not open dropdown with Enter key when disabled", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("keydown.enter");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("does not navigate options when disabled", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      // Disabled should prevent opening dropdown
      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      
      // Dropdown should not open when disabled
      expect(wrapper.vm.isOpen).toBe(false);
    });
  });

  describe("Keyboard Navigation - Edge Cases", () => {
    it("handles keyboard navigation with single option", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [{ value: "option1", label: "Option 1" }],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      expect(wrapper.vm.focusedIndex).toBe(0);

      // ArrowDown should wrap to first (and only) option
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(0);

      // ArrowUp should wrap to first (and only) option
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp" })
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(0);
    });

    it("handles keyboard navigation with empty options list", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      );
      await wrapper.vm.$nextTick();

      // Should handle gracefully without errors
      expect(wrapper.vm.focusedIndex).toBe(-1);
    });

    it("handles keyboard navigation with disabled options", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1", disabled: true },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3", disabled: true },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Should start at first selectable option (option2, index 1)
      expect(wrapper.vm.focusedIndex).toBe(0);

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      );
      await wrapper.vm.$nextTick();

      // Should skip disabled options and wrap correctly
      // Since we have only one selectable option (option2), it should wrap to index 0
      expect(wrapper.vm.focusedIndex).toBe(0);
    });

    it("handles Tab key with empty selectable options", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { kind: "label", label: "Group 1" },
            { value: "option1", label: "Option 1", disabled: true },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      await wrapper.vm.$nextTick();

      // Should handle gracefully without errors
      expect(wrapper.vm.focusedIndex).toBe(-1);
    });
  });

  describe("Keyboard Navigation - Integration Tests", () => {
    it("completes full flow: open → navigate → select → close", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      
      // 1. Open with Enter
      await openerButton.trigger("keydown.enter");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);
      expect(wrapper.vm.focusedIndex).toBe(0);

      // 2. Navigate to second option with ArrowDown
      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(1);

      // 3. Select with Enter
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.modelValue).toBe("option2");
      expect(wrapper.vm.isOpen).toBe(false);

      // 4. Verify focus returned to opener
      await wrapper.vm.$nextTick();
      const focusedElement = document.activeElement;
      expect(focusedElement).toBe(openerButton.element);
    });

    it("handles Tab navigation flow correctly", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;

      // Tab to next
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(1);

      // Tab again should wrap to first
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(0);
    });
  });

  describe("Focus Management - Edge Cases", () => {
    it("handles focus return when dropdown closes via click outside", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);

      // Simulate click outside (closes dropdown)
      wrapper.vm.isOpen = false;
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Focus should return to opener
      const focusedElement = document.activeElement;
      expect(focusedElement).toBe(openerButton.element);
    });

    it("handles focus initialization when opening with selected value", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "option2",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Should focus on selected option (option2, index 1)
      expect(wrapper.vm.focusedIndex).toBe(1);
    });

    it("handles focus when readonly prop changes", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          readonly: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);

      // Change to readonly
      await wrapper.setProps({ readonly: true });
      await wrapper.vm.$nextTick();

      // Dropdown should close and focus return to opener
      expect(wrapper.vm.isOpen).toBe(false);
      const focusedElement = document.activeElement;
      expect(focusedElement).toBe(openerButton.element);
    });

    it("handles focus when disabled prop changes", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          disabled: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fzselect-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);

      // Change to disabled
      await wrapper.setProps({ disabled: true });
      await wrapper.vm.$nextTick();

      // Dropdown should close and focus return to opener
      expect(wrapper.vm.isOpen).toBe(false);
      const focusedElement = document.activeElement;
      expect(focusedElement).toBe(openerButton.element);
    });

    it("maintains focus trap when options change dynamically", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fzselect-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 1; // Last option
      await wrapper.vm.$nextTick();

      // Add more options dynamically
      await wrapper.setProps({
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
          { value: "option4", label: "Option 4" },
        ],
      });
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fzselect-options-container"]'
      ) as HTMLElement;
      
      // Tab should still work and wrap correctly
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBeGreaterThanOrEqual(0);
      expect(wrapper.vm.focusedIndex).toBeLessThan(4);
    });
  });

  describe("Exposed Methods", () => {
    it("exposes handlePickerClick method", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.vm.handlePickerClick).toBeDefined();
      expect(typeof wrapper.vm.handlePickerClick).toBe("function");
    });

    it("exposes forceOpen method", () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.vm.forceOpen).toBeDefined();
      expect(typeof wrapper.vm.forceOpen).toBe("function");
    });

    it("forceOpen method opens the dropdown", async () => {
      const wrapper = mount(FzSelect, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.vm.isOpen).toBe(false);
      await wrapper.vm.forceOpen();
      expect(wrapper.vm.isOpen).toBe(true);
    });
  });
});
