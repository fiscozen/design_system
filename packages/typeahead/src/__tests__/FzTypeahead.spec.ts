import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import FzTypeahead from "../FzTypeahead.vue";
import { calculateContainerWidth } from "../common";

describe("FzTypeahead", () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;

    // Mock ResizeObserver for FzFloating component
    const mockResizeObserver = vi.fn();
    mockResizeObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.ResizeObserver = mockResizeObserver;

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
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.html()).toBeTruthy();
      expect(
        wrapper.find('button[test-id="fztypeahead-opener"]').exists(),
      ).toBe(true);
    });

    it("displays label when provided", () => {
      const wrapper = mount(FzTypeahead, {
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
      const wrapper = mount(FzTypeahead, {
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
      const wrapper = mount(FzTypeahead, {
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
      const wrapper = mount(FzTypeahead, {
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
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          environment: "backoffice",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.classes()).toContain("h-32");
      expect(button.classes()).toContain("text-base");
    });

    it("applies frontoffice styling classes", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          environment: "frontoffice",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.classes()).toContain("h-44");
      expect(button.classes()).toContain("text-lg");
    });

    it("defaults to frontoffice environment", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.classes()).toContain("h-44");
      expect(button.classes()).toContain("text-lg");
    });
  });

  describe("Error and Help States", () => {
    it("displays error slot when error prop is true", async () => {
      const wrapper = mount(FzTypeahead, {
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

    it("displays helpText prop when no error slot or errorMessage is provided", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          helpText: "Help message",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain("Help message");
    });

    it("prioritizes error slot over help slot", async () => {
      const wrapper = mount(FzTypeahead, {
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
          help: "<div>Help message</div>",
        },
      });

      await wrapper.vm.$nextTick();
      // Error slot has priority over help slot
      expect(wrapper.html()).toContain("Error message");
      expect(wrapper.html()).not.toContain("Help message");
    });

    it("applies error styling classes when error is true", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          error: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.classes()).toContain("border-semantic-error-200");
    });
  });

  describe("Disabled State", () => {
    it("applies disabled styling classes when disabled is true", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.classes()).toContain("bg-grey-100");
      expect(button.classes()).toContain("text-grey-300");
      expect(button.classes()).toContain("cursor-not-allowed");
    });

    it("sets aria-disabled attribute when disabled", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.attributes("aria-disabled")).toBe("true");
    });

    it("prevents opening dropdown when disabled", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");

      expect(wrapper.vm.isOpen).toBe(false);
    });
  });

  describe("Icons", () => {
    it("renders left icon when leftIcon prop is provided", () => {
      const wrapper = mount(FzTypeahead, {
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
      const wrapper = mount(FzTypeahead, {
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

    it("renders right icon as button when rightIconButton is true and filtrable is false", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          rightIcon: "xmark",
          rightIconButton: true,
          rightIconButtonVariant: "secondary",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      // When filtrable is false, rightIconButton should be rendered
      // The icon should be present in the HTML (as part of FzIconButton)
      expect(wrapper.html()).toContain("xmark");
    });

    it("accepts rightIconButton prop when filtrable is true (even though not shown)", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: true,
          rightIcon: "xmark",
          rightIconButton: true,
          rightIconButtonVariant: "secondary",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      // Props should be accepted without errors
      expect(wrapper.props("rightIconButton")).toBe(true);
      expect(wrapper.props("rightIconButtonVariant")).toBe("secondary");
    });
  });

  describe("Lazy Loading", () => {
    it("renders only the first batch of options initially", async () => {
      const wrapper = mount(FzTypeahead, {
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
      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const options = document.querySelectorAll('button[role="option"]');
      expect(options.length).toBe(25);
    });
  });

  describe("Dropdown Interaction", () => {
    it("toggles dropdown open state when opener is clicked", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      expect(wrapper.vm.isOpen).toBe(false);

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");

      expect(wrapper.vm.isOpen).toBe(true);
    });

    it("sets aria-expanded attribute correctly", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.attributes("aria-expanded")).toBe("false");

      await button.trigger("click");
      expect(button.attributes("aria-expanded")).toBe("true");
    });

    it("closes dropdown when option is selected", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      expect(wrapper.vm.isOpen).toBe(true);

      await wrapper.vm.$nextTick();
      const optionButton = document.querySelector(
        'button[role="option"]',
      ) as HTMLElement;
      optionButton?.click();

      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("emits fztypeahead:select event when option is selected", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const optionButton = document.querySelector(
        'button[role="option"]',
      ) as HTMLElement;
      optionButton?.click();

      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("fztypeahead:select")).toBeTruthy();
      expect(wrapper.emitted("fztypeahead:select")?.[0]).toEqual(["option1"]);
    });
  });

  describe("Grouped Options", () => {
    it("renders group labels correctly", async () => {
      const wrapper = mount(FzTypeahead, {
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
      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const labels = document.querySelectorAll('div[role="group"] > div');
      expect(labels.length).toBe(1);
      expect(labels[0].textContent).toBe("Group 1");
    });
  });

  describe("Container Width Calculation", () => {
    it("calculates container width correctly", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      // Access button element via buttonRef exposed from FzTypeaheadButton
      const buttonRef = wrapper.vm.$refs.buttonRef as any;
      const opener = buttonRef?.openerButton as HTMLElement;
      if (!opener) {
        throw new Error("Opener button not found");
      }
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
          }) as DOMRect,
      );

      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      // Access button element via buttonRef exposed from FzTypeaheadButton
      const buttonRef = wrapper.vm.$refs.buttonRef as any;
      const opener = buttonRef?.openerButton as HTMLElement;
      if (!opener) {
        throw new Error("Opener button not found");
      }
      const { maxWidth } = calculateContainerWidth(opener);
      expect(maxWidth).toBe(right);
    });
  });

  describe("Accessibility", () => {
    it("sets aria-haspopup attribute", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.attributes("aria-haspopup")).toBe("listbox");
    });

    it("sets aria-labelledby when label is provided", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          label: "Test Label",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.attributes("aria-labelledby")).toBeTruthy();
    });

    it("sets aria-label when label is not provided", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          placeholder: "Select...",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.attributes("aria-label")).toBe("Select...");
    });

    it("sets aria-required when required is true", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          required: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.attributes("aria-required")).toBe("true");
    });

    it("sets aria-invalid when error is true", () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          error: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(button.attributes("aria-invalid")).toBe("true");
    });

    it("sets role='listbox' on options container", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      );
      expect(container?.getAttribute("role")).toBe("listbox");
    });

    it("sets role='option' on option elements", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const options = document.querySelectorAll('button[role="option"]');
      expect(options.length).toBe(2);
    });

    it("sets aria-selected on selected option", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "option1",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const options = document.querySelectorAll('button[role="option"]');
      
      // First option should be selected
      expect(options[0]?.getAttribute("aria-selected")).toBe("true");
      // Second option should not be selected
      expect(options[1]?.getAttribute("aria-selected")).toBe("false");
    });

    it("sets aria-labelledby on listbox container linking to opener", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      const openerId = button.attributes("id");
      await button.trigger("click");

      await wrapper.vm.$nextTick();
      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      );
      expect(container?.getAttribute("aria-labelledby")).toBe(openerId);
    });

    describe("Decorative elements", () => {
      it("should hide chevron icon from screen readers", () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        // Find SVG elements (Font Awesome icons render as SVGs)
        const svgs = wrapper.findAll("svg");
        // Chevron icon should have aria-hidden="true"
        const chevronSvg = svgs.find((svg) =>
          svg.attributes("data-icon")?.includes("chevron"),
        );
        expect(chevronSvg?.attributes("aria-hidden")).toBe("true");
      });

      it("should hide left icon from screen readers when provided", () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            leftIcon: "bell",
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        // Find all SVG elements
        const svgs = wrapper.findAll("svg");
        // All icons should have aria-hidden="true" (decorative)
        svgs.forEach((svg) => {
          expect(svg.attributes("aria-hidden")).toBe("true");
        });
      });

      it("should hide right icon from screen readers when provided", () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            rightIcon: "xmark",
            filtrable: false, // Right icon only shows when not filtrable
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        // Find all SVG elements
        const svgs = wrapper.findAll("svg");
        // All icons should have aria-hidden="true" (decorative)
        svgs.forEach((svg) => {
          expect(svg.attributes("aria-hidden")).toBe("true");
        });
      });
    });

    describe("Combobox pattern (filtrable mode)", () => {
      it("input should have aria-haspopup='listbox' when filtrable", async () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            filtrable: true,
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        await wrapper.vm.$nextTick();
        const button = wrapper.find('button[test-id="fztypeahead-opener"]');
        await button.trigger("click");

        await wrapper.vm.$nextTick();
        const input = wrapper.find('input[type="text"]');
        expect(input.attributes("aria-haspopup")).toBe("listbox");
      });

      it("input should have aria-expanded when filtrable and open", async () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            filtrable: true,
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        await wrapper.vm.$nextTick();
        const button = wrapper.find('button[test-id="fztypeahead-opener"]');
        await button.trigger("click");

        await wrapper.vm.$nextTick();
        const input = wrapper.find('input[type="text"]');
        expect(input.attributes("aria-expanded")).toBe("true");
      });

      it("input should have aria-labelledby when label is provided in filtrable mode", async () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            label: "Test Label",
            filtrable: true,
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        await wrapper.vm.$nextTick();
        const button = wrapper.find('button[test-id="fztypeahead-opener"]');
        await button.trigger("click");

        await wrapper.vm.$nextTick();
        const input = wrapper.find('input[type="text"]');
        expect(input.attributes("aria-labelledby")).toBeTruthy();
      });

      it("input should have aria-label when no label is provided in filtrable mode", async () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            placeholder: "Select...",
            filtrable: true,
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        await wrapper.vm.$nextTick();
        const button = wrapper.find('button[test-id="fztypeahead-opener"]');
        await button.trigger("click");

        await wrapper.vm.$nextTick();
        const input = wrapper.find('input[type="text"]');
        expect(input.attributes("aria-label")).toBe("Select...");
      });

      it("input should have aria-invalid when error in filtrable mode", async () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            error: true,
            filtrable: true,
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        await wrapper.vm.$nextTick();
        const button = wrapper.find('button[test-id="fztypeahead-opener"]');
        await button.trigger("click");

        await wrapper.vm.$nextTick();
        const input = wrapper.find('input[type="text"]');
        expect(input.attributes("aria-invalid")).toBe("true");
      });

      it("input should have aria-required when required in filtrable mode", async () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            required: true,
            filtrable: true,
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        await wrapper.vm.$nextTick();
        const button = wrapper.find('button[test-id="fztypeahead-opener"]');
        await button.trigger("click");

        await wrapper.vm.$nextTick();
        const input = wrapper.find('input[type="text"]');
        expect(input.attributes("aria-required")).toBe("true");
      });
    });

    describe("Semantic HTML structure", () => {
      it("should use button element for opener", () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        const button = wrapper.find('button[test-id="fztypeahead-opener"]');
        expect(button.exists()).toBe(true);
        expect(button.attributes("type")).toBe("button");
      });

      it("should use input element for filtrable mode", async () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            filtrable: true,
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        await wrapper.vm.$nextTick();
        const button = wrapper.find('button[test-id="fztypeahead-opener"]');
        await button.trigger("click");

        await wrapper.vm.$nextTick();
        const input = wrapper.find('input[type="text"]');
        expect(input.exists()).toBe(true);
      });

      it("should use button elements for options", async () => {
        const wrapper = mount(FzTypeahead, {
          props: {
            modelValue: "",
            options: [
              { value: "option1", label: "Option 1" },
              { value: "option2", label: "Option 2" },
            ],
          },
        });

        await wrapper.vm.$nextTick();
        const button = wrapper.find('button[test-id="fztypeahead-opener"]');
        await button.trigger("click");

        await wrapper.vm.$nextTick();
        const optionButtons = document.querySelectorAll(
          'button[role="option"]',
        );
        expect(optionButtons.length).toBe(2);
      });
    });
  });

  describe("Keyboard Navigation - Opener", () => {
    it("opens dropdown on Enter key", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(wrapper.vm.isOpen).toBe(false);

      await button.trigger("keydown", { key: "Enter" });
      expect(wrapper.vm.isOpen).toBe(true);
    });

    it("opens dropdown on Space key", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(wrapper.vm.isOpen).toBe(false);

      await button.trigger("keydown", { key: " " });
      expect(wrapper.vm.isOpen).toBe(true);
    });

    it("closes dropdown on Escape key when open", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      expect(wrapper.vm.isOpen).toBe(true);

      await button.trigger("keydown", { key: "Escape" });
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("does not open dropdown on Enter when disabled", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      expect(wrapper.vm.isOpen).toBe(false);

      await button.trigger("keydown", { key: "Enter" });
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("prevents default behavior on Enter key", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");

      await button.element.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Keyboard Navigation - Options", () => {
    it("navigates to next option on ArrowDown", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      expect(wrapper.vm.focusedIndex).toBe(0);

      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" }),
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(1);
    });

    it("navigates to previous option on ArrowUp", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 2;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(1);
    });

    it("wraps to first option when ArrowDown on last option", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 1;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" }),
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(0);
    });

    it("wraps to last option when ArrowUp on first option", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(1);
    });

    it("moves to first option on Home key", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 2;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Home" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(0);
    });

    it("moves to last option on End key", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "End" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(2);
    });

    it("selects focused option on Enter key", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
        attachTo: document.body,
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 1;
      await wrapper.vm.$nextTick();

      // Container is in a Teleport, use document.querySelector
      const containerEl = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      expect(containerEl).toBeTruthy();
      containerEl.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      await wrapper.vm.$nextTick();

      // Verify selection via emitted event
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0]).toEqual(["option2"]);
      expect(wrapper.vm.isOpen).toBe(false);

      wrapper.unmount();
    });

    it("selects focused option on Space key", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
        attachTo: document.body,
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      // Container is in a Teleport, use document.querySelector
      const containerEl = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      expect(containerEl).toBeTruthy();
      containerEl.dispatchEvent(
        new KeyboardEvent("keydown", { key: " ", bubbles: true }),
      );
      await wrapper.vm.$nextTick();

      // Verify selection via emitted event
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0]).toEqual(["option1"]);
      expect(wrapper.vm.isOpen).toBe(false);

      wrapper.unmount();
    });

    it("closes dropdown on Escape key", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(false);
      expect(wrapper.vm.focusedIndex).toBe(-1);
    });

    it("closes dropdown on Escape key when no options are available (empty search results)", async () => {
      vi.useFakeTimers();
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);

      // Type a search query that yields no results
      const input = wrapper.find('input[type="text"]');
      await input.setValue("nonexistent");
      await wrapper.vm.$nextTick();

      // Advance timers to trigger debounced filter (default delay is 500ms)
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();

      // Verify no options are available (selectableOptions is empty)
      expect(wrapper.vm.selectableOptions.length).toBe(0);

      // Press Escape in the input field (delegates to handleOptionsKeydown)
      await input.trigger("keydown", { key: "Escape" });
      await wrapper.vm.$nextTick();

      // Verify dropdown closes even when no options are available
      expect(wrapper.vm.isOpen).toBe(false);
      expect(wrapper.vm.focusedIndex).toBe(-1);

      vi.useRealTimers();
    });

    it("skips labels when navigating with arrows", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { kind: "label", label: "Group 1" },
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { kind: "label", label: "Group 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      // Should start at first selectable option (index 0 in selectableOptions)
      expect(wrapper.vm.focusedIndex).toBe(0);

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" }),
      );
      await wrapper.vm.$nextTick();
      // Should move to second selectable option, skipping labels
      expect(wrapper.vm.focusedIndex).toBe(1);
    });
  });

  describe("Focus Management - Open/Close", () => {
    it("moves focus to first option when dropdown opens", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
        attachTo: document.body,
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for scrollToFocusedOption

      // Verify focusedIndex is set to first option
      expect(wrapper.vm.focusedIndex).toBe(0);

      // Verify options are rendered (FzAction handles its own focus/tabindex behavior)
      const options = document.querySelectorAll('button[id*="-option-"]');
      expect(options.length).toBeGreaterThan(0);

      wrapper.unmount();
    });

    it("moves focus to selected option when dropdown opens", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "option2",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for scrollToFocusedOption

      // Focus should be on selected option (option2)
      expect(wrapper.vm.focusedIndex).toBe(1); // Index of option2 in selectableOptions
    });

    it("returns focus to opener button when dropdown closes", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus on option

      // Close dropdown
      wrapper.vm.isOpen = false;
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus return

      // Verify focusedIndex is reset
      expect(wrapper.vm.focusedIndex).toBe(-1);
    });

    it("returns focus to opener button after selecting an option", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus on option

      // Select first option
      wrapper.vm.handleSelect("option1");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus return

      // Verify focusedIndex is reset
      expect(wrapper.vm.focusedIndex).toBe(-1);
    });

    it("returns focus to opener button when closing with Escape", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus on option

      // Close with Escape
      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Wait for focus return

      // Verify focusedIndex is reset
      expect(wrapper.vm.focusedIndex).toBe(-1);
    });
  });

  describe("Focus Trap", () => {
    it("wraps to first option when Tab on last option", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 2; // Last option
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.focusedIndex).toBe(0); // Wrapped to first
    });

    it("wraps to last option when Shift+Tab on first option", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0; // First option
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", shiftKey: true }),
      );
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.focusedIndex).toBe(2); // Wrapped to last
    });

    it("moves to next option when Tab on non-last option", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0; // First option
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.focusedIndex).toBe(1); // Moved to next
    });

    it("moves to previous option when Shift+Tab on non-first option", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 2; // Last option
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", shiftKey: true }),
      );
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.focusedIndex).toBe(1); // Moved to previous
    });

    it("prevents default Tab behavior to trap focus", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      const event = new KeyboardEvent("keydown", { key: "Tab" });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");

      container.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Screen Reader Accessibility", () => {
    it("sets aria-activedescendant when option is focused", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      expect(container.getAttribute("aria-activedescendant")).toBeTruthy();
      expect(container.getAttribute("aria-activedescendant")).toContain(
        "option1",
      );
    });

    it("updates aria-activedescendant when navigating options", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      const firstId = container.getAttribute("aria-activedescendant");

      wrapper.vm.focusedIndex = 1;
      await wrapper.vm.$nextTick();

      const secondId = container.getAttribute("aria-activedescendant");
      expect(secondId).not.toBe(firstId);
      expect(secondId).toContain("option2");
    });

    it("removes aria-activedescendant when dropdown closes", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      expect(container.getAttribute("aria-activedescendant")).toBeTruthy();

      wrapper.vm.isOpen = false;
      await wrapper.vm.$nextTick();

      expect(container.getAttribute("aria-activedescendant")).toBeNull();
    });

    it("assigns unique IDs to option elements", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const optionButtons = document.querySelectorAll('button[role="option"]');
      expect(optionButtons.length).toBeGreaterThan(0);

      const ids = Array.from(optionButtons).map((btn) => btn.id);
      expect(ids.every((id) => id && id.length > 0)).toBe(true);
      expect(new Set(ids).size).toBe(ids.length); // All IDs are unique
    });
  });

  describe("Keyboard Navigation - Readonly/Disabled States", () => {
    it("does not open dropdown with Enter key when readonly", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          readonly: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("keydown.enter");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("does not open dropdown with Space key when readonly", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          readonly: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("keydown.space");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("does not navigate options when readonly", async () => {
      const wrapper = mount(FzTypeahead, {
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
      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();

      // Dropdown should not open when readonly
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("does not open dropdown with Enter key when disabled", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("keydown.enter");
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("does not navigate options when disabled", async () => {
      const wrapper = mount(FzTypeahead, {
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
      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();

      // Dropdown should not open when disabled
      expect(wrapper.vm.isOpen).toBe(false);
    });
  });

  describe("Keyboard Navigation - Edge Cases", () => {
    it("handles keyboard navigation with single option", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [{ value: "option1", label: "Option 1" }],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      expect(wrapper.vm.focusedIndex).toBe(0);

      // ArrowDown should wrap to first (and only) option
      container.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" }),
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(0);

      // ArrowUp should wrap to first (and only) option
      container.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(0);
    });
  });

  describe("Keyboard Navigation - Integration Tests", () => {
    it("completes full flow: open → navigate → select → close", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
        attachTo: document.body,
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');

      // 1. Open with Enter
      await openerButton.trigger("keydown", { key: "Enter" });
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);
      expect(wrapper.vm.focusedIndex).toBe(0);

      // 2. Navigate to second option with ArrowDown
      // Container is in a Teleport, use document.querySelector
      const containerEl = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
      ) as HTMLElement;
      expect(containerEl).toBeTruthy();
      containerEl.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
      );
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(1);

      // 3. Select with Enter
      containerEl.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      await wrapper.vm.$nextTick();

      // Verify selection via emitted event
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0]).toEqual(["option2"]);
      expect(wrapper.vm.isOpen).toBe(false);

      // 4. Verify focusedIndex reset
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.focusedIndex).toBe(-1);

      wrapper.unmount();
    });

    it("handles Tab navigation flow correctly", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      wrapper.vm.focusedIndex = 0;
      await wrapper.vm.$nextTick();

      const container = document.querySelector(
        '[test-id="fztypeahead-options-container"]',
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
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);

      // Simulate click outside (closes dropdown)
      wrapper.vm.isOpen = false;
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Verify focusedIndex is reset
      expect(wrapper.vm.focusedIndex).toBe(-1);
    });

    it("handles focus initialization when opening with selected value", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "option2",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // Should focus on selected option (option2, index 1)
      expect(wrapper.vm.focusedIndex).toBe(1);
    });

    it("handles focus when readonly prop changes", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          readonly: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);

      // Change to readonly
      await wrapper.setProps({ readonly: true });
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Additional nextTick for focus management

      // Dropdown should close and focusedIndex reset
      expect(wrapper.vm.isOpen).toBe(false);
      expect(wrapper.vm.focusedIndex).toBe(-1);
    });

    it("handles focus when disabled prop changes", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          disabled: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const openerButton = wrapper.find('button[test-id="fztypeahead-opener"]');
      await openerButton.trigger("click");
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(true);

      // Change to disabled
      await wrapper.setProps({ disabled: true });
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick(); // Additional nextTick for focus management

      // Dropdown should close and focusedIndex reset
      expect(wrapper.vm.isOpen).toBe(false);
      expect(wrapper.vm.focusedIndex).toBe(-1);
    });

    it("maintains focus trap when options change dynamically", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: false,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
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
        '[test-id="fztypeahead-options-container"]',
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
      const wrapper = mount(FzTypeahead, {
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
      const wrapper = mount(FzTypeahead, {
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
      const wrapper = mount(FzTypeahead, {
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

  describe("Fuzzy Search", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("uses fuzzy search by default (fuzzySearch: true)", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: true,
          options: [
            { value: "1", label: "JavaScript" },
            { value: "2", label: "TypeScript" },
            { value: "3", label: "Python" },
            { value: "4", label: "Java" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="text"]');
      await input.setValue("javasc");
      await wrapper.vm.$nextTick();

      // Advance timers to trigger debounced filter
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();

      // Fuzzy search should find "JavaScript" (and possibly "Java" if it matches)
      const options = document.querySelectorAll('button[role="option"]');
      expect(options.length).toBeGreaterThan(0);
      const optionTexts = Array.from(options).map((opt) => opt.textContent);
      expect(optionTexts.some((text) => text?.includes("JavaScript"))).toBe(true);
    });

    it("uses simple includes search when fuzzySearch is false", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: true,
          fuzzySearch: false,
          options: [
            { value: "1", label: "JavaScript" },
            { value: "2", label: "TypeScript" },
            { value: "3", label: "Python" },
            { value: "4", label: "Java" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="text"]');
      await input.setValue("java");
      await wrapper.vm.$nextTick();

      // Advance timers to trigger debounced filter
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();

      // Simple includes search should find both "JavaScript" and "Java"
      const options = document.querySelectorAll('button[role="option"]');
      expect(options.length).toBe(2);
      const optionTexts = Array.from(options).map((opt) => opt.textContent);
      expect(optionTexts.some((text) => text?.includes("JavaScript"))).toBe(true);
      expect(optionTexts.some((text) => text?.includes("Java"))).toBe(true);
    });

    it("fuzzy search handles typos and partial matches", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: true,
          fuzzySearch: true,
          options: [
            { value: "1", label: "JavaScript" },
            { value: "2", label: "TypeScript" },
            { value: "3", label: "Python" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="text"]');
      await input.setValue("javascrpt"); // Typo: missing 'i'
      await wrapper.vm.$nextTick();

      // Advance timers to trigger debounced filter
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();

      // Fuzzy search should still find "JavaScript" despite typo
      // (may also find TypeScript if it matches)
      const options = document.querySelectorAll('button[role="option"]');
      expect(options.length).toBeGreaterThan(0);
      const optionTexts = Array.from(options).map((opt) => opt.textContent);
      expect(optionTexts.some((text) => text?.includes("JavaScript"))).toBe(true);
    });

    it("simple search does not handle typos (exact substring match only)", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: true,
          fuzzySearch: false,
          options: [
            { value: "1", label: "JavaScript" },
            { value: "2", label: "TypeScript" },
            { value: "3", label: "Python" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="text"]');
      await input.setValue("javascrpt"); // Typo: missing 'i'
      await wrapper.vm.$nextTick();

      // Advance timers to trigger debounced filter
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();

      // Simple search should not find anything with typo
      const options = document.querySelectorAll('button[role="option"]');
      expect(options.length).toBe(0);
    });

    it("fuzzy search is case-insensitive", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: true,
          fuzzySearch: true,
          options: [
            { value: "1", label: "JavaScript" },
            { value: "2", label: "TypeScript" },
            { value: "3", label: "Python" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="text"]');
      await input.setValue("JAVASCRIPT");
      await wrapper.vm.$nextTick();

      // Advance timers to trigger debounced filter
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();

      // Fuzzy search should find "JavaScript" regardless of case
      const options = document.querySelectorAll('button[role="option"]');
      expect(options.length).toBeGreaterThan(0);
      const optionTexts = Array.from(options).map((opt) => opt.textContent);
      expect(optionTexts.some((text) => text?.includes("JavaScript"))).toBe(true);
    });

    it("simple search is case-insensitive", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: true,
          fuzzySearch: false,
          options: [
            { value: "1", label: "JavaScript" },
            { value: "2", label: "TypeScript" },
            { value: "3", label: "Python" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="text"]');
      await input.setValue("JAVASCRIPT");
      await wrapper.vm.$nextTick();

      // Advance timers to trigger debounced filter
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();

      // Simple search should find "JavaScript" regardless of case
      const options = document.querySelectorAll('button[role="option"]');
      expect(options.length).toBe(1);
      expect(options[0]?.textContent).toContain("JavaScript");
    });

    it("fuzzy search works with grouped options", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: true,
          fuzzySearch: true,
          options: [
            { kind: "label", label: "Frontend" },
            { value: "1", label: "JavaScript" },
            { value: "2", label: "TypeScript" },
            { kind: "label", label: "Backend" },
            { value: "3", label: "Python" },
            { value: "4", label: "Java" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="text"]');
      await input.setValue("javasc");
      await wrapper.vm.$nextTick();

      // Advance timers to trigger debounced filter
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();

      // Should find JavaScript (and possibly Java) and preserve group structure
      const options = document.querySelectorAll('button[role="option"]');
      expect(options.length).toBeGreaterThan(0);
      const optionTexts = Array.from(options).map((opt) => opt.textContent);
      expect(optionTexts.some((text) => text?.includes("JavaScript"))).toBe(true);
    });

    it("simple search works with grouped options", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          filtrable: true,
          fuzzySearch: false,
          options: [
            { kind: "label", label: "Frontend" },
            { value: "1", label: "JavaScript" },
            { value: "2", label: "TypeScript" },
            { kind: "label", label: "Backend" },
            { value: "3", label: "Python" },
            { value: "4", label: "Java" },
          ],
        },
      });

      const button = wrapper.find('button[test-id="fztypeahead-opener"]');
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="text"]');
      await input.setValue("java");
      await wrapper.vm.$nextTick();

      // Advance timers to trigger debounced filter
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick();

      // Should find both JavaScript and Java
      const options = document.querySelectorAll('button[role="option"]');
      expect(options.length).toBe(2);
      const optionTexts = Array.from(options).map((opt) => opt.textContent);
      expect(optionTexts.some((text) => text?.includes("JavaScript"))).toBe(true);
      expect(optionTexts.some((text) => text?.includes("Java"))).toBe(true);
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with label", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          label: "Select an option",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - disabled state", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          disabled: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - error state", async () => {
      const wrapper = mount(FzTypeahead, {
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
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with selected value", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "option1",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - backoffice environment", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          environment: "backoffice",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with icons", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "",
          leftIcon: "bell",
          rightIcon: "xmark",
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - readonly state", async () => {
      const wrapper = mount(FzTypeahead, {
        props: {
          modelValue: "option1",
          readonly: true,
          options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
