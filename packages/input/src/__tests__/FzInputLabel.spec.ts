import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { FzInputLabel, type FzInputLabelProps } from "..";

const LABEL = "1. IVA dovuta";
const ASIDE = "calcolato 971,65";

const plainProps = {
  label: LABEL,
  labelId: "amount-label",
  controlId: "amount",
};
const asideProps = { ...plainProps, aside: ASIDE, asideId: "amount-aside" };

/** A field as the form packages build it: the label row, the control, another control. */
const fieldOf = (props: FzInputLabelProps) =>
  defineComponent({
    render: () => [
      h(FzInputLabel, props),
      h("input", { id: "amount", "aria-labelledby": "amount-label" }),
      h("input", { id: "other" }),
    ],
  });

/**
 * Gives every truncated trigger the widths a browser would measure, since jsdom lays
 * nothing out: `box` for the element carrying `truncate`, `content` for the rest.
 */
const stubTruncationWidths = ({
  content,
  box,
}: {
  content: number;
  box: number;
}) => {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      const width = this.classList.contains("truncate") ? box : content;
      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: 16,
        width,
        height: 16,
      } as DOMRect;
    },
  );
};

const shownTooltipTexts = () =>
  Array.from(
    document.querySelectorAll('[role="tooltip"][aria-hidden="false"]'),
  ).map((tooltip) => tooltip.textContent);

const focusControl = async (wrapper: VueWrapper, id: string) => {
  (wrapper.get(`#${id}`).element as HTMLInputElement).focus();
  await nextTick();
};

describe("FzInputLabel", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("matchMedia", (media: string) => ({
      matches: false,
      media,
      addEventListener() {},
      removeEventListener() {},
    }));
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe("without aside", () => {
    it("labels the control with the label and the required asterisk", () => {
      wrapper = mount(FzInputLabel, {
        props: { ...plainProps, required: true },
      });

      const label = wrapper.get("label");

      expect(label.attributes("id")).toBe("amount-label");
      expect(label.attributes("for")).toBe("amount");
      expect(label.text()).toBe(`${LABEL} *`);
    });

    it("labels the control with the label when truncated", () => {
      wrapper = mount(FzInputLabel, {
        props: { ...plainProps, truncate: true },
      });

      const label = wrapper.get("label");

      expect(label.attributes("id")).toBe("amount-label");
      expect(label.attributes("for")).toBe("amount");
      expect(label.text()).toBe(LABEL);
    });
  });

  describe("with aside", () => {
    it("renders the aside under asideId, outside the label", () => {
      wrapper = mount(FzInputLabel, { props: asideProps });

      expect(wrapper.get("#amount-aside").text()).toBe(ASIDE);
      expect(wrapper.get("label").text()).toBe(LABEL);
    });

    it("renders the aside under asideId, outside the label, when truncated", () => {
      wrapper = mount(FzInputLabel, {
        props: { ...asideProps, truncate: true },
      });

      expect(wrapper.get("#amount-aside").text()).toBe(ASIDE);
      expect(wrapper.get("label").text()).toBe(LABEL);
    });

    it("holds the label text once when truncated", () => {
      wrapper = mount(FzInputLabel, {
        props: { ...asideProps, truncate: true },
      });

      expect(wrapper.text().match(/1\. IVA dovuta/g)).toHaveLength(1);
    });
  });

  describe("with aside and truncate, while the control has focus", () => {
    it("shows the full aside when it is cut", async () => {
      stubTruncationWidths({ content: 400, box: 100 });
      wrapper = mount(fieldOf({ ...asideProps, truncate: true }), {
        attachTo: document.body,
      });

      await focusControl(wrapper, "amount");

      expect(shownTooltipTexts()).toContainEqual(
        expect.stringContaining(ASIDE),
      );
    });

    it("shows nothing when the aside fits", async () => {
      stubTruncationWidths({ content: 100, box: 100 });
      wrapper = mount(fieldOf({ ...asideProps, truncate: true }), {
        attachTo: document.body,
      });

      await focusControl(wrapper, "amount");

      expect(shownTooltipTexts()).toEqual([]);
    });

    it("hides the full aside when focus moves to another control", async () => {
      stubTruncationWidths({ content: 400, box: 100 });
      wrapper = mount(fieldOf({ ...asideProps, truncate: true }), {
        attachTo: document.body,
      });

      await focusControl(wrapper, "amount");
      await focusControl(wrapper, "other");

      expect(shownTooltipTexts()).toEqual([]);
    });
  });
});
