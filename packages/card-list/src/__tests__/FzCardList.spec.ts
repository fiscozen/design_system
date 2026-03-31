import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { FzActionProps } from "@fiscozen/action";
import FzCardList from "../FzCardList.vue";

const sampleAction: FzActionProps = {
  type: "action",
  variant: "textLeft",
  label: "Go",
};

beforeEach(() => {
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

describe("FzCardList", () => {
  describe("Rendering", () => {
    it("should render with empty items", async () => {
      const wrapper = mount(FzCardList, {
        props: { items: [] },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.exists()).toBe(true);
      expect(
        wrapper.findAllComponents({ name: "FzCardListItem" }),
      ).toHaveLength(0);
      expect(wrapper.element.children.length).toBe(0);
    });

    it("should not render a title heading (title prop is not used by the template)", async () => {
      const wrapper = mount(FzCardList, {
        props: { title: "My Card List", items: [] },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("h2").exists()).toBe(false);
    });

    it("does not render default slot content (list is driven by items only)", async () => {
      const wrapper = mount(FzCardList, {
        props: { items: [] },
        slots: {
          default: '<div class="custom-item">Custom Item</div>',
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).not.toContain("Custom Item");
    });

    it("should render FzCardListItem for each item in items array", async () => {
      const wrapper = mount(FzCardList, {
        props: {
          items: [
            { title: "Item 1" },
            { title: "Item 2" },
            { title: "Item 3" },
          ],
        },
      });
      await wrapper.vm.$nextTick();
      const items = wrapper.findAllComponents({ name: "FzCardListItem" });
      expect(items).toHaveLength(3);
    });

    it("should render item title text", async () => {
      const wrapper = mount(FzCardList, {
        props: {
          items: [{ title: "Hello World" }],
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain("Hello World");
    });

    it("should not render default slot when items is an empty array", async () => {
      const wrapper = mount(FzCardList, {
        props: { items: [] },
        slots: {
          default: '<div class="slot-content">Slot Content</div>',
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).not.toContain("Slot Content");
    });
  });

  describe("Props", () => {
    describe("items prop", () => {
      it("should pass title to FzCardListItem", async () => {
        const wrapper = mount(FzCardList, {
          props: { items: [{ title: "Item Title" }] },
        });
        await wrapper.vm.$nextTick();
        const item = wrapper.findComponent({ name: "FzCardListItem" });
        expect(item.props("title")).toBe("Item Title");
      });

      it("should pass value to FzCardListItem", async () => {
        const wrapper = mount(FzCardList, {
          props: { items: [{ title: "Item", value: "1.234,56 €" }] },
        });
        await wrapper.vm.$nextTick();
        const item = wrapper.findComponent({ name: "FzCardListItem" });
        expect(item.props("value")).toBe("1.234,56 €");
      });

      it("should pass badge to FzCardListItem", async () => {
        const badge = { text: "New", tone: "dark" as const };
        const wrapper = mount(FzCardList, {
          props: { items: [{ title: "Item", badge }] },
        });
        await wrapper.vm.$nextTick();
        const item = wrapper.findComponent({ name: "FzCardListItem" });
        expect(item.props("badge")).toEqual(badge);
      });

      it("should pass descriptions to FzCardListItem", async () => {
        const wrapper = mount(FzCardList, {
          props: {
            items: [{ title: "Item", descriptions: ["Line 1", "Line 2"] }],
          },
        });
        await wrapper.vm.$nextTick();
        const item = wrapper.findComponent({ name: "FzCardListItem" });
        expect(item.props("descriptions")).toEqual(["Line 1", "Line 2"]);
      });

      it("should pass showIndicator to FzCardListItem", async () => {
        const wrapper = mount(FzCardList, {
          props: { items: [{ title: "Item", showIndicator: true }] },
        });
        await wrapper.vm.$nextTick();
        const item = wrapper.findComponent({ name: "FzCardListItem" });
        expect(item.props("showIndicator")).toBe(true);
      });

      it("should pass actions to FzCardListItem", async () => {
        const actions = [
          { type: "action" as const, variant: "textLeft" as const, label: "A" },
        ];
        const wrapper = mount(FzCardList, {
          props: { items: [{ title: "Item", actions }] },
        });
        await wrapper.vm.$nextTick();
        const item = wrapper.findComponent({ name: "FzCardListItem" });
        expect(item.props("actions")).toEqual(actions);
      });
    });
  });

  describe("Events", () => {
    it("should emit fzaction:click with item index when single-action arrow is clicked", async () => {
      const wrapper = mount(FzCardList, {
        props: {
          items: [
            { title: "Item 0", actions: [sampleAction] },
            { title: "Item 1", actions: [sampleAction] },
          ],
        },
      });
      await wrapper.vm.$nextTick();

      const items = wrapper.findAllComponents({ name: "FzCardListItem" });
      const button = items[1].get('button[aria-label="Open"]');
      await button.trigger("click");

      expect(wrapper.emitted("fzaction:click")).toBeTruthy();
      expect(wrapper.emitted("fzaction:click")![0]).toEqual([
        1,
        0,
        sampleAction,
      ]);
    });

    it("should emit fzaction:click with index 0 when first item arrow is clicked", async () => {
      const wrapper = mount(FzCardList, {
        props: {
          items: [{ title: "Item 0", actions: [sampleAction] }],
        },
      });
      await wrapper.vm.$nextTick();

      const item = wrapper.findComponent({ name: "FzCardListItem" });
      const button = item.get('button[aria-label="Open"]');
      await button.trigger("click");

      expect(wrapper.emitted("fzaction:click")).toBeTruthy();
      expect(wrapper.emitted("fzaction:click")![0]).toEqual([
        0,
        0,
        sampleAction,
      ]);
    });

    it("should emit fzaction:click with item index and action payload", async () => {
      const wrapper = mount(FzCardList, {
        props: {
          items: [
            { title: "A" },
            {
              title: "B",
              actions: [sampleAction, { ...sampleAction, label: "B" }],
            },
          ],
        },
      });
      await wrapper.vm.$nextTick();

      const items = wrapper.findAllComponents({ name: "FzCardListItem" });
      await items[1].vm.$emit("fzaction:click", 0, sampleAction);

      expect(wrapper.emitted("fzaction:click")).toBeTruthy();
      expect(wrapper.emitted("fzaction:click")![0]).toEqual([
        1,
        0,
        sampleAction,
      ]);
    });
  });

  describe("Accessibility", () => {
    it("should wrap items in a container element", async () => {
      const wrapper = mount(FzCardList, {
        props: { items: [{ title: "A" }] },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent({ name: "FzCardListItem" }).exists()).toBe(
        true,
      );
    });
  });

  describe("Edge Cases", () => {
    it("should render a FzCardListItem even with only a title", async () => {
      const wrapper = mount(FzCardList, {
        props: { items: [{ title: "Minimal" }] },
      });
      await wrapper.vm.$nextTick();
      const item = wrapper.findComponent({ name: "FzCardListItem" });
      expect(item.exists()).toBe(true);
    });

    it("should handle a large number of items", async () => {
      const items = Array.from({ length: 20 }, (_, i) => ({
        title: `Item ${i}`,
      }));
      const wrapper = mount(FzCardList, { props: { items } });
      await wrapper.vm.$nextTick();
      const rendered = wrapper.findAllComponents({ name: "FzCardListItem" });
      expect(rendered).toHaveLength(20);
    });

    it("should render list items when title prop is also provided (title is unused in template)", async () => {
      const wrapper = mount(FzCardList, {
        props: {
          title: "My List",
          items: [{ title: "Item 1" }],
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("h2").exists()).toBe(false);
      expect(
        wrapper.findAllComponents({ name: "FzCardListItem" }),
      ).toHaveLength(1);
    });
  });

  describe("Snapshots", () => {
    it("should match snapshot - default state", () => {
      const wrapper = mount(FzCardList, {
        props: { items: [] },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with items", () => {
      const wrapper = mount(FzCardList, {
        props: {
          items: [
            {
              title: "Item 1",
              value: "1.200,00 €",
              showIndicator: true,
            },
            {
              title: "Item 2",
              badge: { text: "New", tone: "dark" },
              descriptions: ["Due date: 2024-03-01"],
            },
          ],
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
