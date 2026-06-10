import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { FzInput } from "..";

const NUMBER_OF_INPUTS = 1000;

describe("FzInput", () => {
  describe("Rendering", () => {
    it("renders label", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
        },
        slots: {},
      });

      expect(wrapper.text()).toContain("Label");
    });

    it("renders leftIcon", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          leftIcon: "calendar-lines",
        },
        slots: {},
      });

      expect(wrapper.find(".fa-calendar-lines")).toBeTruthy();
    });

    it("renders rightIcon", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          rightIcon: "credit-card",
        },
        slots: {},
      });

      expect(wrapper.find(".fa-credit-card")).toBeTruthy();
    });

    it("renders helpText", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
        },
        slots: {
          helpText: "This is a helper text",
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("This is a helper text");
    });

    it("renders errorMessage", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          error: true,
        },
        slots: {
          errorMessage: "This is an error message",
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("This is an error message");
    });
  });

  describe("Input types", () => {
    it("renders email type", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          type: "email",
        },
        slots: {},
      });

      expect(wrapper.find("input").attributes("type")).toBe("email");
    });

    it("renders tel type", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          type: "tel",
        },
        slots: {},
      });

      expect(wrapper.find("input").attributes("type")).toBe("tel");
    });

    it("renders password type", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          type: "password",
        },
        slots: {},
      });

      expect(wrapper.find("input").attributes("type")).toBe("password");
    });
  });

  describe("Input states", () => {
    it("renders disabled", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          disabled: true,
        },
        slots: {},
      });

      expect(wrapper.find("input").attributes("disabled")).toBe("");
    });

    it("renders required", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          required: true,
        },
        slots: {},
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.find("input").attributes("required")).toBe("");
      expect(wrapper.text()).toContain("*");
    });

    it('applies autocomplete="off" by default', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
        },
        slots: {},
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.find("input").attributes("autocomplete")).toBe("off");
    });

    it('applies autocomplete="off" when autocomplete is false', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          autocomplete: false,
        },
        slots: {},
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.find("input").attributes("autocomplete")).toBe("off");
    });

    it('applies autocomplete="on" when autocomplete is true', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          autocomplete: true,
        },
        slots: {},
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.find("input").attributes("autocomplete")).toBe("on");
    });
  });

  describe("Events", () => {
    it("emits fzinput:right-icon-click event", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          rightIcon: "eye",
        },
        slots: {},
      });

      await wrapper.find(".fa-eye").trigger("click");

      expect(wrapper.emitted("fzinput:right-icon-click")).toBeTruthy();
    });

    it("emits fzinput:left-icon-click event", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          leftIcon: "eye",
        },
        slots: {},
      });

      await wrapper.find(".fa-eye").trigger("click");

      expect(wrapper.emitted("fzinput:left-icon-click")).toBeTruthy();
    });

    it("does not emit fzinput:right-icon-click event when disabled", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          rightIcon: "eye",
          disabled: true,
        },
        slots: {},
      });

      await wrapper.find(".fa-eye").trigger("click");

      expect(wrapper.emitted("fzinput:right-icon-click")).toBeFalsy();
    });

    it("does not emit fzinput:right-icon-click event when readonly", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          rightIcon: "eye",
          readonly: true,
        },
        slots: {},
      });

      await wrapper.find(".fa-eye").trigger("click");

      expect(wrapper.emitted("fzinput:right-icon-click")).toBeFalsy();
    });

    it("does not emit fzinput:left-icon-click event when disabled", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          leftIcon: "eye",
          disabled: true,
        },
        slots: {},
      });

      await wrapper.find(".fa-eye").trigger("click");

      expect(wrapper.emitted("fzinput:left-icon-click")).toBeFalsy();
    });

    it("does not emit fzinput:left-icon-click event when readonly", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          leftIcon: "eye",
          readonly: true,
        },
        slots: {},
      });

      await wrapper.find(".fa-eye").trigger("click");

      expect(wrapper.emitted("fzinput:left-icon-click")).toBeFalsy();
    });

    it("does not emit fzinput:second-right-icon-click event when disabled", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          secondRightIcon: "eye",
          disabled: true,
        },
        slots: {},
      });

      await wrapper.find(".fa-eye").trigger("click");

      expect(wrapper.emitted("fzinput:second-right-icon-click")).toBeFalsy();
    });

    it("does not emit fzinput:second-right-icon-click event when readonly", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          secondRightIcon: "eye",
          readonly: true,
        },
        slots: {},
      });

      await wrapper.find(".fa-eye").trigger("click");

      expect(wrapper.emitted("fzinput:second-right-icon-click")).toBeFalsy();
    });

    it("does not emit fzinput:right-icon-click event when disabled and rightIconButton is true", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          rightIcon: "eye",
          rightIconButton: true,
          disabled: true,
        },
        slots: {},
      });

      const button = wrapper.findComponent({ name: "FzIconButton" });
      await button.trigger("click");

      expect(wrapper.emitted("fzinput:right-icon-click")).toBeFalsy();
    });

    it("does not emit fzinput:second-right-icon-click event when disabled and secondRightIconButton is true", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          secondRightIcon: "eye",
          secondRightIconButton: true,
          disabled: true,
        },
        slots: {},
      });

      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      await buttons[0].trigger("click");

      expect(wrapper.emitted("fzinput:second-right-icon-click")).toBeFalsy();
    });
  });

  describe("Accessibility", () => {
    describe("Input ARIA attributes", () => {
      it("applies aria-required when required is true", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            required: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        expect(input.getAttribute("aria-required")).toBe("true");
      });

      it('applies aria-required="false" when required is false', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            required: false,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        expect(input.getAttribute("aria-required")).toBe("false");
      });

      it("applies aria-invalid when error is true", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            error: true,
          },
          slots: {
            errorMessage: "Error message",
          },
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        expect(input.getAttribute("aria-invalid")).toBe("true");
      });

      it('applies aria-invalid="false" when error is false', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            error: false,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        expect(input.getAttribute("aria-invalid")).toBe("false");
      });

      it("applies aria-disabled when disabled is true", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            disabled: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        expect(input.getAttribute("aria-disabled")).toBe("true");
      });

      it('applies aria-disabled="false" when disabled is false', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            disabled: false,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        expect(input.getAttribute("aria-disabled")).toBe("false");
      });

      it("applies aria-labelledby when label is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Test Label",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        const labelId = input.getAttribute("aria-labelledby");
        expect(labelId).toBeTruthy();

        // Verify label element exists with matching id
        const label = wrapper.find("label").element as HTMLLabelElement;
        expect(label.getAttribute("id")).toBe(labelId);
      });

      it("does not apply aria-labelledby when label is not provided", async () => {
        const wrapper = mount(FzInput, {
          props: {},
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        expect(input.getAttribute("aria-labelledby")).toBeNull();
      });

      it("does not apply aria-labelledby when custom label slot is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Test Label",
          },
          slots: {
            label: () => "Custom Label Slot",
          },
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        const ariaLabelledBy = input.getAttribute("aria-labelledby");

        // aria-labelledby should not be set because the default label element
        // with id="${uniqueId}-label" doesn't exist when custom slot is used
        expect(ariaLabelledBy).toBeNull();

        // Verify default label element is not rendered
        const defaultLabel = wrapper.find("label");
        expect(defaultLabel.exists()).toBe(false);
      });

      it("applies aria-describedby when helpText slot is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
          },
          slots: {
            helpText: "Help text",
          },
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        const describedBy = input.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();

        // Verify help text element exists with matching id
        const helpText = wrapper.find(`#${describedBy}`);
        expect(helpText.exists()).toBe(true);
        expect(helpText.text()).toContain("Help text");
      });

      it("applies aria-describedby when errorMessage slot is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            error: true,
          },
          slots: {
            errorMessage: "Error message",
          },
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        const describedBy = input.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();

        // Verify error message element exists with matching id
        const errorMessage = wrapper.find(`#${describedBy}`);
        expect(errorMessage.exists()).toBe(true);
        expect(errorMessage.text()).toContain("Error message");
      });

      it("does not apply aria-describedby when neither helpText nor errorMessage are provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const input = wrapper.find("input").element as HTMLInputElement;
        expect(input.getAttribute("aria-describedby")).toBeNull();
      });
    });

    describe("Error message accessibility", () => {
      it('applies role="alert" to error message container', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            error: true,
          },
          slots: {
            errorMessage: "Error message",
          },
        });

        await wrapper.vm.$nextTick();

        const errorContainer = wrapper.find('[role="alert"]');
        expect(errorContainer.exists()).toBe(true);
        expect(errorContainer.text()).toContain("Error message");
      });

      it("does not render error container when error is false", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            error: false,
          },
          slots: {
            errorMessage: "Error message",
          },
        });

        await wrapper.vm.$nextTick();

        const errorContainer = wrapper.find('[role="alert"]');
        expect(errorContainer.exists()).toBe(false);
      });
    });

    describe("Decorative icons accessibility", () => {
      it('applies aria-hidden="true" to valid checkmark icon', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            valid: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find the check icon (FzIcon with name="check")
        const checkIcons = wrapper.findAllComponents({ name: "FzIcon" });
        const checkIcon = checkIcons.find(
          (icon) => icon.props("name") === "check",
        );

        expect(checkIcon?.exists()).toBe(true);
        const rootElement = checkIcon?.element as HTMLElement;
        expect(rootElement.getAttribute("aria-hidden")).toBe("true");
      });

      it('applies aria-hidden="true" to error icon', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            error: true,
          },
          slots: {
            errorMessage: "Error message",
          },
        });

        await wrapper.vm.$nextTick();

        // Find the error icon (FzIcon with name="circle-xmark")
        const errorIcons = wrapper.findAllComponents({ name: "FzIcon" });
        const errorIcon = errorIcons.find(
          (icon) => icon.props("name") === "circle-xmark",
        );

        expect(errorIcon?.exists()).toBe(true);
        const rootElement = errorIcon?.element as HTMLElement;
        expect(rootElement.getAttribute("aria-hidden")).toBe("true");
      });
    });

    describe("Container accessibility", () => {
      it('applies tabindex="0" to container when not disabled', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.getAttribute("tabindex")).toBe("0");
      });

      it("removes tabindex from container when disabled", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            disabled: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.getAttribute("tabindex")).toBeNull();
      });

      it("removes tabindex from container when readonly", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            readonly: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.getAttribute("tabindex")).toBeNull();
      });
    });

    describe("Left icon accessibility", () => {
      it("applies accessibility attributes when leftIconAriaLabel is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            leftIcon: "calendar-lines",
            leftIconAriaLabel: "Open calendar",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find the FzIcon component wrapper div (root element)
        const iconComponent = wrapper.findComponent({ name: "FzIcon" });
        expect(iconComponent.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement;

        // Verify attributes are on the root element
        expect(rootElement.getAttribute("role")).toBe("button");
        expect(rootElement.getAttribute("aria-label")).toBe("Open calendar");
        expect(rootElement.getAttribute("tabindex")).toBe("0");
      });

      it("does not apply accessibility attributes when leftIconAriaLabel is not provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            leftIcon: "calendar-lines",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: "FzIcon" });
        expect(iconComponent.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement;

        // Verify attributes are not on the root element
        expect(rootElement.getAttribute("role")).toBeNull();
        expect(rootElement.getAttribute("aria-label")).toBeNull();
        expect(rootElement.getAttribute("tabindex")).toBeNull();
      });

      it("removes tabindex when disabled and leftIconAriaLabel is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            leftIcon: "calendar-lines",
            leftIconAriaLabel: "Open calendar",
            disabled: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: "FzIcon" });
        expect(iconComponent.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement;

        // Verify attributes are on the root element
        expect(rootElement.getAttribute("role")).toBe("button");
        expect(rootElement.getAttribute("aria-label")).toBe("Open calendar");
        expect(rootElement.getAttribute("tabindex")).toBeNull(); // Removed when disabled
        expect(rootElement.getAttribute("aria-disabled")).toBe("true");
      });

      it("has keyboard handler when leftIconAriaLabel is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            leftIcon: "calendar-lines",
            leftIconAriaLabel: "Open calendar",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: "FzIcon" });
        expect(iconComponent.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement;

        // Verify icon is keyboard accessible (has tabindex)
        expect(rootElement.getAttribute("tabindex")).toBe("0");
        // Keyboard interaction is tested in Storybook play functions
      });
    });

    describe("Right icon accessibility", () => {
      it("applies accessibility attributes when rightIconAriaLabel is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            rightIcon: "eye",
            rightIconAriaLabel: "Toggle visibility",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find the FzIcon component wrapper (not the inner img)
        const iconComponent = wrapper.findComponent({ name: "FzIcon" });
        expect(iconComponent.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement;

        // Verify attributes are on the root element
        expect(rootElement.getAttribute("role")).toBe("button");
        expect(rootElement.getAttribute("aria-label")).toBe(
          "Toggle visibility",
        );
        expect(rootElement.getAttribute("tabindex")).toBe("0");
      });

      it("does not apply accessibility attributes when rightIconAriaLabel is not provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            rightIcon: "eye",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: "FzIcon" });
        expect(iconComponent.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement;

        // Verify attributes are not on the root element
        expect(rootElement.getAttribute("role")).toBeNull();
        expect(rootElement.getAttribute("aria-label")).toBeNull();
        expect(rootElement.getAttribute("tabindex")).toBeNull();
      });

      it("removes tabindex when disabled and rightIconAriaLabel is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            rightIcon: "eye",
            rightIconAriaLabel: "Toggle visibility",
            disabled: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: "FzIcon" });
        expect(iconComponent.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement;

        // Verify attributes are on the root element
        expect(rootElement.getAttribute("role")).toBe("button");
        expect(rootElement.getAttribute("aria-label")).toBe(
          "Toggle visibility",
        );
        expect(rootElement.getAttribute("tabindex")).toBeNull(); // Removed when disabled
        expect(rootElement.getAttribute("aria-disabled")).toBe("true");
      });

      it("removes tabindex when readonly and rightIconAriaLabel is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            rightIcon: "eye",
            rightIconAriaLabel: "Toggle visibility",
            readonly: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: "FzIcon" });
        expect(iconComponent.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement;

        // Verify attributes are on the root element
        expect(rootElement.getAttribute("role")).toBe("button");
        expect(rootElement.getAttribute("aria-label")).toBe(
          "Toggle visibility",
        );
        expect(rootElement.getAttribute("tabindex")).toBeNull(); // Removed when readonly
        expect(rootElement.getAttribute("aria-disabled")).toBe("true");
      });

      it("does not apply accessibility attributes when rightIconButton is true", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            rightIcon: "eye",
            rightIconButton: true,
            rightIconAriaLabel: "Toggle visibility",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // When rightIconButton is true, FzIconButton is used instead of FzIcon
        const iconButton = wrapper.findComponent({ name: "FzIconButton" });
        expect(iconButton.exists()).toBe(true);
      });

      it("has keyboard handler when rightIconAriaLabel is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            rightIcon: "eye",
            rightIconAriaLabel: "Toggle visibility",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: "FzIcon" });
        expect(iconComponent.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement;

        // Verify icon is keyboard accessible (has tabindex)
        expect(rootElement.getAttribute("tabindex")).toBe("0");
        // Keyboard interaction is tested in Storybook play functions
      });
    });

    describe("Second right icon accessibility", () => {
      it("applies accessibility attributes when secondRightIconAriaLabel is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            secondRightIcon: "info-circle",
            secondRightIconAriaLabel: "Show information",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find all FzIcon components and get the one with secondRightIcon
        const iconComponents = wrapper.findAllComponents({ name: "FzIcon" });
        const secondIconComponent = iconComponents.find(
          (icon) => icon.props("name") === "info-circle",
        );

        expect(secondIconComponent?.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = secondIconComponent?.element as HTMLElement;

        // Verify attributes are on the root element
        expect(rootElement.getAttribute("role")).toBe("button");
        expect(rootElement.getAttribute("aria-label")).toBe("Show information");
        expect(rootElement.getAttribute("tabindex")).toBe("0");
      });

      it("removes tabindex when readonly and secondRightIconAriaLabel is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            secondRightIcon: "info-circle",
            secondRightIconAriaLabel: "Show information",
            readonly: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find all FzIcon components and get the one with secondRightIcon
        const iconComponents = wrapper.findAllComponents({ name: "FzIcon" });
        const secondIconComponent = iconComponents.find(
          (icon) => icon.props("name") === "info-circle",
        );

        expect(secondIconComponent?.exists()).toBe(true);

        // Get the root element (div wrapper)
        const rootElement = secondIconComponent?.element as HTMLElement;

        // Verify attributes are on the root element
        expect(rootElement.getAttribute("role")).toBe("button");
        expect(rootElement.getAttribute("aria-label")).toBe("Show information");
        expect(rootElement.getAttribute("tabindex")).toBeNull(); // Removed when readonly
        expect(rootElement.getAttribute("aria-disabled")).toBe("true");
      });
    });

    describe("Right icons order", () => {
      it("renders valid checkmark as last icon when all icons are present", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            valid: true,
            secondRightIcon: "info-circle",
            rightIcon: "envelope",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        // Find all FzIcon components in the right-icon slot
        const iconComponents = wrapper.findAllComponents({ name: "FzIcon" });
        const validIcon = iconComponents.find(
          (icon) => icon.props("name") === "check",
        );
        const secondIcon = iconComponents.find(
          (icon) => icon.props("name") === "info-circle",
        );
        const rightIcon = iconComponents.find(
          (icon) => icon.props("name") === "envelope",
        );

        expect(validIcon?.exists()).toBe(true);
        expect(secondIcon?.exists()).toBe(true);
        expect(rightIcon?.exists()).toBe(true);

        // Get the container div that wraps all right icons
        const rightIconContainer = wrapper.find(
          ".fz-input > div > div.flex.items-center.gap-4",
        );
        expect(rightIconContainer.exists()).toBe(true);

        // Get all icon elements in order
        const icons = rightIconContainer.findAllComponents({ name: "FzIcon" });
        expect(icons.length).toBeGreaterThanOrEqual(3);

        // Verify order: secondRightIcon, rightIcon, valid (check)
        const iconNames = icons.map((icon) => icon.props("name"));
        const secondIndex = iconNames.indexOf("info-circle");
        const rightIndex = iconNames.indexOf("envelope");
        const validIndex = iconNames.indexOf("check");

        expect(secondIndex).toBeLessThan(rightIndex);
        expect(rightIndex).toBeLessThan(validIndex);
      });
    });
  });

  describe("Attribute forwarding (inheritAttrs: false)", () => {
    it("applies consumer class to root wrapper div", async () => {
      const wrapper = mount(FzInput, {
        props: { label: "Label" },
        attrs: { class: "max-w-xs custom-class" },
      });

      await wrapper.vm.$nextTick();

      const rootDiv = wrapper.element as HTMLElement;
      expect(rootDiv.classList.contains("max-w-xs")).toBe(true);
      expect(rootDiv.classList.contains("custom-class")).toBe(true);
      expect(rootDiv.classList.contains("fz-input")).toBe(true);
    });

    it("does not apply consumer class to native input element", async () => {
      const wrapper = mount(FzInput, {
        props: { label: "Label" },
        attrs: { class: "max-w-xs" },
      });

      await wrapper.vm.$nextTick();

      const input = wrapper.find("input").element as HTMLInputElement;
      expect(input.classList.contains("max-w-xs")).toBe(false);
    });

    it("forwards data-* attributes to native input element", async () => {
      const wrapper = mount(FzInput, {
        props: { label: "Label" },
        attrs: { "data-cy": "my-input", "data-testid": "test-input" },
      });

      await wrapper.vm.$nextTick();

      const input = wrapper.find("input").element as HTMLInputElement;
      expect(input.getAttribute("data-cy")).toBe("my-input");
      expect(input.getAttribute("data-testid")).toBe("test-input");

      const rootDiv = wrapper.element as HTMLElement;
      expect(rootDiv.getAttribute("data-cy")).toBeNull();
    });

    it("forwards consumer aria-* attributes to native input element", async () => {
      const wrapper = mount(FzInput, {
        props: { label: "Label" },
        attrs: {
          "aria-expanded": "true",
          "aria-haspopup": "listbox",
        },
      });

      await wrapper.vm.$nextTick();

      const input = wrapper.find("input").element as HTMLInputElement;
      expect(input.getAttribute("aria-expanded")).toBe("true");
      expect(input.getAttribute("aria-haspopup")).toBe("listbox");

      const rootDiv = wrapper.element as HTMLElement;
      expect(rootDiv.getAttribute("aria-expanded")).toBeNull();
      expect(rootDiv.getAttribute("aria-haspopup")).toBeNull();
    });
  });

  describe("Visual emphasis states", () => {
    describe("Highlighted state", () => {
      it("applies highlighted container classes when highlighted is true", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );
        expect(
          container.classList.contains("border-semantic-warning-200"),
        ).toBe(true);
        expect(container.classList.contains("ring-2")).toBe(true);
        expect(container.classList.contains("ring-semantic-warning-100")).toBe(
          true,
        );
      });

      it("works with backoffice environment", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
            environment: "backoffice",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("h-32")).toBe(true);
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );
      });

      it("works with floating-label variant", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
            variant: "floating-label",
            placeholder: "Placeholder",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );
        expect(container.classList.contains("h-44")).toBe(true);
      });
    });

    describe("AIreasoning state", () => {
      it("applies aiReasoning container classes when aiReasoning is true", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-purple-50")).toBe(true);
        expect(container.classList.contains("border-purple-600")).toBe(true);
        expect(container.classList.contains("ring-2")).toBe(true);
        expect(container.classList.contains("ring-purple-200")).toBe(true);
      });

      it("auto-renders sparkles icon when aiReasoning is true", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const icons = wrapper.findAllComponents({ name: "FzIcon" });
        const sparklesIcon = icons.find(
          (icon: any) => icon.props("name") === "sparkles",
        );
        expect(sparklesIcon?.exists()).toBe(true);
        expect(sparklesIcon?.props("variant")).toBe("fas");

        const rootElement = sparklesIcon?.element as HTMLElement;
        expect(rootElement.getAttribute("aria-hidden")).toBe("true");
      });

      it("does not render sparkles when leftIcon is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
            leftIcon: "search",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const icons = wrapper.findAllComponents({ name: "FzIcon" });
        const sparklesIcon = icons.find(
          (icon) => icon.props("name") === "sparkles",
        );
        expect(sparklesIcon).toBeUndefined();

        const searchIcon = icons.find(
          (icon) => icon.props("name") === "search",
        );
        expect(searchIcon?.exists()).toBe(true);
      });

      it("does not render sparkles when left-icon slot is provided", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
          },
          slots: {
            "left-icon": '<span data-testid="custom-icon">Custom</span>',
          },
        });

        await wrapper.vm.$nextTick();

        const icons = wrapper.findAllComponents({ name: "FzIcon" });
        const sparklesIcon = icons.find(
          (icon) => icon.props("name") === "sparkles",
        );
        expect(sparklesIcon).toBeUndefined();

        const customIcon = wrapper.find('[data-testid="custom-icon"]');
        expect(customIcon.exists()).toBe(true);
      });

      it("sparkles icon has purple color by default", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const icons = wrapper.findAllComponents({ name: "FzIcon" });
        const sparklesIcon = icons.find(
          (icon) => icon.props("name") === "sparkles",
        );
        const rootElement = sparklesIcon?.element as HTMLElement;
        expect(rootElement.classList.contains("text-purple-600")).toBe(true);
      });

      it("sparkles icon is muted when error is true", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
            error: true,
          },
          slots: {
            errorMessage: "Error message",
          },
        });

        await wrapper.vm.$nextTick();

        const icons = wrapper.findAllComponents({ name: "FzIcon" });
        const sparklesIcon = icons.find(
          (icon) => icon.props("name") === "sparkles",
        );
        const rootElement = sparklesIcon?.element as HTMLElement;
        expect(rootElement.classList.contains("text-grey-300")).toBe(true);
      });

      it("sparkles icon is muted when disabled", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
            disabled: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const icons = wrapper.findAllComponents({ name: "FzIcon" });
        const sparklesIcon = icons.find(
          (icon) => icon.props("name") === "sparkles",
        );
        const rootElement = sparklesIcon?.element as HTMLElement;
        expect(rootElement.classList.contains("text-grey-300")).toBe(true);
      });

      it("works with floating-label variant", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
            variant: "floating-label",
            placeholder: "Placeholder",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-purple-50")).toBe(true);
        expect(container.classList.contains("h-44")).toBe(true);
      });
    });

    describe("State priority", () => {
      it("error overrides highlighted", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
            error: true,
          },
          slots: {
            errorMessage: "Error message",
          },
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("border-semantic-error-200")).toBe(
          true,
        );
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          false,
        );
        expect(container.classList.contains("ring-2")).toBe(false);
      });

      it("error overrides aiReasoning", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
            error: true,
          },
          slots: {
            errorMessage: "Error message",
          },
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("border-semantic-error-200")).toBe(
          true,
        );
        expect(container.classList.contains("bg-purple-50")).toBe(false);
        expect(container.classList.contains("ring-2")).toBe(false);
      });

      it("disabled overrides highlighted", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
            disabled: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-grey-100")).toBe(true);
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          false,
        );
        expect(container.classList.contains("ring-2")).toBe(false);
      });

      it("disabled overrides aiReasoning", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
            disabled: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-grey-100")).toBe(true);
        expect(container.classList.contains("bg-purple-50")).toBe(false);
        expect(container.classList.contains("ring-2")).toBe(false);
      });

      it("readonly overrides highlighted", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
            readonly: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-grey-100")).toBe(true);
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          false,
        );
      });

      it("highlighted takes priority over aiReasoning when both are set", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
            aiReasoning: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );
        expect(container.classList.contains("bg-purple-50")).toBe(false);
      });
    });
  });

  describe("User input resets emphasis", () => {
    const findSparkles = (wrapper: ReturnType<typeof mount>) => {
      const icons = wrapper.findAllComponents({ name: "FzIcon" });
      return icons.find((icon: any) => icon.props("name") === "sparkles");
    };

    describe("programmatic modelValue change preserves emphasis", () => {
      it("highlighted styling persists after programmatic value change", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
            modelValue: "",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();
        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );

        await wrapper.setProps({ modelValue: "programmatic value" });

        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );
        expect(container.classList.contains("ring-semantic-warning-100")).toBe(
          true,
        );
        expect(wrapper.emitted("update:highlighted")).toBeUndefined();
      });

      it("aiReasoning styling and sparkles persist after programmatic value change", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
            modelValue: "",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();
        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-purple-50")).toBe(true);
        expect(findSparkles(wrapper)?.exists()).toBe(true);

        await wrapper.setProps({ modelValue: "programmatic value" });

        expect(container.classList.contains("bg-purple-50")).toBe(true);
        expect(container.classList.contains("ring-purple-200")).toBe(true);
        expect(findSparkles(wrapper)?.exists()).toBe(true);
        expect(wrapper.emitted("update:aiReasoning")).toBeUndefined();
      });

      it("emphasis persists through multiple programmatic value changes", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
            modelValue: "",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();
        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;

        await wrapper.setProps({ modelValue: "first" });
        await wrapper.setProps({ modelValue: "second" });
        await wrapper.setProps({ modelValue: "third" });

        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );
        expect(wrapper.emitted("update:highlighted")).toBeUndefined();
      });

      it("emphasis persists when programmatic value is cleared to empty string", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
            modelValue: "initial",
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();
        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;

        await wrapper.setProps({ modelValue: "" });

        expect(container.classList.contains("bg-purple-50")).toBe(true);
        expect(findSparkles(wrapper)?.exists()).toBe(true);
        expect(wrapper.emitted("update:aiReasoning")).toBeUndefined();
      });
    });

    describe("user input reverts to default state", () => {
      it("highlighted reverts to default styling on user input", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();
        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );

        await wrapper.find("input").setValue("user typed");

        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          false,
        );
        expect(
          container.classList.contains("border-semantic-warning-200"),
        ).toBe(false);
        expect(container.classList.contains("ring-semantic-warning-100")).toBe(
          false,
        );
        expect(container.classList.contains("border-grey-200")).toBe(true);
      });

      it("aiReasoning reverts to default styling and hides sparkles on user input", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            aiReasoning: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();
        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        expect(container.classList.contains("bg-purple-50")).toBe(true);
        expect(findSparkles(wrapper)?.exists()).toBe(true);

        await wrapper.find("input").setValue("user typed");

        expect(container.classList.contains("bg-purple-50")).toBe(false);
        expect(container.classList.contains("border-purple-600")).toBe(false);
        expect(container.classList.contains("ring-purple-200")).toBe(false);
        expect(container.classList.contains("border-grey-200")).toBe(true);
        expect(findSparkles(wrapper)).toBeUndefined();
      });

      it("both highlighted and aiReasoning revert on user input", async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: "Label",
            highlighted: true,
            aiReasoning: true,
          },
          slots: {},
        });

        await wrapper.vm.$nextTick();
        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        // highlighted takes priority
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );

        await wrapper.find("input").setValue("user typed");

        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          false,
        );
        expect(container.classList.contains("bg-purple-50")).toBe(false);
        expect(container.classList.contains("border-grey-200")).toBe(true);
        expect(findSparkles(wrapper)).toBeUndefined();
      });

      it("emits update:highlighted false on user input", async () => {
        const wrapper = mount(FzInput, {
          props: { label: "Label", highlighted: true },
          slots: {},
        });

        await wrapper.find("input").setValue("typed");

        expect(wrapper.emitted("update:highlighted")).toEqual([[false]]);
      });

      it("emits update:aiReasoning false on user input", async () => {
        const wrapper = mount(FzInput, {
          props: { label: "Label", aiReasoning: true },
          slots: {},
        });

        await wrapper.find("input").setValue("typed");

        expect(wrapper.emitted("update:aiReasoning")).toEqual([[false]]);
      });

      it("emits both update events when both are active", async () => {
        const wrapper = mount(FzInput, {
          props: { label: "Label", highlighted: true, aiReasoning: true },
          slots: {},
        });

        await wrapper.find("input").setValue("typed");

        expect(wrapper.emitted("update:highlighted")).toEqual([[false]]);
        expect(wrapper.emitted("update:aiReasoning")).toEqual([[false]]);
      });

      it("does not emit update events when no emphasis is active", async () => {
        const wrapper = mount(FzInput, {
          props: { label: "Label" },
          slots: {},
        });

        await wrapper.find("input").setValue("typed");

        expect(wrapper.emitted("update:highlighted")).toBeUndefined();
        expect(wrapper.emitted("update:aiReasoning")).toBeUndefined();
      });

      it("only emits once even with multiple user keystrokes", async () => {
        const wrapper = mount(FzInput, {
          props: { label: "Label", highlighted: true },
          slots: {},
        });

        const input = wrapper.find("input");
        await input.setValue("a");
        await input.setValue("ab");
        await input.setValue("abc");

        // First keystroke resets emphasis; subsequent ones have nothing to reset
        expect(wrapper.emitted("update:highlighted")).toEqual([[false]]);
      });
    });

    describe("re-enabling emphasis after user reset", () => {
      it("re-applies highlighted when prop cycles false → true after user reset", async () => {
        const wrapper = mount(FzInput, {
          props: { label: "Label", highlighted: true },
          slots: {},
        });

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        await wrapper.find("input").setValue("typed");
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          false,
        );

        // Parent syncs to false then re-enables
        await wrapper.setProps({ highlighted: false });
        await wrapper.setProps({ highlighted: true });

        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );
      });

      it("re-applies aiReasoning and sparkles when prop cycles false → true after user reset", async () => {
        const wrapper = mount(FzInput, {
          props: { label: "Label", aiReasoning: true },
          slots: {},
        });

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        await wrapper.find("input").setValue("typed");
        expect(container.classList.contains("bg-purple-50")).toBe(false);
        expect(findSparkles(wrapper)).toBeUndefined();

        await wrapper.setProps({ aiReasoning: false });
        await wrapper.setProps({ aiReasoning: true });

        expect(container.classList.contains("bg-purple-50")).toBe(true);
        expect(findSparkles(wrapper)?.exists()).toBe(true);
      });

      it("user can type again after re-enabled emphasis to reset it a second time", async () => {
        const wrapper = mount(FzInput, {
          props: { label: "Label", highlighted: true },
          slots: {},
        });

        const container = wrapper.find(".fz-input > div")
          .element as HTMLElement;
        const input = wrapper.find("input");

        // First cycle: user types → reset
        await input.setValue("first");
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          false,
        );

        // Parent re-enables
        await wrapper.setProps({ highlighted: false });
        await wrapper.setProps({ highlighted: true });
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          true,
        );

        // Second cycle: user types again → reset again
        await input.setValue("second");
        expect(container.classList.contains("bg-semantic-warning-50")).toBe(
          false,
        );
        expect(wrapper.emitted("update:highlighted")).toEqual([
          [false],
          [false],
        ]);
      });
    });
  });

  describe("Edge cases", () => {
    it(`renders ${NUMBER_OF_INPUTS} input with different ids`, async () => {
      const wrapperList = Array.from({ length: NUMBER_OF_INPUTS }).map((_, i) =>
        mount(FzInput, {
          props: {
            label: `Label ${i}`,
          },
          slots: {},
        }),
      );

      await Promise.all(wrapperList.map((w) => w.vm.$nextTick()));

      const ids = wrapperList.map((w) => w.find("input").attributes("id"));

      expect(new Set(ids).size).toBe(NUMBER_OF_INPUTS);
    });
  });

  describe("Clearable", () => {
    it("does not show clear icon when clearable is false (default)", () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          modelValue: "some value",
        },
      });

      expect(wrapper.find('[aria-label="Cancella"]').exists()).toBe(false);
    });

    it("does not show clear icon when clearable is true but model is empty", () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          clearable: true,
          modelValue: "",
        },
      });

      expect(wrapper.find('[aria-label="Cancella"]').exists()).toBe(false);
    });

    it("does not show clear icon when clearable is true but disabled", () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          clearable: true,
          modelValue: "some value",
          disabled: true,
        },
      });

      expect(wrapper.find('[aria-label="Cancella"]').exists()).toBe(false);
    });

    it("does not show clear icon when clearable is true but readonly", () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          clearable: true,
          modelValue: "some value",
          readonly: true,
        },
      });

      expect(wrapper.find('[aria-label="Cancella"]').exists()).toBe(false);
    });

    it("shows clear icon when clearable is true and model has value", () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          clearable: true,
          modelValue: "some value",
        },
      });

      expect(wrapper.find('[aria-label="Cancella"]').exists()).toBe(true);
    });

    it("clears model and emits fzinput:clear when clear icon is clicked", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          clearable: true,
          modelValue: "some value",
        },
      });

      await wrapper.find('[aria-label="Cancella"]').trigger("click");

      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([""]);
      expect(wrapper.emitted("fzinput:clear")).toBeTruthy();
    });

    it("returns focus to input after clearing", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          clearable: true,
          modelValue: "some value",
        },
        attachTo: document.body,
      });

      await wrapper.find('[aria-label="Cancella"]').trigger("click");
      await wrapper.vm.$nextTick();

      expect(document.activeElement).toBe(wrapper.find("input").element);
      wrapper.unmount();
    });

    it("shows clear icon when right-icon slot is overridden", () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          clearable: true,
          modelValue: "some value",
        },
        slots: {
          "right-icon": "<span class='custom-chevron'>▼</span>",
        },
      });

      expect(wrapper.find('[aria-label="Cancella"]').exists()).toBe(true);
      expect(wrapper.find(".custom-chevron").exists()).toBe(true);
    });

    it("propagates custom clearAriaLabel to the clear button", () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
          clearable: true,
          clearAriaLabel: "Svuota campo",
          modelValue: "some value",
        },
      });

      expect(wrapper.find('[aria-label="Svuota campo"]').exists()).toBe(true);
      expect(wrapper.find('[aria-label="Cancella"]').exists()).toBe(false);
    });
  });

  describe("id prop and label-input binding", () => {
    it("generates a stable internal id when no `id` prop is provided", async () => {
      const wrapper = mount(FzInput, { props: { label: "Email" } });
      await wrapper.vm.$nextTick();

      const labelFor = wrapper.find("label").attributes("for");
      const inputId = wrapper.find("input").attributes("id");

      expect(labelFor).toBeDefined();
      expect(inputId).toBeDefined();
      expect(labelFor).toBe(inputId);
      expect(inputId).toMatch(/^fz-input-/);
    });

    it('uses the `id` prop on both <label for=""> and <input id=""> when provided', async () => {
      const wrapper = mount(FzInput, {
        props: { id: "email", label: "Email" },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("label").attributes("for")).toBe("email");
      expect(wrapper.find("input").attributes("id")).toBe("email");
    });
  });

  describe("DS-GAP baselines", () => {
    it("applies text-core-black on the root wrapper", async () => {
      const wrapper = mount(FzInput, { props: { label: "L" } });
      await wrapper.vm.$nextTick();

      const root = wrapper.element as HTMLElement;
      expect(root.classList.contains("text-core-black")).toBe(true);
    });

    it("pairs border-1 with border-solid on the input container", async () => {
      const wrapper = mount(FzInput, { props: { label: "L" } });
      await wrapper.vm.$nextTick();

      const container = wrapper.find('[ref="containerRef"], .border-1').exists()
        ? wrapper.find(".border-1")
        : wrapper.find("input").element.parentElement;
      const containerEl =
        container instanceof Element ? container : (container as any).element;
      const classes =
        containerEl instanceof Element
          ? containerEl.classList
          : containerEl?.classList;
      expect(classes?.contains("border-1")).toBe(true);
      expect(classes?.contains("border-solid")).toBe(true);
    });

    it("applies mb-0 on the label", async () => {
      const wrapper = mount(FzInput, { props: { label: "L" } });
      await wrapper.vm.$nextTick();

      const labelClasses = wrapper.find("label").classes();
      expect(labelClasses).toContain("mb-0");
    });

    it("applies grey-300 to value text on disabled and readonly states via Tailwind variants", async () => {
      const w1 = mount(FzInput, { props: { label: "L", disabled: true } });
      await w1.vm.$nextTick();
      const c1 = w1.find("input").classes();
      expect(c1).toContain("disabled:text-grey-300");
      expect(c1).toContain("read-only:text-grey-300");

      const w2 = mount(FzInput, { props: { label: "L", readonly: true } });
      await w2.vm.$nextTick();
      const c2 = w2.find("input").classes();
      expect(c2).toContain("disabled:text-grey-300");
      expect(c2).toContain("read-only:text-grey-300");
    });

    it("does not bind an inline style width on the helper text or error alert", async () => {
      const wrapperHelp = mount(FzInput, {
        props: { label: "L" },
        slots: { helpText: "Some help" },
      });
      await wrapperHelp.vm.$nextTick();
      const helpSpan = wrapperHelp.find('[id$="-help"]');
      expect(helpSpan.exists()).toBe(true);
      expect(helpSpan.attributes("style") || "").not.toMatch(/width:/);

      const wrapperErr = mount(FzInput, {
        props: { label: "L", error: true },
        slots: { errorMessage: "Boom" },
      });
      await wrapperErr.vm.$nextTick();
      const errAlert = wrapperErr.find('[id$="-error"]');
      expect(errAlert.exists()).toBe(true);
      expect(errAlert.attributes("style") || "").not.toMatch(/width:/);
    });
  });

  describe('type="currency"', () => {
    it("renders a text input with step controls", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Amount",
          type: "currency",
        },
        slots: {},
      });

      expect(wrapper.find("input").attributes("type")).toBe("text");
      expect(wrapper.find(".fz__input__arrowup").exists()).toBe(true);
      expect(wrapper.find(".fz__input__arrowdown").exists()).toBe(true);
      // Retro-compatible class names kept for FzCurrencyInput consumers
      expect(wrapper.find(".fz__currencyinput__arrowup").exists()).toBe(true);
      expect(wrapper.find(".fz__currencyinput__arrowdown").exists()).toBe(true);
    });

    it("formats the initial numeric v-model for display", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Amount",
          type: "currency",
          modelValue: 1234.56,
        },
        slots: {},
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.find("input").element.value).toBe("1.234,56");
    });

    it("emits numbers while typing and formats on blur", async () => {
      let modelValue: number | undefined = undefined;
      const wrapper = mount(FzInput, {
        props: {
          label: "Amount",
          type: "currency",
          modelValue,
          "onUpdate:modelValue": (value: number | null | undefined) => {
            modelValue = value as number | undefined;
            wrapper.setProps({ modelValue });
          },
        },
        slots: {},
      });

      const inputElement = wrapper.find("input");
      await inputElement.trigger("focus");
      await inputElement.setValue("123,4");
      expect(modelValue).toBe(123.4);

      await inputElement.trigger("blur");
      await wrapper.vm.$nextTick();
      expect(inputElement.element.value).toBe("123,40");
    });

    it("steps the value with the arrow controls clamping to min/max", async () => {
      let modelValue: number | undefined = 9.5;
      const wrapper = mount(FzInput, {
        props: {
          label: "Amount",
          type: "currency",
          modelValue,
          step: 1,
          max: 10,
          "onUpdate:modelValue": (value: number | null | undefined) => {
            modelValue = value as number | undefined;
            wrapper.setProps({ modelValue });
          },
        },
        slots: {},
      });

      await wrapper.find(".fz__input__arrowup").trigger("click");
      expect(modelValue).toBe(10);

      await wrapper.find(".fz__input__arrowdown").trigger("click");
      await wrapper.find(".fz__input__arrowdown").trigger("click");
      expect(modelValue).toBe(8);
    });

    it("clears to the configured empty value and emits fzinput:clear", async () => {
      let modelValue: number | null | undefined = 42;
      const wrapper = mount(FzInput, {
        props: {
          label: "Amount",
          type: "currency",
          clearable: true,
          nullOnEmpty: true,
          modelValue,
          "onUpdate:modelValue": (value: number | null | undefined) => {
            modelValue = value;
            wrapper.setProps({ modelValue });
          },
        },
        slots: {},
      });

      await wrapper.vm.$nextTick();
      await wrapper.find('[aria-label="Cancella"]').trigger("click");

      expect(modelValue).toBe(null);
      expect(wrapper.emitted("fzinput:clear")).toBeTruthy();
      expect(wrapper.find("input").element.value).toBe("");
    });

    it("applies custom aria-labels to the step controls", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Amount",
          type: "currency",
          stepUpAriaLabel: "Su",
          stepDownAriaLabel: "Giù",
        },
        slots: {},
      });

      expect(wrapper.find(".fz__input__arrowup").attributes("aria-label")).toBe(
        "Su",
      );
      expect(
        wrapper.find(".fz__input__arrowdown").attributes("aria-label"),
      ).toBe("Giù");
    });
  });

  describe('type="number" step controls', () => {
    it("renders step controls and hides the native spinners", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Quantity",
          type: "number",
        },
        slots: {},
      });

      expect(wrapper.find("input").attributes("type")).toBe("number");
      expect(wrapper.find(".fz__input__arrowup").exists()).toBe(true);
      expect(wrapper.find(".fz__input__arrowdown").exists()).toBe(true);
      expect(wrapper.find("input").classes().join(" ")).toContain("appearance");
    });

    it("does not render step controls for text inputs", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Label",
        },
        slots: {},
      });

      expect(wrapper.find(".fz__input__arrowup").exists()).toBe(false);
      expect(wrapper.find(".fz__input__arrowdown").exists()).toBe(false);
    });

    it("steps the value with the arrow controls respecting min/max/step", async () => {
      // Note: Vue's v-model on native number inputs casts values to number at
      // runtime, so the emitted values are numbers (pre-existing FzInput behavior).
      let modelValue: string | number = "4";
      const wrapper = mount(FzInput, {
        props: {
          label: "Quantity",
          type: "number",
          step: 2,
          min: 0,
          max: 6,
          modelValue,
          "onUpdate:modelValue": (value: string | number | undefined) => {
            modelValue = value ?? "";
            wrapper.setProps({ modelValue });
          },
        },
        slots: {},
      });

      await wrapper.find(".fz__input__arrowup").trigger("click");
      expect(modelValue).toBe(6);

      // Already at max: stays at 6
      await wrapper.find(".fz__input__arrowup").trigger("click");
      expect(modelValue).toBe(6);

      await wrapper.find(".fz__input__arrowdown").trigger("click");
      expect(modelValue).toBe(4);
    });

    it("emits default aria-labels based on the step value", async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: "Quantity",
          type: "number",
          step: 5,
        },
        slots: {},
      });

      expect(wrapper.find(".fz__input__arrowup").attributes("aria-label")).toBe(
        "Incrementa di 5",
      );
      expect(
        wrapper.find(".fz__input__arrowdown").attributes("aria-label"),
      ).toBe("Decrementa di 5");
    });

    it("does not step when disabled or readonly", async () => {
      let modelValue = "4";
      const wrapper = mount(FzInput, {
        props: {
          label: "Quantity",
          type: "number",
          disabled: true,
          modelValue,
          "onUpdate:modelValue": (value: string | undefined) => {
            modelValue = value ?? "";
            wrapper.setProps({ modelValue });
          },
        },
        slots: {},
      });

      const arrowUp = wrapper.find(".fz__input__arrowup");
      expect(arrowUp.attributes("aria-disabled")).toBe("true");
      await arrowUp.trigger("click");
      expect(modelValue).toBe("4");
    });
  });
});
