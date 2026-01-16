import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FzCheckboxGroup from "../FzCheckboxGroup.vue";
import FzCheckbox from "../FzCheckbox.vue";

describe("FzCheckboxGroup", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with default props", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html()).toContain("Test Checkbox Group");
      expect(wrapper.findAllComponents(FzCheckbox).length).toBe(2);
    });

    it("should render label", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Custom Label",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("Custom Label");
    });

    it("should render all checkbox options", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
            { label: "Option 3", value: "option3" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.findAllComponents(FzCheckbox).length).toBe(3);
    });

    it("should render hierarchical checkboxes", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            {
              label: "Parent Option",
              value: "parent",
              children: [
                { label: "Child 1", value: "child1" },
                { label: "Child 2", value: "child2" },
              ],
            },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      const allCheckboxes = wrapper.findAllComponents(FzCheckbox);
      // Should have parent + 2 children = 3 checkboxes
      expect(allCheckboxes.length).toBe(3);
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("label prop", () => {
      it("should display label text", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Custom Label",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
          },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Custom Label");
      });
    });

    describe("options prop", () => {
      it("should render checkboxes from options array", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ],
          },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.findAllComponents(FzCheckbox).length).toBe(2);
      });

      it("should handle empty options array", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [],
          },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.findAllComponents(FzCheckbox).length).toBe(0);
      });
    });

    describe("disabled prop", () => {
      it("should propagate disabled to all checkboxes", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ],
            disabled: true,
          },
        });

        await wrapper.vm.$nextTick();
        const checkboxes = wrapper.findAllComponents(FzCheckbox);
        checkboxes.forEach((checkbox) => {
          expect(checkbox.props("disabled")).toBe(true);
        });
      });
    });

    describe("error prop", () => {
      it("should propagate error to all checkboxes", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ],
            error: true,
          },
        });

        await wrapper.vm.$nextTick();
        const checkboxes = wrapper.findAllComponents(FzCheckbox);
        checkboxes.forEach((checkbox) => {
          expect(checkbox.props("error")).toBe(true);
        });
      });
    });

    describe("emphasis prop", () => {
      it("should propagate emphasis to all checkboxes", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ],
            emphasis: true,
          },
        });

        await wrapper.vm.$nextTick();
        const checkboxes = wrapper.findAllComponents(FzCheckbox);
        checkboxes.forEach((checkbox) => {
          expect(checkbox.props("emphasis")).toBe(true);
        });
      });
    });

    describe("required prop", () => {
      it("should display required indicator when true", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
            required: true,
          },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("*");
      });
    });

    describe("horizontal prop", () => {
      it("should apply horizontal layout classes when true", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
            horizontal: true,
          },
        });

        await wrapper.vm.$nextTick();
        const container = wrapper.find("[role='group']");
        expect(container.classes()).toContain("flex-row");
        expect(container.classes()).toContain("gap-16");
      });

      it("should apply vertical layout classes when false", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
            horizontal: false,
          },
        });

        await wrapper.vm.$nextTick();
        const container = wrapper.find("[role='group']");
        expect(container.classes()).toContain("flex-col");
        expect(container.classes()).toContain("gap-8");
      });
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should update modelValue when checkbox is selected", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      const checkboxes = wrapper.findAllComponents(FzCheckbox);
      await checkboxes[0].find("input").setValue(true);

      expect(wrapper.emitted("update:modelValue")).toBeDefined();
    });

    it("should handle multiple selections", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      const checkboxes = wrapper.findAllComponents(FzCheckbox);
      await checkboxes[0].find("input").setValue(true);
      await checkboxes[1].find("input").setValue(true);

      // Should emit multiple update:modelValue events
      const updateEvents = wrapper.emitted("update:modelValue");
      expect(updateEvents).toBeDefined();
      expect(updateEvents!.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("ARIA attributes", () => {
      it("should have role='group' on container", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ],
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("[role='group']").exists()).toBe(true);
      });

      it("should have aria-labelledby linking to label", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
          },
        });
        await wrapper.vm.$nextTick();
        const groupId = wrapper.find("[role='group']").attributes("id");
        const labelId = groupId + "-label";
        expect(wrapper.find("[role='group']").attributes("aria-labelledby")).toBe(
          labelId,
        );
        expect(wrapper.find(`#${labelId}`).exists()).toBe(true);
      });

      it("should have aria-describedby when help text is present", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
          },
          slots: {
            help: "This is help text",
          },
        });
        await wrapper.vm.$nextTick();
        const groupId = wrapper.find("[role='group']").attributes("id");
        const helpId = groupId + "-help";
        expect(wrapper.find("[role='group']").attributes("aria-describedby")).toBe(
          helpId,
        );
        expect(wrapper.find(`#${helpId}`).exists()).toBe(true);
        expect(wrapper.find(`#${helpId}`).text()).toBe("This is help text");
      });

      it("should have aria-describedby when error is present", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
            error: true,
          },
          slots: {
            error: "Test error message",
          },
        });
        await wrapper.vm.$nextTick();
        const groupId = wrapper.find("[role='group']").attributes("id");
        const errorId = groupId + "-error";
        expect(wrapper.find("[role='group']").attributes("aria-describedby")).toBe(
          errorId,
        );
        expect(wrapper.find(`#${errorId}`).exists()).toBe(true);
      });

      it("should have aria-describedby with both help and error", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
            error: true,
          },
          slots: {
            help: "This is help text",
            error: "This is an error",
          },
        });
        await wrapper.vm.$nextTick();
        const groupId = wrapper.find("[role='group']").attributes("id");
        const helpId = groupId + "-help";
        const errorId = groupId + "-error";
        const describedby = wrapper
          .find("[role='group']")
          .attributes("aria-describedby");

        // Should contain both IDs separated by space
        expect(describedby).toContain(helpId);
        expect(describedby).toContain(errorId);
        expect(describedby).toBe(`${helpId} ${errorId}`);
      });

      it("should have aria-invalid when error is present", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
            error: true,
          },
        });
        await wrapper.vm.$nextTick();
        const group = wrapper.find("[role='group']");
        expect(group.attributes("aria-invalid")).toBe("true");
      });

      it("should have aria-required when required", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
            required: true,
          },
        });
        await wrapper.vm.$nextTick();
        const group = wrapper.find("[role='group']");
        expect(group.attributes("aria-required")).toBe("true");
      });

      it("should not have aria-describedby when no error slot provided", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
            error: true,
          },
        });
        await wrapper.vm.$nextTick();
        const group = wrapper.find("[role='group']");
        expect(group.attributes("aria-invalid")).toBe("true");
        expect(group.attributes("aria-describedby")).toBeUndefined();
        expect(wrapper.find("[role='alert']").exists()).toBe(false);
      });
    });

    describe("Semantic HTML structure", () => {
      it("should have proper label structure", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
          },
        });
        await wrapper.vm.$nextTick();
        const label = wrapper.find("label");
        expect(label.exists()).toBe(true);
        expect(label.text()).toContain("Test Checkbox Group");
      });

      it("should have role='alert' on error message", async () => {
        const wrapper = mount(FzCheckboxGroup, {
          props: {
            label: "Test Checkbox Group",
            modelValue: [],
            options: [
              { label: "Option 1", value: "option1" },
            ],
            error: true,
          },
          slots: {
            error: "Test error message",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("[role='alert']").exists()).toBe(true);
      });
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply static base classes to container", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
          ],
        },
      });
      await wrapper.vm.$nextTick();
      const container = wrapper.find("[role='group']");
      expect(container.classes()).toContain("flex");
      expect(container.classes()).toContain("items-start");
    });

    it("should apply horizontal layout classes when horizontal is true", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
          ],
          horizontal: true,
        },
      });
      await wrapper.vm.$nextTick();
      const container = wrapper.find("[role='group']");
      expect(container.classes()).toContain("flex-row");
      expect(container.classes()).toContain("gap-16");
    });

    it("should apply vertical layout classes when horizontal is false", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
          ],
          horizontal: false,
        },
      });
      await wrapper.vm.$nextTick();
      const container = wrapper.find("[role='group']");
      expect(container.classes()).toContain("flex-col");
      expect(container.classes()).toContain("gap-8");
    });

    it("should apply disabled classes to label when disabled", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
          ],
          disabled: true,
        },
      });
      await wrapper.vm.$nextTick();
      const label = wrapper.find("label");
      expect(label.classes()).toContain("text-grey-400");
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle empty options array", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.findAllComponents(FzCheckbox).length).toBe(0);
    });

    it("should propagate error prop to child checkboxes in hierarchical structure", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            {
              label: "Parent Option",
              value: "parent",
              children: [
                { label: "Child 1", value: "child1" },
                { label: "Child 2", value: "child2" },
              ],
            },
          ],
          error: true,
        },
        slots: {
          error: "Test error message",
        },
      });

      await wrapper.vm.$nextTick();
      const allCheckboxes = wrapper.findAllComponents(FzCheckbox);

      // Should have parent + 2 children = 3 checkboxes
      expect(allCheckboxes.length).toBe(3);

      // All checkboxes should have error prop set to true
      allCheckboxes.forEach((checkbox) => {
        expect(checkbox.props("error")).toBe(true);
      });
    });

    it("should handle options without value prop", async () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1" },
            { label: "Option 2" },
          ],
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.findAllComponents(FzCheckbox).length).toBe(2);
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ],
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with error", () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
          ],
          error: true,
        },
        slots: {
          error: "Test error message",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - disabled", () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
          ],
          disabled: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - horizontal layout", () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ],
          horizontal: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with help text", () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
          ],
        },
        slots: {
          help: "This is help text",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - required", () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            { label: "Option 1", value: "option1" },
          ],
          required: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - hierarchical structure", () => {
      const wrapper = mount(FzCheckboxGroup, {
        props: {
          label: "Test Checkbox Group",
          modelValue: [],
          options: [
            {
              label: "Parent Option",
              value: "parent",
              children: [
                { label: "Child 1", value: "child1" },
                { label: "Child 2", value: "child2" },
              ],
            },
          ],
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});

