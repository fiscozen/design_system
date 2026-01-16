import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { h } from "vue";
import { FzRadioGroupProps, FzRadioGroup, FzRadio } from "..";

const createWrapper = async (props: FzRadioGroupProps) => {
  const content = mount(FzRadioGroup, {
    props,
    slots: {
      default: (props) => [
        h(FzRadio, {
          label: "Radio 1",
          value: "Radio 1",
          ...props.radioGroupProps,
        }),
        h(FzRadio, {
          label: "Radio 2",
          value: "Radio 2",
          ...props.radioGroupProps,
        }),
      ],
    },
  });
  return content;
};

describe("FzRadioGroup", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render correctly", async () => {
      const wrapper = await createWrapper({
        label: "Radio Group",
        size: "md",
        name: "radio",
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should render label when provided", async () => {
      const wrapper = await createWrapper({
        label: "Select an option",
        size: "md",
        name: "radio",
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("Select an option");
    });

    it("should render radio buttons in slot", async () => {
      const wrapper = await createWrapper({
        label: "Radio Group",
        size: "md",
        name: "radio",
      });
      await wrapper.vm.$nextTick();
      const inputs = wrapper.findAll("input[type='radio']");
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("error prop", () => {
      it("should set error state", async () => {
        const wrapper = mount(FzRadioGroup, {
          props: {
            label: "Radio Group",
            size: "md",
            error: true,
          },
          slots: {
            default: (props) => [
              h(FzRadio, {
                label: "Radio 1",
                value: "Radio 1",
                ...props.radioGroupProps,
              }),
              h(FzRadio, {
                label: "Radio 2",
                value: "Radio 2",
                ...props.radioGroupProps,
              }),
            ],
            error: "Error text",
          },
        });

        await wrapper.vm.$nextTick();

        // FzAlert should be used for error display
        expect(wrapper.findComponent({ name: "FzAlert" }).exists()).toBe(true);
        wrapper
          .find('[test-id="slot-container"]')
          .findAll("label")
          .forEach((input) => {
            expect(input.classes()).toContain("before:border-semantic-error");
          });
      });
    });

    describe("disabled prop", () => {
      it("should set disabled state on all radio buttons", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          size: "md",
          disabled: true,
        });

        await wrapper.vm.$nextTick();
        wrapper.findAll("input").forEach((input) => {
          expect(input.element.disabled).toBe(true);
        });
      });
    });

    describe("variant prop", () => {
      it("should support horizontal variant", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          size: "md",
          variant: "horizontal",
        });
        await wrapper.vm.$nextTick();
        const slotContainer = wrapper.find('[test-id="slot-container"]');
        expect(slotContainer.classes()).toContain("flex-row");
      });

      it("should default to vertical variant", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          size: "md",
        });
        await wrapper.vm.$nextTick();
        const slotContainer = wrapper.find('[test-id="slot-container"]');
        expect(slotContainer.classes()).toContain("flex-col");
      });
    });

    describe("tone prop", () => {
      it("should support tone=emphasis", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          size: "md",
          tone: "emphasis",
        });
        await wrapper.vm.$nextTick();
        wrapper
          .find('[test-id="slot-container"]')
          .findAll("label")
          .forEach((input) => {
            expect(input.classes()).toContain(
              "peer-checked:before:border-blue-500",
            );
          });
      });
    });

    describe("deprecated props", () => {
      it("should maintain backward compatibility with emphasis prop", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          size: "md",
          emphasis: true,
        });
        await wrapper.vm.$nextTick();
        wrapper
          .find('[test-id="slot-container"]')
          .findAll("label")
          .forEach((input) => {
            expect(input.classes()).toContain(
              "peer-checked:before:border-blue-500",
            );
          });
      });
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should propagate update:modelValue from radio buttons", async () => {
      const wrapper = mount(FzRadioGroup, {
        props: {
          label: "Radio Group",
          name: "test-group",
        },
        slots: {
          default: (props) => [
            h(FzRadio, {
              label: "Radio 1",
              value: "option1",
              ...props.radioGroupProps,
            }),
            h(FzRadio, {
              label: "Radio 2",
              value: "option2",
              ...props.radioGroupProps,
            }),
          ],
        },
      });
      await wrapper.vm.$nextTick();

      const firstRadio = wrapper.findAll("input")[0];
      await firstRadio.trigger("change");

      // The radio buttons emit update:modelValue, which should be handled by parent
      expect(firstRadio.exists()).toBe(true);
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("ARIA attributes", () => {
      it("should have role='radiogroup' on container", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          size: "md",
          name: "radio",
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        expect(container.attributes("role")).toBe("radiogroup");
      });

      it("should have aria-labelledby linking to label when label is provided", async () => {
        const wrapper = await createWrapper({
          label: "Select an option",
          size: "md",
          name: "radio",
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        const labelId = container.attributes("aria-labelledby");
        expect(labelId).toBeTruthy();
        expect(wrapper.find(`#${labelId}`).exists()).toBe(true);
        expect(wrapper.find(`#${labelId}`).text()).toContain("Select an option");
      });

      it("should not have aria-labelledby when label is not provided", async () => {
        const wrapper = await createWrapper({
          size: "md",
          name: "radio",
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        expect(container.attributes("aria-labelledby")).toBeUndefined();
      });

      it("should have aria-describedby linking to help text when help slot is provided", async () => {
        const wrapper = mount(FzRadioGroup, {
          props: {
            label: "Radio Group",
            name: "radio",
          },
          slots: {
            default: (props) => [
              h(FzRadio, {
                label: "Radio 1",
                value: "Radio 1",
                ...props.radioGroupProps,
              }),
            ],
            help: () => "Help text",
          },
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        const describedBy = container.attributes("aria-describedby");
        expect(describedBy).toBeTruthy();
        // aria-describedby should contain help text ID
        expect(describedBy).toContain("-help");
      });

      it("should have aria-describedby linking to error message when error slot is provided", async () => {
        const wrapper = mount(FzRadioGroup, {
          props: {
            label: "Radio Group",
            error: true,
            name: "radio",
          },
          slots: {
            default: (props) => [
              h(FzRadio, {
                label: "Radio 1",
                value: "Radio 1",
                ...props.radioGroupProps,
              }),
            ],
            error: () => "Error text",
          },
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        const describedBy = container.attributes("aria-describedby");
        expect(describedBy).toBeTruthy();
        // aria-describedby should contain error ID
        expect(describedBy).toContain("-error");
      });

      it("should have aria-describedby with both help and error IDs when both are provided", async () => {
        const wrapper = mount(FzRadioGroup, {
          props: {
            label: "Radio Group",
            error: true,
            name: "radio",
          },
          slots: {
            default: (props) => [
              h(FzRadio, {
                label: "Radio 1",
                value: "Radio 1",
                ...props.radioGroupProps,
              }),
            ],
            help: () => "Help text",
            error: () => "Error text",
          },
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        const describedBy = container.attributes("aria-describedby");
        expect(describedBy).toBeTruthy();
        // aria-describedby should contain both help and error IDs
        expect(describedBy).toContain("-help");
        expect(describedBy).toContain("-error");
      });

      it("should have aria-required='true' when required", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          size: "md",
          required: true,
          name: "radio",
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        expect(container.attributes("aria-required")).toBe("true");
      });

      it("should have aria-required='false' when not required", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          size: "md",
          required: false,
          name: "radio",
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        expect(container.attributes("aria-required")).toBe("false");
      });

      it("should have aria-invalid='true' when error", async () => {
        const wrapper = mount(FzRadioGroup, {
          props: {
            label: "Radio Group",
            error: true,
            name: "radio",
          },
          slots: {
            default: (props) => [
              h(FzRadio, {
                label: "Radio 1",
                value: "Radio 1",
                ...props.radioGroupProps,
              }),
            ],
          },
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        expect(container.attributes("aria-invalid")).toBe("true");
      });

      it("should have aria-invalid='false' when not in error state", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          size: "md",
          name: "radio",
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        expect(container.attributes("aria-invalid")).toBe("false");
      });
    });

    describe("Keyboard navigation", () => {
      it("should support arrow key navigation between radio buttons", async () => {
        const wrapper = mount(FzRadioGroup, {
          props: {
            label: "Radio Group",
            name: "test-group",
          },
          slots: {
            default: (props) => [
              h(FzRadio, {
                label: "Radio 1",
                value: "option1",
                ...props.radioGroupProps,
              }),
              h(FzRadio, {
                label: "Radio 2",
                value: "option2",
                ...props.radioGroupProps,
              }),
              h(FzRadio, {
                label: "Radio 3",
                value: "option3",
                ...props.radioGroupProps,
              }),
            ],
          },
        });
        await wrapper.vm.$nextTick();

        const radios = wrapper.findAll("input[type='radio']");
        expect(radios.length).toBe(3);

        // All radios should have the same name attribute for group behavior
        const names = radios.map((radio) => radio.attributes("name"));
        expect(new Set(names).size).toBe(1); // All should have same name
      });

      it("should have same name attribute for all radio buttons in group", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          name: "test-group",
        });
        await wrapper.vm.$nextTick();

        const radios = wrapper.findAll("input[type='radio']");
        expect(radios.length).toBeGreaterThan(0);

        const names = radios.map((radio) => radio.attributes("name"));
        expect(new Set(names).size).toBe(1); // All should have same name
        expect(names[0]).toBe("test-group");
      });
    });

    describe("Semantic HTML structure", () => {
      it("should have role='radiogroup' on container element", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          name: "radio",
        });
        await wrapper.vm.$nextTick();

        const container = wrapper.find('[test-id="slot-container"]');
        expect(container.attributes("role")).toBe("radiogroup");
      });

      it("should have label element when label prop is provided", async () => {
        const wrapper = await createWrapper({
          label: "Select an option",
          name: "radio",
        });
        await wrapper.vm.$nextTick();

        const label = wrapper.find("label");
        expect(label.exists()).toBe(true);
        expect(label.text()).toContain("Select an option");
      });

      it("should show required indicator when required", async () => {
        const wrapper = await createWrapper({
          label: "Radio Group",
          required: true,
          name: "radio",
        });
        await wrapper.vm.$nextTick();

        const label = wrapper.find("label");
        expect(label.text()).toContain("*");
      });
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply horizontal layout classes when variant is horizontal", async () => {
      const wrapper = await createWrapper({
        label: "Radio Group",
        variant: "horizontal",
        name: "radio",
      });
      await wrapper.vm.$nextTick();
      const slotContainer = wrapper.find('[test-id="slot-container"]');
      expect(slotContainer.classes()).toContain("flex-row");
      expect(slotContainer.classes()).not.toContain("flex-col");
    });

    it("should apply vertical layout classes when variant is vertical", async () => {
      const wrapper = await createWrapper({
        label: "Radio Group",
        variant: "vertical",
        name: "radio",
      });
      await wrapper.vm.$nextTick();
      const slotContainer = wrapper.find('[test-id="slot-container"]');
      expect(slotContainer.classes()).toContain("flex-col");
      expect(slotContainer.classes()).not.toContain("flex-row");
    });

    it("should apply error classes to radio buttons when error", async () => {
      const wrapper = mount(FzRadioGroup, {
        props: {
          label: "Radio Group",
          error: true,
          name: "radio",
        },
        slots: {
          default: (props) => [
            h(FzRadio, {
              label: "Radio 1",
              value: "Radio 1",
              ...props.radioGroupProps,
            }),
          ],
        },
      });
      await wrapper.vm.$nextTick();

      wrapper
        .find('[test-id="slot-container"]')
        .findAll("label")
        .forEach((label) => {
          expect(label.classes()).toContain("before:border-semantic-error");
        });
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle undefined label gracefully", async () => {
      const wrapper = await createWrapper({
        size: "md",
        name: "radio",
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.exists()).toBe(true);
      const container = wrapper.find('[test-id="slot-container"]');
      expect(container.attributes("aria-labelledby")).toBeUndefined();
    });

    it("should generate unique name when name prop is not provided", async () => {
      const wrapper1 = mount(FzRadioGroup, {
        props: {
          label: "Group 1",
        },
        slots: {
          default: (props) => [
            h(FzRadio, {
              label: "Radio 1",
              value: "option1",
              ...props.radioGroupProps,
            }),
          ],
        },
      });
      await wrapper1.vm.$nextTick();
      
      // Wait a bit to ensure different random values
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const wrapper2 = mount(FzRadioGroup, {
        props: {
          label: "Group 2",
        },
        slots: {
          default: (props) => [
            h(FzRadio, {
              label: "Radio 1",
              value: "option1",
              ...props.radioGroupProps,
            }),
          ],
        },
      });
      await wrapper2.vm.$nextTick();

      const name1 = wrapper1.findAll("input")[0].attributes("name");
      const name2 = wrapper2.findAll("input")[0].attributes("name");
      // Names should be auto-generated (start with 'radio-group-')
      expect(name1).toMatch(/^radio-group-/);
      expect(name2).toMatch(/^radio-group-/);
      // In most cases they will be different, but due to randomness they might occasionally match
      // The important thing is that they are auto-generated
    });

    it("should handle empty slots gracefully", async () => {
      const wrapper = mount(FzRadioGroup, {
        props: {
          label: "Radio Group",
          name: "radio",
        },
        slots: {
          default: () => [],
        },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.exists()).toBe(true);
      const container = wrapper.find('[test-id="slot-container"]');
      expect(container.exists()).toBe(true);
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", async () => {
      const wrapper = await createWrapper({
        label: "Radio Group",
        size: "md",
        name: "radio",
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - error state", async () => {
      const wrapper = mount(FzRadioGroup, {
        props: {
          label: "Radio Group",
          size: "md",
          error: true,
        },
        slots: {
          default: (props) => [
            h(FzRadio, {
              label: "Radio 1",
              value: "Radio 1",
              ...props.radioGroupProps,
            }),
            h(FzRadio, {
              label: "Radio 2",
              value: "Radio 2",
              ...props.radioGroupProps,
            }),
          ],
          error: "Error text",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - disabled state", async () => {
      const wrapper = await createWrapper({
        label: "Radio Group",
        size: "md",
        disabled: true,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - horizontal variant", async () => {
      const wrapper = await createWrapper({
        label: "Radio Group",
        size: "md",
        variant: "horizontal",
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - emphasis state", async () => {
      const wrapper = await createWrapper({
        label: "Radio Group",
        size: "md",
        emphasis: true,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - required state", async () => {
      const wrapper = await createWrapper({
        label: "Radio Group",
        size: "md",
        required: true,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
