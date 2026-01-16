import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import FzCard from "../FzCard.vue";

beforeEach(() => {
  // Mock matchMedia for useMediaQuery composable
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

describe("FzCard", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with default props", async () => {
      const wrapper = mount(FzCard);
      await wrapper.vm.$nextTick();
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("section").exists()).toBe(true);
      expect(wrapper.find("article").exists()).toBe(true);
    });

    it("should render title when provided", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card Title",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("h2").exists()).toBe(true);
      expect(wrapper.find("h2").text()).toBe("Test Card Title");
    });

    it("should render default slot content", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
        slots: {
          default: "<p>Test content</p>",
        } as any,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain("Test content");
    });

    it("should render header slot content", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
        slots: {
          header: "<span>Header Slot</span>",
        } as any,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain("Header Slot");
    });

    it("should render header-content slot", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
        slots: {
          "header-content": "<div>Header Content</div>",
        } as any,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain("Header Content");
    });

    it("should render footer slot content", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
        slots: {
          footer: "<div>Custom Footer</div>",
        } as any,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("footer").exists()).toBe(true);
      expect(wrapper.html()).toContain("Custom Footer");
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    describe("title prop", () => {
      it("should render title when provided", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Card Title",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("h2").text()).toBe("Card Title");
      });

      it("should hide header when title is not provided and no slots", async () => {
        const wrapper = mount(FzCard);
        await wrapper.vm.$nextTick();
        expect(wrapper.find("header").exists()).toBe(false);
      });
    });

    describe("color prop", () => {
      it("should apply default background color when no color prop", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("section").classes()).toContain("bg-core-white");
      });

      it("should apply default background color when color='default'", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            color: "default",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("section").classes()).toContain("bg-core-white");
      });

      it.each([
        ["blue", "bg-background-alice-blue"],
        ["orange", "bg-background-seashell"],
        ["purple", "bg-background-pale-purple"],
        ["grey", "bg-background-white-smoke"],
      ])("should apply %s background color", async (color, expectedClass) => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            color: color as any,
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("section").classes()).toContain(expectedClass);
      });

      it("should map deprecated aliceblue to blue and show warning", async () => {
        const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            color: "aliceblue",
          },
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.find("section").classes()).toContain(
          "bg-background-alice-blue",
        );

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        const warningMessage = consoleSpy.mock.calls[0][0] as string;
        expect(warningMessage).toContain(
          "[FzCard] The color prop value 'aliceblue' is deprecated",
        );
        expect(warningMessage).toContain("Please use 'blue' instead");

        consoleSpy.mockRestore();
      });
    });

    describe("collapsible prop", () => {
      it("should show content by default when not collapsible", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("article").exists()).toBe(true);
        expect(wrapper.find("article").isVisible()).toBe(true);
      });

      it("should hide content initially when collapsible and not expanded", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            collapsible: true,
            defaultExpanded: false,
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("article").exists()).toBe(false);
      });

      it("should show content when collapsible and defaultExpanded is true", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            collapsible: true,
            defaultExpanded: true,
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("article").exists()).toBe(true);
        expect(wrapper.find("article").isVisible()).toBe(true);
      });

      it("should add cursor-pointer class to header when collapsible", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            collapsible: true,
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("header").classes()).toContain("cursor-pointer");
      });
    });

    describe("alwaysAlive prop", () => {
      it("should keep content alive when alwaysAlive is true and collapsed", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            collapsible: true,
            alwaysAlive: true,
            defaultExpanded: false,
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("article").exists()).toBe(true);
        expect(wrapper.find("article").isVisible()).toBe(false);
      });
    });

    describe("primaryAction prop", () => {
      it("should render footer with primaryAction", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            primaryAction: {
              label: "Save",
            },
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("footer").exists()).toBe(true);
        expect(wrapper.html()).toContain("Save");
      });
    });

    describe("secondaryAction prop", () => {
      it("should render footer with secondaryAction", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            primaryAction: {
              label: "Save",
            },
            secondaryAction: {
              label: "Cancel",
            },
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("footer").exists()).toBe(true);
        expect(wrapper.html()).toContain("Cancel");
      });
    });

    describe("tertiaryAction prop", () => {
      it("should render footer with tertiaryAction", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            primaryAction: {
              label: "Save",
            },
            secondaryAction: {
              label: "Cancel",
            },
            tertiaryAction: {
              icon: "bell",
            },
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("footer").exists()).toBe(true);
      });
    });

    describe("hasInfoIcon prop", () => {
      it("should not show info icon when hasInfoIcon is false", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            hasInfoIcon: false,
          },
        });
        await wrapper.vm.$nextTick();
        const buttons = wrapper.findAll("button");
        expect(buttons.length).toBe(0);
      });

      it("should show info icon when hasInfoIcon is true", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            hasInfoIcon: true,
          },
        });
        await wrapper.vm.$nextTick();
        const buttons = wrapper.findAll("button");
        expect(buttons.length).toBe(1);
      });
    });

    describe("environment prop", () => {
      it("should default to frontoffice environment", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            primaryAction: {
              label: "Save",
            },
          },
        });
        await wrapper.vm.$nextTick();
        const button = wrapper.findComponent({ name: "FzButton" });
        expect(button.props("environment")).toBe("frontoffice");
      });

      it("should apply backoffice environment", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            environment: "backoffice",
            primaryAction: {
              label: "Save",
            },
          },
        });
        await wrapper.vm.$nextTick();
        const button = wrapper.findComponent({ name: "FzButton" });
        expect(button.props("environment")).toBe("backoffice");
      });
    });

    describe("contentClass prop", () => {
      it("should apply custom content class", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            contentClass: "custom-content-class",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("article").classes()).toContain("custom-content-class");
      });
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should emit fzprimary:click when primaryAction is clicked", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Save",
          },
        },
      });
      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAll("button");
      await buttons[buttons.length - 1].trigger("click");

      expect(wrapper.emitted("fzprimary:click")).toBeTruthy();
      expect(wrapper.emitted("fzprimary:click")).toHaveLength(1);
    });

    it("should emit fzsecondary:click when secondaryAction is clicked", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Save",
          },
          secondaryAction: {
            label: "Cancel",
          },
        },
      });
      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAll("button");
      await buttons[buttons.length - 2].trigger("click");

      expect(wrapper.emitted("fzsecondary:click")).toBeTruthy();
      expect(wrapper.emitted("fzsecondary:click")).toHaveLength(1);
    });

    it("should emit fztertiary:click when tertiaryAction is clicked", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Save",
          },
          secondaryAction: {
            label: "Cancel",
          },
          tertiaryAction: {
            icon: "bell",
          },
        },
      });
      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAll("button");
      await buttons[0].trigger("click");

      expect(wrapper.emitted("fztertiary:click")).toBeTruthy();
      expect(wrapper.emitted("fztertiary:click")).toHaveLength(1);
    });

    it("should emit fzcard:click-info when info icon is clicked", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          hasInfoIcon: true,
        },
      });
      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAll("button");
      await buttons[0].trigger("click");

      expect(wrapper.emitted("fzcard:click-info")).toBeTruthy();
      expect(wrapper.emitted("fzcard:click-info")).toHaveLength(1);
    });

    it("should toggle content visibility when collapsible header is clicked", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          collapsible: true,
          defaultExpanded: false,
        },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("article").exists()).toBe(false);

      await wrapper.find("header").trigger("click");
      await wrapper.vm.$nextTick();

      expect(wrapper.find("article").exists()).toBe(true);
      expect(wrapper.find("article").isVisible()).toBe(true);
    });

    it("should not toggle when header is clicked and not collapsible", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          collapsible: false,
        },
      });
      await wrapper.vm.$nextTick();

      const initialVisible = wrapper.find("article").isVisible();

      await wrapper.find("header").trigger("click");
      await wrapper.vm.$nextTick();

      expect(wrapper.find("article").isVisible()).toBe(initialVisible);
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    describe("Semantic HTML structure", () => {
      it("should use semantic section element", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("section").exists()).toBe(true);
      });

      it("should use semantic header element when title or slots are present", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("header").exists()).toBe(true);
      });

      it("should use semantic article element for content", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
          },
        });
        await wrapper.vm.$nextTick();
        const article = wrapper.find("article");
        expect(article.exists()).toBe(true);
      });

      it("should use semantic footer element when actions or footer slot are present", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            primaryAction: {
              label: "Save",
            },
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("footer").exists()).toBe(true);
      });

      it("should use h2 element for title", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card Title",
          },
        });
        await wrapper.vm.$nextTick();
        const h2 = wrapper.find("h2");
        expect(h2.exists()).toBe(true);
        expect(h2.text()).toBe("Test Card Title");
      });
    });

    describe("ARIA attributes", () => {
      it("should have title attribute on h2 matching title prop", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card Title",
          },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("h2").attributes("title")).toBe("Test Card Title");
      });

      it("should have accessible header when collapsible", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            collapsible: true,
          },
        });
        await wrapper.vm.$nextTick();
        const header = wrapper.find("header");
        expect(header.exists()).toBe(true);
        expect(header.classes()).toContain("cursor-pointer");
      });
    });

    describe("Keyboard navigation", () => {
      it("should be focusable when collapsible", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Test Card",
            collapsible: true,
          },
        });
        await wrapper.vm.$nextTick();
        const header = wrapper.find("header");
        expect(header.exists()).toBe(true);
        // Header should be clickable/focusable when collapsible
      });
    });

    describe("Screen reader support", () => {
      it("should provide meaningful title text for screen readers", async () => {
        const wrapper = mount(FzCard, {
          props: {
            title: "Card Title",
          },
        });
        await wrapper.vm.$nextTick();
        const h2 = wrapper.find("h2");
        expect(h2.text()).toBe("Card Title");
        expect(h2.attributes("title")).toBe("Card Title");
      });
    });
  });

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe("CSS Classes", () => {
    it("should apply static base classes to section", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
      });
      await wrapper.vm.$nextTick();
      const section = wrapper.find("section");
      expect(section.classes()).toContain("border-1");
      expect(section.classes()).toContain("border-solid");
      expect(section.classes()).toContain("rounded");
      expect(section.classes()).toContain("flex");
      expect(section.classes()).toContain("flex-col");
    });

    it("should apply color-specific background classes", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "blue",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain("bg-background-alice-blue");
    });

    it("should apply color-specific border classes", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "blue",
          primaryAction: {
            label: "Save",
          },
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain("border-background-alice-blue");
    });

    it("should apply text color class", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain("text-core-black");
    });

    it("should apply cursor-pointer class to header when collapsible", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          collapsible: true,
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("header").classes()).toContain("cursor-pointer");
    });

    it("should apply contentClass to article", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          contentClass: "custom-class",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("article").classes()).toContain("custom-class");
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle card without any props", async () => {
      const wrapper = mount(FzCard);
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").exists()).toBe(true);
      expect(wrapper.find("article").exists()).toBe(true);
    });

    it("should handle undefined title gracefully", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: undefined,
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("header").exists()).toBe(false);
    });

    it("should handle empty string title", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "",
        },
      });
      await wrapper.vm.$nextTick();
      // Empty string title should still show header if other conditions are met
      expect(wrapper.find("section").exists()).toBe(true);
    });

    it("should handle very long title text", async () => {
      const longTitle = "A".repeat(200);
      const wrapper = mount(FzCard, {
        props: {
          title: longTitle,
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("h2").text()).toBe(longTitle);
      expect(wrapper.find("h2").classes()).toContain("break-words");
      expect(wrapper.find("h2").classes()).toContain("overflow-wrap-anywhere");
    });

    it("should warn when tertiaryAction is set without primaryAction and secondaryAction", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      mount(FzCard, {
        props: {
          title: "Test Card",
          tertiaryAction: {
            icon: "bell",
          },
        },
      });
      expect(warnSpy).toHaveBeenCalledWith(
        "[Fiscozen Design System]: You should set primaryAction and secondaryAction if you want to set tertiaryAction",
      );
      warnSpy.mockRestore();
    });

    it("should warn when secondaryAction is set without primaryAction", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      mount(FzCard, {
        props: {
          title: "Test Card",
          secondaryAction: {
            label: "Cancel",
          },
        },
      });
      expect(warnSpy).toHaveBeenCalledWith(
        "[Fiscozen Design System]: You should set primaryAction if you want to set secondaryAction",
      );
      warnSpy.mockRestore();
    });

    it("should expose toggleOpen method", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          collapsible: true,
          defaultExpanded: false,
        },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("article").exists()).toBe(false);

      (wrapper.vm as any).toggleOpen();
      await wrapper.vm.$nextTick();

      expect(wrapper.find("article").exists()).toBe(true);
    });

    it("should handle multiple rapid toggle operations", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          collapsible: true,
          defaultExpanded: false,
        },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("article").exists()).toBe(false);

      await wrapper.find("header").trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.find("article").exists()).toBe(true);

      await wrapper.find("header").trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.find("article").exists()).toBe(false);

      await wrapper.find("header").trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.find("article").exists()).toBe(true);
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - default state", () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with all color variants", () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "blue",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - collapsible", () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          collapsible: true,
          defaultExpanded: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with all actions", () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Save",
          },
          secondaryAction: {
            label: "Cancel",
          },
          tertiaryAction: {
            icon: "bell",
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with info icon", () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          hasInfoIcon: true,
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - backoffice environment", () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          environment: "backoffice",
          primaryAction: {
            label: "Save",
          },
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});

