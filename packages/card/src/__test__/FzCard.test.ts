import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import FzCard from "../FzCard.vue";

describe("FzCard", () => {
  describe("Rendering", () => {
    it("renders correctly and matches snapshot", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain("Test Card");
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("renders title when provided", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card Title",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("h2").text()).toBe("Test Card Title");
    });

    it("renders default slot content", async () => {
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
  });

  describe("Props: color", () => {
    it("applies default background color when no color prop", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain("bg-core-white");
    });

    it("applies default background color when color='default'", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "default",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain("bg-core-white");
    });

    it("applies blue background color (alice-blue)", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "blue",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain(
        "bg-background-alice-blue",
      );
    });

    it("applies orange background color (seashell)", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "orange",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain(
        "bg-background-seashell",
      );
    });

    it("applies purple background color (pale-purple)", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "purple",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain(
        "bg-background-pale-purple",
      );
    });

    it("applies grey background color (white-smoke)", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "grey",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain(
        "bg-background-white-smoke",
      );
    });

    it("applies correct border color for blue", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "blue",
          primaryAction: {
            label: "Action 1",
          },
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain(
        "border-background-alice-blue",
      );
    });

    it("applies correct border color for orange", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "orange",
          primaryAction: {
            label: "Action 1",
          },
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain("border-orange-200");
    });

    it("applies correct border color for purple", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "purple",
          primaryAction: {
            label: "Action 1",
          },
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain("border-purple-200");
    });

    it("applies correct border color for grey", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "grey",
          primaryAction: {
            label: "Action 1",
          },
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain("border-grey-200");
    });

    it("applies default border color when no color prop", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Action 1",
          },
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").classes()).toContain("border-grey-100");
    });

    it("maps deprecated aliceblue to blue and shows warning", async () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          color: "aliceblue",
        },
      });

      await wrapper.vm.$nextTick();

      // Verify aliceblue is mapped to blue (alice-blue background)
      expect(wrapper.find("section").classes()).toContain(
        "bg-background-alice-blue",
      );

      // Verify warning was shown
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      const warningMessage = consoleSpy.mock.calls[0][0] as string;
      expect(warningMessage).toContain(
        "[FzCard] The color prop value 'aliceblue' is deprecated",
      );
      expect(warningMessage).toContain("Please use 'blue' instead");

      consoleSpy.mockRestore();
    });
  });

  describe("Props: collapsible", () => {
    it("should expand and collapse when collapsible is true", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          collapsible: true,
        },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("article").exists()).toBeFalsy();
      await wrapper.find("header").find("button").trigger("click");
      expect(wrapper.find("article").exists()).toBeTruthy();
    });

    it("should show content by default when not collapsible", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("article").exists()).toBeTruthy();
    });

    it("should respect defaultExpanded prop", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          collapsible: true,
          defaultExpanded: true,
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("article").exists()).toBeTruthy();
    });

    it("should keep content alive when alwaysAlive is true", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          collapsible: true,
          alwaysAlive: true,
        },
      });
      await wrapper.vm.$nextTick();
      // Content should exist even when collapsed
      expect(wrapper.find("article").exists()).toBeTruthy();
    });
  });

  describe("Props: actions", () => {
    it("renders footer with primaryAction", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Action 1",
          },
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.find("footer").exists()).toBeTruthy();
      expect(wrapper.html()).toContain("Action 1");
    });

    it("renders footer with primaryAction and secondaryAction", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Primary",
          },
          secondaryAction: {
            label: "Secondary",
          },
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.find("footer").exists()).toBeTruthy();
      expect(wrapper.html()).toContain("Primary");
      expect(wrapper.html()).toContain("Secondary");
    });

    it("renders footer with all three actions", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Primary",
          },
          secondaryAction: {
            label: "Secondary",
          },
          tertiaryAction: {
            icon: "bell",
          },
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.find("footer").exists()).toBeTruthy();
    });

    it("warns if tertiaryAction is set without primaryAction and secondaryAction", () => {
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

    it("warns if secondaryAction is set without primaryAction", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      mount(FzCard, {
        props: {
          title: "Test Card",
          secondaryAction: {
            label: "Action 2",
          },
        },
      });

      expect(warnSpy).toHaveBeenCalledWith(
        "[Fiscozen Design System]: You should set primaryAction if you want to set secondaryAction",
      );
      warnSpy.mockRestore();
    });
  });

  describe("Events", () => {
    it("should emit fzprimary:click when primaryAction is clicked", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Action 1",
          },
        },
      });

      await wrapper.findAll("button")[0].trigger("click");
      expect(wrapper.emitted("fzprimary:click")).toBeTruthy();
    });

    it("should emit fzsecondary:click when secondaryAction is clicked", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Action 1",
          },
          secondaryAction: {
            label: "Action 2",
          },
        },
      });

      await wrapper.findAll("button")[0].trigger("click");
      expect(wrapper.emitted("fzsecondary:click")).toBeTruthy();
    });

    it("should emit fztertiary:click when tertiaryAction is clicked", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          primaryAction: {
            label: "Action 1",
          },
          secondaryAction: {
            label: "Action 2",
          },
          tertiaryAction: {
            icon: "bell",
          },
        },
      });

      await wrapper.findAll("button")[0].trigger("click");
      expect(wrapper.emitted("fztertiary:click")).toBeTruthy();
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
      // Find the info icon button (it should be the first one when only hasInfoIcon is true)
      await buttons[0].trigger("click");
      expect(wrapper.emitted("fzcard:click-info")).toBeTruthy();
    });
  });

  describe("Slots", () => {
    it("should hide the header when no title and no slots are defined", async () => {
      const wrapper = mount(FzCard, {
        props: {},
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("header").exists()).toBeFalsy();
    });

    it("should show the header when no title is defined but header slot is", async () => {
      const wrapper = mount(FzCard, {
        slots: {
          header: "<div>Header</div>",
        } as any,
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("header").exists()).toBeTruthy();
      expect(wrapper.html()).toContain("Header");
    });

    it("should show the header when no title is defined but header-content slot is", async () => {
      const wrapper = mount(FzCard, {
        slots: {
          "header-content": "<div>Header Content</div>",
        } as any,
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("header").exists()).toBeTruthy();
      expect(wrapper.html()).toContain("Header Content");
    });

    it("should render footer slot content when provided", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
        },
        slots: {
          footer: "<div>Custom Footer</div>",
        } as any,
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("footer").exists()).toBeTruthy();
      expect(wrapper.html()).toContain("Custom Footer");
    });
  });

  describe("Accessibility", () => {
    it("should have proper title attribute on h2", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card Title",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("h2").attributes("title")).toBe("Test Card Title");
    });

    it("should have proper role on collapsible header", async () => {
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

  describe("Props: hasInfoIcon", () => {
    it("should not show info icon when hasInfoIcon is false", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          hasInfoIcon: false,
        },
      });
      await wrapper.vm.$nextTick();
      // No info icon button should be present
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
      // Info icon button should be present
      const buttons = wrapper.findAll("button");
      expect(buttons.length).toBe(1);
    });

    it("should show info icon alongside collapse icon", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          hasInfoIcon: true,
          collapsible: true,
        },
      });
      await wrapper.vm.$nextTick();
      // Both info and collapse icons should be present
      const buttons = wrapper.findAll("button");
      expect(buttons.length).toBe(2);
    });
  });

  describe("Edge cases", () => {
    it("should handle card without any props", async () => {
      const wrapper = mount(FzCard);
      await wrapper.vm.$nextTick();
      expect(wrapper.find("section").exists()).toBeTruthy();
      expect(wrapper.find("article").exists()).toBeTruthy();
    });

    it("should handle contentClass prop", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          contentClass: "custom-class",
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("article").classes()).toContain("custom-class");
    });

    it("exposes toggleOpen method", async () => {
      const wrapper = mount(FzCard, {
        props: {
          title: "Test Card",
          collapsible: true,
        },
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find("article").exists()).toBeFalsy();
      
      // Call exposed method
      (wrapper.vm as any).toggleOpen();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.find("article").exists()).toBeTruthy();
    });
  });
});
