import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { FzStepper } from "..";
import { FzStepperProps } from "../types";

const mockSteps = [
  {
    title: "Step 1",
    description: "First step description",
    status: undefined as const,
  },
  {
    title: "Step 2",
    description: "Second step description",
    status: "completed" as const,
  },
  {
    title: "Step 3",
    description: "Third step description",
    status: "error" as const,
  },
  {
    title: "Step 4",
    description: "Fourth step description",
    status: "disabled" as const,
  },
];

describe("FzStepper", () => {
  let wrapper: VueWrapper;

  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    window.innerWidth = 1280;
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1280);

    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn((query: string) => {
        const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);
        let matches = false;
        if (maxWidthMatch) {
          const maxWidth = parseInt(maxWidthMatch[1], 10);
          matches = window.innerWidth <= maxWidth;
        }
        return {
          matches,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
      }),
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with default props", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".fz-stepper").exists()).toBe(true);
    });

    it("should render all steps", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const steps = wrapper.findAll(".fz-stepper__step");
      expect(steps.length).toBe(mockSteps.length);
    });

    it("should render step titles", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      mockSteps.forEach((step) => {
        expect(wrapper.text()).toContain(step.title);
      });
    });

    it("should render step descriptions", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      mockSteps.forEach((step) => {
        if (step.description) {
          expect(wrapper.text()).toContain(step.description);
        }
      });
    });

    it("should render progress bars by default", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const progressBars = wrapper.findAll(".fz-stepper__progress");
      expect(progressBars.length).toBeGreaterThan(0);
    });

    it("should not render progress bars when hasStepbar is false", () => {
      wrapper = mount(FzStepper, {
        props: { steps: mockSteps, hasStepbar: false },
      });
      const progressBars = wrapper.findAll(".fz-stepper__progress");
      expect(progressBars.length).toBe(0);
    });

    it("should render desktop layout by default", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      expect(wrapper.find(".fz-stepper.flex.flex-row").exists()).toBe(true);
    });

    it("should render mobile layout when forceMobile is true", () => {
      wrapper = mount(FzStepper, {
        props: { steps: mockSteps, forceMobile: true },
      });
      expect(wrapper.find(".fz-stepper.flex.flex-col").exists()).toBe(true);
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("hasStepbar", () => {
      it("should show progress bars by default", () => {
        wrapper = mount(FzStepper, { props: { steps: mockSteps } });
        expect(wrapper.findAll(".fz-stepper__progress").length).toBeGreaterThan(
          0,
        );
      });

      it("should hide progress bars when hasStepbar is false", () => {
        wrapper = mount(FzStepper, {
          props: { steps: mockSteps, hasStepbar: false },
        });
        expect(wrapper.findAll(".fz-stepper__progress").length).toBe(0);
      });
    });

    describe("environment", () => {
      it("should default to frontoffice (blue active bar)", () => {
        wrapper = mount(FzStepper, { props: { steps: mockSteps } });
        const progressBars = wrapper.findAll(".fz-stepper__progress");
        // First step is current (activeStep = 0)
        expect(progressBars[0].classes()).toContain("bg-blue-500");
      });

      it("should use blue bar for current step when environment is backoffice", () => {
        wrapper = mount(FzStepper, {
          props: { steps: mockSteps, environment: "backoffice" },
        });
        const progressBars = wrapper.findAll(".fz-stepper__progress");
        // Bar is always blue regardless of environment
        expect(progressBars[0].classes()).toContain("bg-blue-500");
      });
    });

    describe("hasStepperList", () => {
      it("should show the dropdown by default in mobile", () => {
        wrapper = mount(FzStepper, {
          props: { steps: mockSteps, forceMobile: true },
        });
        expect(wrapper.find(".fz-stepper__dropdown").exists()).toBe(true);
      });

      it("should hide dropdown and show static step when hasStepperList is false", () => {
        wrapper = mount(FzStepper, {
          props: { steps: mockSteps, forceMobile: true, hasStepperList: false },
        });
        expect(wrapper.find(".fz-stepper__dropdown").exists()).toBe(false);
        // Active step title is still visible
        expect(wrapper.text()).toContain(mockSteps[0].title);
      });
    });

    describe("forceMobile (deprecated)", () => {
      it("should use desktop layout by default on large screens", () => {
        wrapper = mount(FzStepper, { props: { steps: mockSteps } });
        expect(wrapper.find(".fz-stepper.flex.flex-row").exists()).toBe(true);
      });

      it("should force mobile layout when forceMobile is true", () => {
        wrapper = mount(FzStepper, {
          props: { steps: mockSteps, forceMobile: true },
        });
        expect(wrapper.find(".fz-stepper.flex.flex-col").exists()).toBe(true);
      });
    });

    describe("activeStep v-model", () => {
      it("should default to step 0", () => {
        wrapper = mount(FzStepper, { props: { steps: mockSteps } });
        expect(wrapper.vm.activeStep).toBe(0);
      });

      it("should update activeStep when changed", async () => {
        wrapper = mount(FzStepper, { props: { steps: mockSteps } });
        wrapper.vm.activeStep = 2;
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.activeStep).toBe(2);
      });
    });

    describe("isTextTruncated per step", () => {
      it("should apply truncate class to title when isTextTruncated is true", () => {
        const steps = [
          { title: "Step 1", description: "Desc 1", isTextTruncated: true },
        ];
        wrapper = mount(FzStepper, { props: { steps } });
        const title = wrapper.find(".fz-stepper__title");
        expect(title.classes()).toContain("truncate");
      });

      it("should not apply truncate class when isTextTruncated is false", () => {
        const steps = [
          { title: "Step 1", description: "Desc 1", isTextTruncated: false },
        ];
        wrapper = mount(FzStepper, { props: { steps } });
        const title = wrapper.find(".fz-stepper__title");
        expect(title.classes()).not.toContain("truncate");
      });

      it("should apply truncate class to description when isTextTruncated is true", () => {
        const steps = [
          { title: "Step 1", description: "Desc 1", isTextTruncated: true },
        ];
        wrapper = mount(FzStepper, { props: { steps } });
        const desc = wrapper.find(".fz-stepper__description");
        expect(desc.classes()).toContain("truncate");
      });
    });

    describe("hasStepDescription per step", () => {
      it("should show description by default when description is provided", () => {
        wrapper = mount(FzStepper, { props: { steps: mockSteps } });
        expect(wrapper.text()).toContain("First step description");
      });

      it("should hide description when hasStepDescription is false", () => {
        const steps = [
          {
            title: "Step 1",
            description: "Should be hidden",
            hasStepDescription: false,
          },
        ];
        wrapper = mount(FzStepper, { props: { steps } });
        expect(wrapper.text()).not.toContain("Should be hidden");
      });

      it("should show description when hasStepDescription is explicitly true", () => {
        const steps = [
          {
            title: "Step 1",
            description: "Should be visible",
            hasStepDescription: true,
          },
        ];
        wrapper = mount(FzStepper, { props: { steps } });
        expect(wrapper.text()).toContain("Should be visible");
      });
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should update activeStep when step is clicked", async () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const steps = wrapper.findAll(".fz-stepper__step");
      await steps[1].trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.activeStep).toBe(1);
    });

    it("should not update activeStep when clicking the current step", async () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const steps = wrapper.findAll(".fz-stepper__step");
      await steps[0].trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.activeStep).toBe(0);
    });

    it("should not update activeStep when disabled step is clicked", async () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const steps = wrapper.findAll(".fz-stepper__step");
      const initialStep = wrapper.vm.activeStep;
      await steps[3].trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.activeStep).toBe(initialStep);
    });

    it("should handle rapid step clicks", async () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const steps = wrapper.findAll(".fz-stepper__step");
      await steps[1].trigger("click");
      await wrapper.vm.$nextTick();
      await steps[2].trigger("click");
      await wrapper.vm.$nextTick();
      // Step 2 (index 2) is error but still clickable
      expect(wrapper.vm.activeStep).toBe(2);
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply static base classes", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const stepper = wrapper.find(".fz-stepper");
      expect(stepper.classes()).toContain("fz-stepper");
      expect(stepper.classes()).toContain("flex");
      expect(stepper.classes()).toContain("gap-16");
    });

    it("should apply desktop layout classes", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const stepper = wrapper.find(".fz-stepper.flex.flex-row");
      expect(stepper.exists()).toBe(true);
      expect(stepper.classes()).toContain("gap-16");
    });

    it("should apply mobile layout classes when forceMobile", () => {
      wrapper = mount(FzStepper, {
        props: { steps: mockSteps, forceMobile: true },
      });
      const stepper = wrapper.find(".fz-stepper.flex.flex-col");
      expect(stepper.exists()).toBe(true);
      expect(stepper.classes()).toContain("gap-8");
    });

    it("should apply disabled state classes to disabled steps", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const steps = wrapper.findAll(".fz-stepper__step");
      const disabledStep = steps[3];
      expect(disabledStep.classes()).toContain("opacity-[.2]");
      expect(disabledStep.classes()).toContain("!cursor-not-allowed");
    });

    it("should apply blue progress bar for current step in frontoffice", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const progressBars = wrapper.findAll(".fz-stepper__progress");
      expect(progressBars[0].classes()).toContain("bg-blue-500");
    });

    it("should apply blue progress bar for current step in backoffice", () => {
      wrapper = mount(FzStepper, {
        props: { steps: mockSteps, environment: "backoffice" },
      });
      const progressBars = wrapper.findAll(".fz-stepper__progress");
      expect(progressBars[0].classes()).toContain("bg-blue-500");
    });

    it("should apply completed bar class", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const progressBars = wrapper.findAll(".fz-stepper__progress");
      // Step 2 (index 1) is completed
      expect(progressBars[1].classes()).toContain("bg-grey-500");
    });

    it("should apply solid error fill style for error progress bar", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const progressBars = wrapper.findAll(".fz-stepper__progress");
      // Step 3 (index 2) is error
      expect(progressBars[2].classes()).toContain("bg-semantic-error");
      expect(progressBars[2].classes()).toContain("h-[4px]");
    });

    it("should apply default (grey-200) bar class for unvisited steps", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const progressBars = wrapper.findAll(".fz-stepper__progress");
      // Step 4 (index 3) is disabled → default style
      expect(progressBars[3].classes()).toContain("bg-grey-200");
    });

    it("should apply error text color to title when step is in error", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const titles = wrapper.findAll(".fz-stepper__title");
      // Step 3 (index 2) is error
      expect(titles[2].classes()).toContain("text-semantic-error");
    });

    it("should apply core-black text color to non-error step titles", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const titles = wrapper.findAll(".fz-stepper__title");
      expect(titles[0].classes()).toContain("text-core-black");
      expect(titles[1].classes()).toContain("text-core-black");
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("should have accessible step labels", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      mockSteps.forEach((step) => {
        expect(wrapper.text()).toContain(step.title);
      });
    });

    it("should have accessible step descriptions", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      mockSteps.forEach((step) => {
        if (step.description) {
          expect(wrapper.text()).toContain(step.description);
        }
      });
    });

    it("should indicate disabled steps via opacity and cursor classes", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      const steps = wrapper.findAll(".fz-stepper__step");
      const disabledStep = steps[3];
      expect(disabledStep.classes()).toContain("opacity-[.2]");
      expect(disabledStep.classes()).toContain("!cursor-not-allowed");
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle empty steps array", () => {
      wrapper = mount(FzStepper, { props: { steps: [] } });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.findAll(".fz-stepper__step").length).toBe(0);
    });

    it("should handle single step", () => {
      const singleStep = [
        { title: "Only Step", description: "Single step description" },
      ];
      wrapper = mount(FzStepper, { props: { steps: singleStep } });
      expect(wrapper.text()).toContain("Only Step");
      expect(wrapper.findAll(".fz-stepper__step").length).toBe(1);
    });

    it("should handle steps without descriptions", () => {
      const steps = [{ title: "Step 1" }, { title: "Step 2" }];
      wrapper = mount(FzStepper, { props: { steps } });
      expect(wrapper.text()).toContain("Step 1");
      expect(wrapper.text()).toContain("Step 2");
      expect(wrapper.findAll(".fz-stepper__description").length).toBe(0);
    });

    it("should handle activeStep beyond steps length", async () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      wrapper.vm.activeStep = 100;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.activeStep).toBe(100);
    });

    it("should handle steps with very long titles", () => {
      const longTitleSteps = [
        { title: "A".repeat(200), description: "Description" },
      ];
      wrapper = mount(FzStepper, { props: { steps: longTitleSteps } });
      expect(wrapper.text()).toContain("A".repeat(200));
    });

    it("should handle multiple stepper instances independently", () => {
      const props: FzStepperProps = { steps: mockSteps };
      const wrapper1 = mount(FzStepper, { props });
      const wrapper2 = mount(FzStepper, { props });

      wrapper1.vm.activeStep = 1;
      expect(wrapper2.vm.activeStep).toBe(0);

      wrapper1.unmount();
      wrapper2.unmount();
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - hasStepbar false", () => {
      wrapper = mount(FzStepper, {
        props: { steps: mockSteps, hasStepbar: false },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - backoffice environment", () => {
      wrapper = mount(FzStepper, {
        props: { steps: mockSteps, environment: "backoffice" },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - forceMobile", () => {
      wrapper = mount(FzStepper, {
        props: { steps: mockSteps, forceMobile: true },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - mobile without stepper list", () => {
      wrapper = mount(FzStepper, {
        props: { steps: mockSteps, forceMobile: true, hasStepperList: false },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - activeStep 2", async () => {
      wrapper = mount(FzStepper, { props: { steps: mockSteps } });
      wrapper.vm.activeStep = 2;
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
