import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { FzThumbnail } from "..";

const SRC = "https://example.com/receipt.jpg";

const createWrapper = (props = {}, options = {}) =>
  mount(FzThumbnail, {
    props: { src: SRC, alt: "Scontrino di marzo", ...props },
    global: { stubs: { FzIcon: true } },
    ...options,
  });

const PLACEHOLDER = '[data-testid="fz-thumbnail-placeholder"]';
const SCRIM = '[data-testid="fz-thumbnail-scrim"]';
const OVERLAY = '[data-testid="fz-thumbnail-overlay"]';

describe("FzThumbnail", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render the image from src", () => {
      const wrapper = createWrapper();
      const img = wrapper.find("img");
      expect(img.exists()).toBe(true);
      expect(img.attributes("src")).toBe(SRC);
    });

    it("should not render the placeholder while the image is fine", () => {
      expect(createWrapper().find(PLACEHOLDER).exists()).toBe(false);
    });

    it("should render the placeholder instead of an image when src is empty", () => {
      const wrapper = createWrapper({ src: "" });
      expect(wrapper.find("img").exists()).toBe(false);
      expect(wrapper.find(PLACEHOLDER).exists()).toBe(true);
    });

    it("should crop rather than distort the image", () => {
      expect(createWrapper().find("img").classes()).toContain("object-cover");
    });

    it("should declare no width or height of its own, so the caller owns the box", () => {
      // The whole point of the component: it must not repeat FzAvatar's hardwired
      // sizes. Nothing on the root may set a dimension.
      const wrapper = createWrapper();
      const sizing = wrapper
        .classes()
        .filter((c) =>
          /^(w-|h-|min-w-|min-h-|max-w-|max-h-|size-|aspect-)/.test(c),
        );
      expect(sizing).toEqual([]);
      expect(wrapper.attributes("style")).toBeUndefined();
    });
  });

  // ============================================
  // SIZING
  // ============================================
  describe("Sizing", () => {
    // The dimensions are props rather than classes because the consuming apps
    // forbid `class` at the organism/template/page layers and `style` above an
    // atom — a class-only contract would make the component unusable there.
    it("should apply width and height as an inline style", () => {
      const wrapper = createWrapper({ width: "158px", height: "108px" });
      const style = wrapper.attributes("style");
      expect(style).toContain("width: 158px");
      expect(style).toContain("height: 108px");
    });

    it("should accept any CSS length, not just px", () => {
      const wrapper = createWrapper({ width: "100%", height: "12rem" });
      const style = wrapper.attributes("style");
      expect(style).toContain("width: 100%");
      expect(style).toContain("height: 12rem");
    });

    it("should apply aspectRatio for a box with only one known dimension", () => {
      const wrapper = createWrapper({ width: "100%", aspectRatio: "16 / 9" });
      const style = wrapper.attributes("style");
      expect(style).toContain("aspect-ratio: 16 / 9");
      expect(style).not.toContain("height");
    });

    it("should leave an unset dimension out of the style attribute entirely", () => {
      // Not `width: undefined`, which would be a live declaration a caller class
      // then has to fight.
      const style = createWrapper({ height: "168px" }).attributes("style");
      expect(style).toBe("height: 168px;");
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    it("should apply the 4px radius by default", () => {
      expect(createWrapper().classes()).toContain("rounded");
    });

    it.each([
      ["none", "rounded-none"],
      ["sm", "rounded-sm"],
      ["base", "rounded"],
      ["lg", "rounded-lg"],
      ["xl", "rounded-xl"],
    ] as const)('should map radius "%s" to %s', (radius, expected) => {
      expect(createWrapper({ radius }).classes()).toContain(expected);
    });

    it("should draw no border by default", () => {
      expect(createWrapper().classes()).not.toContain("border-1");
    });

    it("should draw a grey border when bordered", () => {
      const classes = createWrapper({ bordered: true }).classes();
      expect(classes).toContain("border-1");
      expect(classes).toContain("border-grey-100");
    });

    it("should draw no scrim by default", () => {
      expect(createWrapper().find(SCRIM).exists()).toBe(false);
    });

    it("should draw the scrim over the image when asked", () => {
      expect(createWrapper({ scrim: true }).find(SCRIM).exists()).toBe(true);
    });

    it("should lazy-load by default and allow eager", () => {
      expect(createWrapper().find("img").attributes("loading")).toBe("lazy");
      expect(
        createWrapper({ loading: "eager" }).find("img").attributes("loading"),
      ).toBe("eager");
    });

    it("should pass placeholderIcon through to FzIcon", async () => {
      const wrapper = createWrapper({
        src: "",
        placeholderIcon: "triangle-exclamation",
      });
      expect(wrapper.find(PLACEHOLDER).html()).toContain(
        "triangle-exclamation",
      );
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should swap to the placeholder when the image fails to load", async () => {
      const wrapper = createWrapper();
      await wrapper.find("img").trigger("error");
      expect(wrapper.find("img").exists()).toBe(false);
      expect(wrapper.find(PLACEHOLDER).exists()).toBe(true);
    });

    it("should emit error with the failing src", async () => {
      const wrapper = createWrapper();
      await wrapper.find("img").trigger("error");
      expect(wrapper.emitted("error")).toEqual([[SRC]]);
    });

    it("should retry when src changes after a failure", async () => {
      const wrapper = createWrapper();
      await wrapper.find("img").trigger("error");
      expect(wrapper.find("img").exists()).toBe(false);

      await wrapper.setProps({ src: "https://example.com/other.jpg" });
      expect(wrapper.find("img").exists()).toBe(true);
      expect(wrapper.find(PLACEHOLDER).exists()).toBe(false);
    });

    it("should hide the scrim once the image has failed", async () => {
      const wrapper = createWrapper({ scrim: true });
      expect(wrapper.find(SCRIM).exists()).toBe(true);
      await wrapper.find("img").trigger("error");
      expect(wrapper.find(SCRIM).exists()).toBe(false);
    });
  });

  // ============================================
  // SLOTS TESTS
  // ============================================
  describe("Slots", () => {
    it("should render no overlay layer when the slot is unused", () => {
      expect(createWrapper().find(OVERLAY).exists()).toBe(false);
    });

    it("should render the overlay slot above the image", () => {
      const wrapper = createWrapper(
        {},
        { slots: { overlay: "<button>Scarica</button>" } },
      );
      const overlay = wrapper.find(OVERLAY);
      expect(overlay.exists()).toBe(true);
      expect(overlay.find("button").text()).toBe("Scarica");
    });

    it("should keep the overlay layer inert but its children clickable", () => {
      // Otherwise the layer covers the whole image and eats every click that was
      // meant for the thumbnail itself.
      const wrapper = createWrapper(
        {},
        { slots: { overlay: "<button>Scarica</button>" } },
      );
      const classes = wrapper.find(OVERLAY).classes();
      expect(classes).toContain("pointer-events-none");
      expect(classes).toContain("[&>*]:pointer-events-auto");
    });

    it("should pin the overlay bottom-end by default", () => {
      const wrapper = createWrapper(
        {},
        { slots: { overlay: "<button>Scarica</button>" } },
      );
      const classes = wrapper.find(OVERLAY).classes();
      expect(classes).toContain("items-end");
      expect(classes).toContain("justify-end");
    });

    it.each([
      ["top-start", ["items-start", "justify-start"]],
      ["top-end", ["items-start", "justify-end"]],
      ["bottom-start", ["items-end", "justify-start"]],
      ["bottom-end", ["items-end", "justify-end"]],
      ["center", ["items-center", "justify-center"]],
    ] as const)(
      "should place the overlay at %s without the call site writing a class",
      (overlayPosition, expected) => {
        const wrapper = createWrapper(
          { overlayPosition },
          { slots: { overlay: "<button>Scarica</button>" } },
        );
        const classes = wrapper.find(OVERLAY).classes();
        for (const c of expected) expect(classes).toContain(c);
      },
    );

    it("should still render the overlay over the placeholder", async () => {
      const wrapper = createWrapper(
        { src: "" },
        { slots: { overlay: "<button>Rimuovi</button>" } },
      );
      expect(wrapper.find(OVERLAY).exists()).toBe(true);
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe("Accessibility", () => {
    it("should put alt on the image", () => {
      expect(createWrapper().find("img").attributes("alt")).toBe(
        "Scontrino di marzo",
      );
    });

    it("should honour an explicitly empty alt for a decorative image", () => {
      // `alt` is required by the type, so `alt=""` is a decision the call site
      // had to make. It must reach the DOM as an empty attribute, not be dropped:
      // a missing alt makes a screen reader read the URL out loud.
      const wrapper = createWrapper({ alt: "" });
      expect(wrapper.find("img").attributes("alt")).toBe("");
    });

    it("should give the placeholder no accessible name of its own", () => {
      // FzIcon is role="presentation"; the placeholder must not invent a label
      // the caller did not write.
      const wrapper = createWrapper({ src: "" });
      const placeholder = wrapper.find(PLACEHOLDER);
      expect(placeholder.attributes("aria-label")).toBeUndefined();
      expect(placeholder.attributes("role")).toBeUndefined();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should clip whatever overflows the rounded box", () => {
      expect(createWrapper().classes()).toContain("overflow-hidden");
    });

    it("should establish a positioning context for the overlay", () => {
      expect(createWrapper().classes()).toContain("relative");
    });

    it("should keep two instances independent after one fails", async () => {
      const a = createWrapper();
      const b = createWrapper();
      await a.find("img").trigger("error");
      expect(a.find("img").exists()).toBe(false);
      expect(b.find("img").exists()).toBe(true);
    });

    it("should forward a caller class alongside its own", () => {
      const wrapper = createWrapper(
        {},
        { attrs: { class: "h-[168px] w-full" } },
      );
      const classes = wrapper.classes();
      expect(classes).toContain("h-[168px]");
      expect(classes).toContain("w-full");
      expect(classes).toContain("fz-thumbnail");
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match the default snapshot", () => {
      expect(createWrapper().html()).toMatchSnapshot();
    });

    it("should match the scrim + border + overlay snapshot", () => {
      const wrapper = createWrapper(
        { scrim: true, bordered: true },
        { slots: { overlay: "<button>Scarica</button>" } },
      );
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match the placeholder snapshot", () => {
      expect(createWrapper({ src: "" }).html()).toMatchSnapshot();
    });
  });
});
