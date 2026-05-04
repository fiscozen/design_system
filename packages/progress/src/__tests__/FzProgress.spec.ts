import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FzProgress from "../FzProgress.vue";

// Mock FontAwesome icon component
const mockFontAwesomeIcon = {
  name: "FontAwesomeIcon",
  props: ["icon", "size", "spin", "variant"],
  template: "<svg></svg>",
};

describe("FzProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with default props", () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.findComponent({ name: "FzIcon" }).exists()).toBe(true);
    });

    it("should render FzIcon component", () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      const icon = wrapper.findComponent({ name: "FzIcon" });
      expect(icon.exists()).toBe(true);
    });
  });

  // ============================================
  // INTERNAL CONSTANTS
  // ============================================
  describe("Internal constants", () => {
    it("should always render the spinner-third icon", () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      const icon = wrapper.findComponent({ name: "FzIcon" });
      expect(icon.props("name")).toBe("spinner-third");
    });

    it('should always use variant "fas"', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      const icon = wrapper.findComponent({ name: "FzIcon" });
      expect(icon.props("variant")).toBe("fas");
    });

    it("should always pass spin=true to FzIcon", () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      const icon = wrapper.findComponent({ name: "FzIcon" });
      expect(icon.props("spin")).toBe(true);
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("size prop", () => {
      it('should default to "lg" when not provided', () => {
        const wrapper = mount(FzProgress, {
          global: {
            stubs: {
              "font-awesome-icon": mockFontAwesomeIcon,
            },
          },
        });
        const icon = wrapper.findComponent({ name: "FzIcon" });
        expect(icon.props("size")).toBe("lg");
      });

      it.each([
        ["xs", "xs"],
        ["sm", "sm"],
        ["md", "md"],
        ["lg", "lg"],
        ["xl", "xl"],
        ["2xl", "2xl"],
      ])("should pass %s size prop to FzIcon", (size, expected) => {
        const wrapper = mount(FzProgress, {
          props: { size },
          global: {
            stubs: {
              "font-awesome-icon": mockFontAwesomeIcon,
            },
          },
        });
        const icon = wrapper.findComponent({ name: "FzIcon" });
        expect(icon.props("size")).toBe(expected);
      });
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should not emit any custom events (presentational component)", () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      expect(wrapper.emitted()).toEqual({});
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it('should apply the "fz-progress" class on the wrapper', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      const root = wrapper.find('[role="status"]');
      expect(root.classes()).toContain("fz-progress");
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it('should render a wrapper with role="status"', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      const root = wrapper.find('[role="status"]');
      expect(root.exists()).toBe(true);
    });

    it('should default aria-label to "Caricamento…"', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      const root = wrapper.find('[role="status"]');
      expect(root.attributes("aria-label")).toBe("Caricamento…");
    });

    it("should accept a custom label prop", () => {
      const wrapper = mount(FzProgress, {
        props: { label: "Loading results" },
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      const root = wrapper.find('[role="status"]');
      expect(root.attributes("aria-label")).toBe("Loading results");
    });

    it("should render the label as visually-hidden text for screen readers", () => {
      const wrapper = mount(FzProgress, {
        props: { label: "Loading results" },
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      const srOnly = wrapper.find(".sr-only");
      expect(srOnly.exists()).toBe(true);
      expect(srOnly.text()).toBe("Loading results");
    });

    it("should keep aria-label and sr-only text in sync", () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      const root = wrapper.find('[role="status"]');
      const srOnly = wrapper.find(".sr-only");
      expect(root.attributes("aria-label")).toBe(srOnly.text());
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with custom size", () => {
      const wrapper = mount(FzProgress, {
        props: {
          size: "xl",
        },
        global: {
          stubs: {
            "font-awesome-icon": mockFontAwesomeIcon,
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
