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

    it("should render default slot content when provided", () => {
      const wrapper = mount(FzViewFlag, {
        slots: {
          default: "Custom slot content",
        },
      });

      expect(wrapper.text()).toContain("Custom slot content");
    });

    it("should render empty when no slot content is provided", () => {
      const wrapper = mount(FzViewFlag);

      const inner = wrapper.find(".rounded-t-base");
      expect(inner.exists()).toBe(true);
      expect(inner.text()).toBe("");
    });

    it("should not render banner section when open is false", () => {
      const wrapper = mount(FzViewFlag, {
        props: { open: false },
      });

      expect(wrapper.find(".isolate").exists()).toBe(false);
    });

    it("should not render banner section when open is undefined", () => {
      const wrapper = mount(FzViewFlag);

      expect(wrapper.find(".isolate").exists()).toBe(false);
    });

    it("should render banner slot when open is true", () => {
      const wrapper = mount(FzViewFlag, {
        props: { open: true },
        slots: {
          banner: "Banner content",
        },
      });

      expect(wrapper.find(".isolate").exists()).toBe(true);
      expect(wrapper.text()).toContain("Banner content");
    });

    it("should render border wrapper", () => {
      const wrapper = mount(FzViewFlag);
      const html = wrapper.html();

      expect(html).toContain("border-8");
      expect(html).toContain("border-semantic-warning");
      expect(html).toContain("fixed");
      expect(html).toContain("inset-0");
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("open prop", () => {
      it("should hide banner section when open is false", () => {
        const wrapper = mount(FzViewFlag, {
          props: { open: false },
          slots: { banner: "Banner content" },
        });

        expect(wrapper.find(".isolate").exists()).toBe(false);
        expect(wrapper.text()).not.toContain("Banner content");
      });

      it("should show banner section when open is true", () => {
        const wrapper = mount(FzViewFlag, {
          props: { open: true },
          slots: { banner: "Banner content" },
        });

        expect(wrapper.find(".isolate").exists()).toBe(true);
        expect(wrapper.text()).toContain("Banner content");
      });

      it("should default open to falsy when not provided", () => {
        const wrapper = mount(FzViewFlag);

        expect(wrapper.find(".isolate").exists()).toBe(false);
      });
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should not emit any events (presentational component)", () => {
      const wrapper = mount(FzViewFlag);

      expect(wrapper.emitted()).toEqual({});
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply static base classes to the outer border wrapper", () => {
      const wrapper = mount(FzViewFlag);
      const html = wrapper.html();

      expect(html).toContain("border-8");
      expect(html).toContain("border-semantic-warning");
      expect(html).toContain("fixed");
      expect(html).toContain("inset-0");
      expect(html).toContain("pointer-events-none");
      expect(html).toContain("z-50");
    });

    it("should apply static base classes to the inner container", () => {
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
      expect(html).toContain("w-full");
      expect(html).toContain("pointer-events-auto");
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("should have main container with rounded-t-base", () => {
      const wrapper = mount(FzViewFlag);

      expect(wrapper.find(".rounded-t-base").exists()).toBe(true);
    });

    it("should have semantic HTML structure (div elements)", () => {
      const wrapper = mount(FzViewFlag);

      const mainContainer = wrapper.find(".rounded-t-base");
      expect(mainContainer.element.tagName).toBe("DIV");
    });

    it("should expose default slot content as visible text", () => {
      const wrapper = mount(FzViewFlag, {
        slots: {
          default: "Staging – Operatore Mario R.",
        },
      });

      expect(wrapper.text()).toContain("Staging – Operatore Mario R.");
    });

    it("should expose banner slot content as visible text when open", () => {
      const wrapper = mount(FzViewFlag, {
        props: { open: true },
        slots: {
          banner: "Banner: Admin",
        },
      });

      expect(wrapper.text()).toContain("Banner: Admin");
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should render without errors when no props or slots are provided", () => {
      const wrapper = mount(FzViewFlag);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html()).toBeTruthy();
    });

    it("should render default slot even when open is true", () => {
      const wrapper = mount(FzViewFlag, {
        props: { open: true },
        slots: {
          default: "Main content",
          banner: "Banner content",
        },
      });

      expect(wrapper.text()).toContain("Main content");
      expect(wrapper.text()).toContain("Banner content");
    });

    it("should not render banner slot content when open is false even if banner slot is provided", () => {
      const wrapper = mount(FzViewFlag, {
        props: { open: false },
        slots: {
          banner: "Should not appear",
        },
      });

      expect(wrapper.text()).not.toContain("Should not appear");
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

    it("should match snapshot - with default slot content", () => {
      const wrapper = mount(FzViewFlag, {
        slots: {
          default: "Custom slot content",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - open with banner slot", () => {
      const wrapper = mount(FzViewFlag, {
        props: { open: true },
        slots: {
          default: "Main content",
          banner: "Banner content",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - closed with banner slot", () => {
      const wrapper = mount(FzViewFlag, {
        props: { open: false },
        slots: {
          default: "Main content",
          banner: "Banner content",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
