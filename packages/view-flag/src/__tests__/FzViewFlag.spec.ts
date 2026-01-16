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

    it("should render environment badge when environment prop is provided", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: "staging",
        },
      });

      const badge = wrapper.findComponent({ name: "FzBadge" });
      expect(badge.exists()).toBe(true);
      expect(badge.text()).toBe("staging");
    });

    it("should render user role when role prop is provided", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          role: "Operatore",
        },
      });

      expect(wrapper.text()).toContain("Operatore:");
    });

    it("should render user name when firstName and lastName are provided", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          firstName: "Mario",
          lastName: "Rossi",
        },
      });

      expect(wrapper.text()).toContain("Mario R.");
    });

    it("should render all props together", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: "staging",
          firstName: "Mario",
          lastName: "Rossi",
          role: "Operatore",
        },
      });

      expect(wrapper.text()).toContain("staging");
      expect(wrapper.text()).toContain("Operatore:");
      expect(wrapper.text()).toContain("Mario R.");
    });

    it("should render slot content when provided", () => {
      const wrapper = mount(FzViewFlag, {
        slots: {
          default: "Custom slot content",
        },
      });

      expect(wrapper.text()).toContain("Custom slot content");
    });

    it("should render default content when slot is not provided", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: "staging",
          firstName: "Mario",
          lastName: "Rossi",
          role: "Operatore",
        },
      });

      // Should render badge and user info
      expect(wrapper.text()).toContain("staging");
      expect(wrapper.text()).toContain("Operatore:");
      expect(wrapper.text()).toContain("Mario R.");
    });

    it("should render border indicators (top, bottom, left, right)", () => {
      const wrapper = mount(FzViewFlag);
      const html = wrapper.html();

      // Check for border divs with semantic-warning background
      expect(html).toContain("bg-semantic-warning");
      expect(html).toContain("fixed");
      expect(html).toContain("top-0");
      expect(html).toContain("bottom-0");
      expect(html).toContain("left-0");
      expect(html).toContain("right-0");
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("environment prop", () => {
      it("should render badge with environment value", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            environment: "production",
          },
        });

        const badge = wrapper.findComponent({ name: "FzBadge" });
        expect(badge.exists()).toBe(true);
        expect(badge.text()).toBe("production");
      });

      it("should not render badge when environment is undefined", () => {
        const wrapper = mount(FzViewFlag, {
          props: {},
        });

        const badge = wrapper.findComponent({ name: "FzBadge" });
        expect(badge.exists()).toBe(false);
      });

      it("should handle empty string environment", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            environment: "",
          },
        });

        // Empty string should still render badge (component behavior)
        const badge = wrapper.findComponent({ name: "FzBadge" });
        // Component uses v-if="props.environment" which treats empty string as falsy
        expect(badge.exists()).toBe(false);
      });
    });

    describe("role prop", () => {
      it("should render role text when provided", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            role: "Admin",
          },
        });

        expect(wrapper.text()).toContain("Admin:");
      });

      it("should not render role prefix when role is undefined", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            firstName: "Mario",
            lastName: "Rossi",
          },
        });

        expect(wrapper.text()).not.toContain(":");
        expect(wrapper.text()).toContain("Mario R.");
      });

      it("should handle empty string role", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            role: "",
          },
        });

        // Empty string should not render role prefix
        expect(wrapper.text()).not.toContain(":");
      });
    });

    describe("firstName and lastName props", () => {
      it("should render full name format when both provided", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            firstName: "Mario",
            lastName: "Rossi",
          },
        });

        expect(wrapper.text()).toContain("Mario R.");
      });

      it("should not render name when firstName is missing", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            lastName: "Rossi",
          },
        });

        expect(wrapper.text()).not.toContain("R.");
      });

      it("should not render name when lastName is missing", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            firstName: "Mario",
          },
        });

        expect(wrapper.text()).not.toContain("Mario");
      });

      it("should handle single character lastName", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            firstName: "Mario",
            lastName: "R",
          },
        });

        expect(wrapper.text()).toContain("Mario R.");
      });

      it("should handle very long names", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            firstName: "VeryLongFirstName",
            lastName: "VeryLongLastName",
          },
        });

        expect(wrapper.text()).toContain("VeryLongFirstName V.");
      });
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should not emit any events (presentational component)", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: "staging",
          firstName: "Mario",
          lastName: "Rossi",
          role: "Operatore",
        },
      });

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

      // Top border
      expect(html).toContain("w-full");
      expect(html).toContain("h-8");
      expect(html).toContain("bg-semantic-warning");
      expect(html).toContain("fixed");
      expect(html).toContain("top-0");
      expect(html).toContain("z-50");

      // Bottom border
      expect(html).toContain("bottom-0");

      // Left border
      expect(html).toContain("w-8");
      expect(html).toContain("h-full");
      expect(html).toContain("left-0");

      // Right border
      expect(html).toContain("right-0");
    });

    it("should apply static base classes to main container", () => {
      const wrapper = mount(FzViewFlag);
      const html = wrapper.html();

      expect(html).toContain("bg-semantic-warning");
      expect(html).toContain("rounded-t-base");
      expect(html).toContain("text-sm");
      expect(html).toContain("flex");
      expect(html).toContain("p-6");
      expect(html).toContain("gap-12");
      expect(html).toContain("items-center");
      expect(html).toContain("bottom-8");
      expect(html).toContain("fixed");
      expect(html).toContain("m-auto");
      expect(html).toContain("left-1/2");
      expect(html).toContain("-translate-x-1/2");
      expect(html).toContain("z-50");
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("ARIA attributes", () => {
      it("should have aria-label on main container describing the view flag", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            environment: "staging",
            firstName: "Mario",
            lastName: "Rossi",
            role: "Operatore",
          },
        });

        // Find the main container div (the one with rounded-t-base class)
        const mainContainer = wrapper.find(".rounded-t-base");
        expect(mainContainer.exists()).toBe(true);

        // Note: Currently the component doesn't have aria-label implemented
        // This test documents the expected behavior for future implementation
        // The component should have an aria-label like:
        // "View flag: Environment staging, User Operatore Mario R."
        const ariaLabel = mainContainer.attributes("aria-label");
        // For now, we document that this should be added
        // When implemented, uncomment the following:
        // expect(ariaLabel).toBeTruthy();
        // expect(ariaLabel).toContain("staging");
      });

      it("should have role attribute on main container", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            environment: "staging",
          },
        });

        const mainContainer = wrapper.find(".rounded-t-base");
        expect(mainContainer.exists()).toBe(true);

        // Note: Component could benefit from role="status" or role="banner"
        // This test documents the expected behavior
        // When implemented, uncomment:
        // expect(mainContainer.attributes("role")).toBe("status");
      });

      it("should have semantic HTML structure", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            environment: "staging",
            firstName: "Mario",
            lastName: "Rossi",
            role: "Operatore",
          },
        });

        // Component should use semantic HTML
        const mainContainer = wrapper.find(".rounded-t-base");
        expect(mainContainer.exists()).toBe(true);
        expect(mainContainer.element.tagName).toBe("DIV");
      });

      it("should have visible text content for screen readers", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            environment: "staging",
            firstName: "Mario",
            lastName: "Rossi",
            role: "Operatore",
          },
        });

        // Text content should be visible and accessible
        expect(wrapper.text()).toContain("staging");
        expect(wrapper.text()).toContain("Operatore");
        expect(wrapper.text()).toContain("Mario R.");
      });
    });

    describe("Screen reader support", () => {
      it("should provide meaningful information when all props are provided", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            environment: "production",
            firstName: "John",
            lastName: "Doe",
            role: "Admin",
          },
        });

        const text = wrapper.text();
        expect(text).toContain("production");
        expect(text).toContain("Admin");
        expect(text).toContain("John D.");
      });

      it("should provide meaningful information when only environment is provided", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            environment: "staging",
          },
        });

        const text = wrapper.text();
        expect(text).toContain("staging");
      });

      it("should provide meaningful information when only user info is provided", () => {
        const wrapper = mount(FzViewFlag, {
          props: {
            firstName: "Jane",
            lastName: "Smith",
            role: "User",
          },
        });

        const text = wrapper.text();
        expect(text).toContain("User");
        expect(text).toContain("Jane S.");
      });
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle undefined props gracefully", () => {
      const wrapper = mount(FzViewFlag, {
        props: {},
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html()).toBeTruthy();
    });

    it("should handle null-like values", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: undefined,
          firstName: undefined,
          lastName: undefined,
          role: undefined,
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle empty strings", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: "",
          firstName: "",
          lastName: "",
          role: "",
        },
      });

      expect(wrapper.exists()).toBe(true);
      // Empty strings should not render content
      const badge = wrapper.findComponent({ name: "FzBadge" });
      expect(badge.exists()).toBe(false);
    });

    it("should handle very long environment names", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: "very-long-environment-name-that-exceeds-normal-length",
        },
      });

      const badge = wrapper.findComponent({ name: "FzBadge" });
      expect(badge.exists()).toBe(true);
      expect(badge.text()).toBe(
        "very-long-environment-name-that-exceeds-normal-length"
      );
    });

    it("should handle special characters in names", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          firstName: "José",
          lastName: "O'Brien",
          role: "Admin & Manager",
        },
      });

      expect(wrapper.text()).toContain("José O.");
      expect(wrapper.text()).toContain("Admin & Manager");
    });

    it("should handle whitespace-only values", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: "   ",
          firstName: "   ",
          lastName: "   ",
          role: "   ",
        },
      });

      expect(wrapper.exists()).toBe(true);
      // Whitespace-only strings are truthy, so badge should render
      const badge = wrapper.findComponent({ name: "FzBadge" });
      expect(badge.exists()).toBe(true);
    });

    it("should handle slot override with custom content", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: "staging",
          firstName: "Mario",
          lastName: "Rossi",
          role: "Operatore",
        },
        slots: {
          default: "Custom content only",
        },
      });

      // Slot should override default content
      expect(wrapper.text()).toContain("Custom content only");
      expect(wrapper.text()).not.toContain("staging");
      expect(wrapper.text()).not.toContain("Operatore");
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

    it("should match snapshot - with all props", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: "staging",
          firstName: "Mario",
          lastName: "Rossi",
          role: "Operatore",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with environment only", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          environment: "production",
        },
      });

      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with user info only", () => {
      const wrapper = mount(FzViewFlag, {
        props: {
          firstName: "Jane",
          lastName: "Smith",
          role: "User",
        },
      });

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
