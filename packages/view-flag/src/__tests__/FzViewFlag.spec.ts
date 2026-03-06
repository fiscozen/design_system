import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { FzViewFlag } from "..";

describe("FzViewFlag", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with default props", () => {
      const wrapper = mount(FzViewFlag);
      expect(wrapper.exists()).toBe(true);
    });

    it("should render slot content when provided", () => {
      const wrapper = mount(FzViewFlag, {
        slots: {
          default: "Custom slot content",
        },
      });

      expect(wrapper.text()).toContain("Custom slot content");
    });

    it("should render empty slot when slot is not provided", () => {
      const wrapper = mount(FzViewFlag);

      // Component renders structure but slot has no default content
      expect(wrapper.exists()).toBe(true);
      const inner = wrapper.find(".rounded-t-base");
      expect(inner.exists()).toBe(true);
      expect(inner.text()).toBe("");
    });

    it("should render border indicators (top, bottom, left, right)", () => {
      const wrapper = mount(FzViewFlag);
      const html = wrapper.html();

      // Single border wrapper with inset-0 (covers all edges)
      expect(html).toContain("border-8");
      expect(html).toContain("border-semantic-warning");
      expect(html).toContain("fixed");
      expect(html).toContain("inset-0");
      expect(html).toContain("bg-semantic-warning");
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    it("should not render FzBadge (content is via slot only)", () => {
      const wrapper = mount(FzViewFlag);

      const badge = wrapper.findComponent({ name: "FzBadge" });
      expect(badge.exists()).toBe(false);
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should not emit any events (presentational component)", () => {
      const wrapper = mount(FzViewFlag);

      // Component is presentational, no events should be emitted
      expect(wrapper.emitted()).toEqual({});
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply static base classes to border indicators", () => {
      const wrapper = mount(FzViewFlag);
      const html = wrapper.html();

      // Single border wrapper (border-8, border-semantic-warning, fixed, inset-0, isolate)
      expect(html).toContain("border-8");
      expect(html).toContain("border-semantic-warning");
      expect(html).toContain("fixed");
      expect(html).toContain("inset-0");
      expect(html).toContain("isolate");
      expect(html).toContain("bg-semantic-warning");
    });

    it("should apply static base classes to main container", () => {
      const wrapper = mount(FzViewFlag);
      const html = wrapper.html();

      expect(html).toContain("bg-semantic-warning");
      expect(html).toContain("rounded-t-base");
      expect(html).toContain("text-sm");
      expect(html).toContain("p-8");
      expect(html).toContain("bottom-0");
      expect(html).toContain("left-0");
      expect(html).toContain("right-0");
      expect(html).toContain("fixed");
      expect(html).toContain("m-auto");
      expect(html).toContain("empty:hidden");
      expect(html).toContain("w-fit");
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("ARIA attributes", () => {
      it("should have main container with rounded-t-base", () => {
        const wrapper = mount(FzViewFlag);

        const mainContainer = wrapper.find(".rounded-t-base");
        expect(mainContainer.exists()).toBe(true);
      });

      it("should have role attribute on main container", () => {
        const wrapper = mount(FzViewFlag);

        const mainContainer = wrapper.find(".rounded-t-base");
        expect(mainContainer.exists()).toBe(true);
      });

      it("should have semantic HTML structure", () => {
        const wrapper = mount(FzViewFlag);

        const mainContainer = wrapper.find(".rounded-t-base");
        expect(mainContainer.exists()).toBe(true);
        expect(mainContainer.element.tagName).toBe("DIV");
      });

      it("should show slot content for screen readers when provided", () => {
        const wrapper = mount(FzViewFlag, {
          slots: {
            default: "View flag: staging – Operatore Mario R.",
          },
        });

        expect(wrapper.text()).toContain("View flag: staging – Operatore Mario R.");
      });
    });

    describe("Screen reader support", () => {
      it("should expose slot content as visible text", () => {
        const wrapper = mount(FzViewFlag, {
          slots: {
            default: "Production – Admin",
          },
        });

        expect(wrapper.text()).toContain("Production – Admin");
      });
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle slot override with custom content", () => {
      const wrapper = mount(FzViewFlag, {
        slots: {
          default: "Custom content only",
        },
      });

      expect(wrapper.text()).toContain("Custom content only");
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", () => {
      const wrapper = mount(FzViewFlag);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with custom slot", () => {
      const wrapper = mount(FzViewFlag, {
        slots: {
          default: "Custom slot content",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
