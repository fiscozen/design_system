import { mount, config } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { FzActionProps } from "@fiscozen/action";
import FzCardListItem from "../FzCardListItem.vue";

const actionA: FzActionProps = {
  type: "action",
  variant: "textLeft",
  label: "Action A",
};

const actionB: FzActionProps = {
  type: "action",
  variant: "textLeft",
  label: "Action B",
};

/** Status indicator icons (circle-small in both title-only and title+value rows) */
function indicatorIcons(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAllComponents({ name: "FzIcon" }).filter((w) => {
    const name = w.props("name");
    return name === "circle-small";
  });
}

function descriptionParagraphs(wrapper: ReturnType<typeof mount>) {
  const block = wrapper.find(".gap-section-content-none");
  if (!block.exists()) return [];
  return block.findAll("p");
}

const badgeDraft = { text: "Bozza", tone: "dark" as const };

beforeEach(() => {
  // Mock IntersectionObserver for FzFloating / dropdown (not in jsdom)
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;

  config.global.directives = {
    bold: () => {},
    color: () => {},
    small: () => {},
  };

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

describe("FzCardListItem", () => {
  describe("Rendering", () => {
    it("should render with only a title", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "My Title" },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain("My Title");
    });

    it("should render the title in a truncated paragraph", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Bold Title" },
      });
      await wrapper.vm.$nextTick();
      const titleEl = wrapper.find("p.truncate");
      expect(titleEl.exists()).toBe(true);
      expect(titleEl.text()).toBe("Bold Title");
    });

    it("should apply min-w-0 and flex-1 on the title paragraph so truncate works in flex rows", async () => {
      const longTitle = "A".repeat(200);
      const wrapper = mount(FzCardListItem, {
        props: { title: longTitle },
      });
      await wrapper.vm.$nextTick();
      const titles = wrapper.findAll("p.truncate");
      expect(titles).toHaveLength(1);
      for (const el of titles) {
        expect(el.classes()).toEqual(
          expect.arrayContaining(["min-w-0", "flex-1", "truncate"]),
        );
      }
    });

    it("should render a single title row with value (title lives in the second row when value is set)", async () => {
      const longTitle = "A".repeat(200);
      const wrapper = mount(FzCardListItem, {
        props: { title: longTitle, value: "10,00 €" },
      });
      await wrapper.vm.$nextTick();
      const titles = wrapper.findAll("p.truncate");
      expect(titles).toHaveLength(1);
      for (const el of titles) {
        expect(el.classes()).toEqual(
          expect.arrayContaining(["min-w-0", "flex-1", "truncate"]),
        );
      }
    });

    it("should render value when provided", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", value: "1.200,00 €" },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("1.200,00 €");
    });

    it("should not render value when not provided", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item" },
      });
      await wrapper.vm.$nextTick();
      const valueEl = wrapper.find("p.text-base.whitespace-nowrap");
      expect(valueEl.exists()).toBe(false);
    });

    it("should render badge when provided", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", badge: badgeDraft },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("Bozza");
    });

    it("should not render a trailing control when actions is omitted", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item" },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent({ name: "FzIconButton" }).exists()).toBe(
        false,
      );
      expect(wrapper.findComponent({ name: "FzIconDropdown" }).exists()).toBe(
        false,
      );
    });

    it("should not render a trailing control when actions is an empty array", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", actions: [] },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent({ name: "FzIconButton" }).exists()).toBe(
        false,
      );
      expect(wrapper.findComponent({ name: "FzIconDropdown" }).exists()).toBe(
        false,
      );
    });

    it("should render arrow button when exactly one action is passed", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", actions: [actionA] },
      });
      await wrapper.vm.$nextTick();
      const buttons = wrapper.findAllComponents({ name: "FzIconButton" });
      expect(buttons).toHaveLength(1);
      expect(buttons[0].props("iconName")).toBe("arrow-right");
    });

    it("should render dropdown when more than one action is passed", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", actions: [actionA, actionB] },
      });
      await wrapper.vm.$nextTick();
      const dropdown = wrapper.findComponent({ name: "FzIconDropdown" });
      expect(dropdown.exists()).toBe(true);
      expect(dropdown.props("actions")).toEqual([actionA, actionB]);
    });

    it("should render badge in the top row when badge is provided", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", badge: { text: "Tag", tone: "info" } },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent({ name: "FzBadge" }).exists()).toBe(true);
    });

    it("should render description lines when provided", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", descriptions: ["Line 1", "Line 2", "Line 3"] },
      });
      await wrapper.vm.$nextTick();
      const paragraphs = descriptionParagraphs(wrapper);
      expect(paragraphs).toHaveLength(3);
      expect(paragraphs[0].text()).toBe("Line 1");
      expect(paragraphs[1].text()).toBe("Line 2");
      expect(paragraphs[2].text()).toBe("Line 3");
    });

    it("should not render description paragraphs when descriptions is not provided", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item" },
      });
      await wrapper.vm.$nextTick();
      expect(descriptionParagraphs(wrapper)).toHaveLength(0);
    });

    it("should not render description paragraphs when descriptions is an empty array", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", descriptions: [] },
      });
      await wrapper.vm.$nextTick();
      expect(descriptionParagraphs(wrapper)).toHaveLength(0);
    });
  });

  describe("Props", () => {
    describe("showIndicator prop", () => {
      it("should not render indicator icon when showIndicator is not true", async () => {
        const wrapper = mount(FzCardListItem, {
          props: { title: "Item" },
        });
        await wrapper.vm.$nextTick();
        expect(indicatorIcons(wrapper)).toHaveLength(0);
      });

      it("should render circle-small icon when showIndicator is true (title-only layout)", async () => {
        const wrapper = mount(FzCardListItem, {
          props: { title: "Item", showIndicator: true },
        });
        await wrapper.vm.$nextTick();
        const icons = indicatorIcons(wrapper);
        expect(icons).toHaveLength(1);
        expect(icons[0].props("name")).toBe("circle-small");
      });

      it("should render circle-small icon when showIndicator is true (with badge and amount)", async () => {
        const wrapper = mount(FzCardListItem, {
          props: {
            title: "Item",
            badge: { text: "X", tone: "dark" },
            value: "10 €",
            showIndicator: true,
          },
        });
        await wrapper.vm.$nextTick();
        const circleSmall = wrapper
          .findAllComponents({ name: "FzIcon" })
          .filter((w) => w.props("name") === "circle-small");
        expect(circleSmall).toHaveLength(1);
      });
    });

    describe("badge prop", () => {
      it("should pass tone and variant text to FzBadge", async () => {
        const wrapper = mount(FzCardListItem, {
          props: {
            title: "Item",
            badge: { text: "Tag", tone: "success" },
          },
        });
        await wrapper.vm.$nextTick();
        const badge = wrapper.findComponent({ name: "FzBadge" });
        expect(badge.exists()).toBe(true);
        expect(badge.props("tone")).toBe("success");
        expect(badge.props("variant")).toBe("text");
      });
    });
  });

  describe("Events", () => {
    it("should emit fzaction:click when single-action arrow is clicked", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", actions: [actionA] },
      });
      await wrapper.vm.$nextTick();

      const button = wrapper.get('button[aria-label="Open"]');
      await button.trigger("click");

      expect(wrapper.emitted("fzaction:click")).toBeTruthy();
      expect(wrapper.emitted("fzaction:click")).toHaveLength(1);
      expect(wrapper.emitted("fzaction:click")![0]).toEqual([0, actionA]);
    });

    it("should emit fzaction:click multiple times on repeated arrow clicks", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", actions: [actionA] },
      });
      await wrapper.vm.$nextTick();

      const button = wrapper.get('button[aria-label="Open"]');
      await button.trigger("click");
      await button.trigger("click");
      await button.trigger("click");

      expect(wrapper.emitted("fzaction:click")).toHaveLength(3);
      for (const payload of wrapper.emitted("fzaction:click")!) {
        expect(payload).toEqual([0, actionA]);
      }
    });

    it("should forward fzaction:click from dropdown", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", actions: [actionA, actionB] },
      });
      await wrapper.vm.$nextTick();

      const dropdown = wrapper.findComponent({ name: "FzIconDropdown" });
      await dropdown.vm.$emit("fzaction:click", 1, actionB);

      expect(wrapper.emitted("fzaction:click")).toBeTruthy();
      expect(wrapper.emitted("fzaction:click")![0]).toEqual([1, actionB]);
    });
  });

  describe("Accessibility", () => {
    it("should use the card row as a block root", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item" },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find(".hover\\:bg-semantic-info-50").exists()).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should render with only a title and no other props", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Minimal" },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("p.truncate").text()).toBe("Minimal");
      expect(indicatorIcons(wrapper)).toHaveLength(0);
      expect(descriptionParagraphs(wrapper)).toHaveLength(0);
      expect(wrapper.findComponent({ name: "FzIconButton" }).exists()).toBe(
        false,
      );
    });

    it("should render badge without a trailing control when actions are omitted", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", badge: { text: "Label", tone: "dark" } },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent({ name: "FzBadge" }).exists()).toBe(true);
      expect(wrapper.text()).toContain("Label");
      expect(wrapper.findComponent({ name: "FzIconButton" }).exists()).toBe(
        false,
      );
    });

    it("should handle a single description line", async () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", descriptions: ["Single description"] },
      });
      await wrapper.vm.$nextTick();
      const paragraphs = descriptionParagraphs(wrapper);
      expect(paragraphs).toHaveLength(1);
      expect(paragraphs[0].text()).toBe("Single description");
    });
  });

  describe("Snapshots", () => {
    it("should match snapshot - minimal (title only)", () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item Title" },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - full featured item", () => {
      const wrapper = mount(FzCardListItem, {
        props: {
          title: "Fattura #001",
          value: "1.200,00 €",
          badge: badgeDraft,
          showIndicator: true,
          descriptions: ["Cliente: Rossi S.r.l.", "Scadenza: 31/03/2024"],
          actions: [actionA, actionB],
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with showIndicator", () => {
      const wrapper = mount(FzCardListItem, {
        props: { title: "Item", showIndicator: true },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
