import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { FzRadioIconTile, FzRadioIconTileProps, FzRadioGroup } from "..";

const baseProps: FzRadioIconTileProps = {
  label: "Soddisfatto",
  iconName: "face-smile",
};

const createWrapper = (props: Partial<FzRadioIconTileProps> = {}) =>
  mount(FzRadioIconTile, { props: { ...baseProps, ...props } });

describe("FzRadioIconTile", () => {
  it("should render correctly", () => {
    expect(createWrapper().html()).toMatchSnapshot();
  });

  it("should render a native radio input", () => {
    const input = createWrapper().find("input");

    expect(input.exists()).toBe(true);
    expect(input.attributes("type")).toBe("radio");
  });

  it("should expose the label as the accessible name of the input", () => {
    const wrapper = createWrapper();
    const inputId = wrapper.find("input").attributes("id");
    const label = wrapper.find("label");

    expect(label.attributes("for")).toBe(inputId);
    expect(label.text()).toBe("Soddisfatto");
  });

  it("should keep the accessible name visually hidden", () => {
    // The tile shows an icon and nothing else: the name has to be there for
    // assistive technology without ever being painted.
    expect(createWrapper().find("label span.sr-only").text()).toBe(
      "Soddisfatto",
    );
  });

  it("should generate a unique id for each instance", () => {
    const first = createWrapper().find("input").attributes("id");
    const second = createWrapper().find("input").attributes("id");

    expect(first).toBeTruthy();
    expect(first).not.toBe(second);
  });

  it("should fall back to the label when no value is given", async () => {
    const wrapper = createWrapper();

    await wrapper.find("input").trigger("change");

    expect(wrapper.emitted("update:modelValue")).toEqual([["Soddisfatto"]]);
  });

  it("should emit its own value on change", async () => {
    const wrapper = createWrapper({ value: "positive" });

    await wrapper.find("input").trigger("change");

    expect(wrapper.emitted("update:modelValue")).toEqual([["positive"]]);
  });

  it("should be checked when modelValue matches its value", () => {
    const wrapper = createWrapper({
      value: "positive",
      modelValue: "positive",
    });

    expect(wrapper.find("input").element.checked).toBe(true);
  });

  it("should not be checked when modelValue matches another value", () => {
    const wrapper = createWrapper({
      value: "positive",
      modelValue: "negative",
    });

    expect(wrapper.find("input").element.checked).toBe(false);
  });

  it("should communicate the selected state beyond colour", () => {
    // Three vectors, only one of which is colour: the native checked state, the
    // thicker border, and the accent tint.
    const wrapper = createWrapper({
      value: "positive",
      modelValue: "positive",
      accent: "success",
    });
    const label = wrapper.find("label");

    expect(wrapper.find("input").element.checked).toBe(true);
    expect(label.classes()).toContain("border-2");
    expect(label.classes()).toContain("bg-semantic-success-50");
  });

  it("should apply the accent colour to the icon in every state", () => {
    const unselected = createWrapper({ accent: "warning" });
    const selected = createWrapper({
      accent: "warning",
      value: "neutral-vote",
      modelValue: "neutral-vote",
    });

    expect(unselected.find('[role="presentation"]').classes()).toContain(
      "text-semantic-warning-200",
    );
    expect(selected.find('[role="presentation"]').classes()).toContain(
      "text-semantic-warning-200",
    );
  });

  it("should default to the neutral accent", () => {
    expect(createWrapper().find('[role="presentation"]').classes()).toContain(
      "text-grey-500",
    );
  });

  it("should forward the icon name and variant to FzIcon", () => {
    const wrapper = createWrapper({
      iconName: "face-frown",
      iconVariant: "fas",
    });

    expect(wrapper.findComponent({ name: "FzIcon" }).props()).toMatchObject({
      name: "face-frown",
      variant: "fas",
    });
  });

  it("should disable the input and drop the pointer affordance when disabled", () => {
    const wrapper = createWrapper({ disabled: true });

    expect(wrapper.find("input").element.disabled).toBe(true);
    expect(wrapper.find("label").classes()).toContain("cursor-not-allowed");
    expect(wrapper.find("label").classes()).not.toContain("cursor-pointer");
  });

  it("should grey out the icon when disabled", () => {
    const wrapper = createWrapper({ disabled: true, accent: "success" });

    expect(wrapper.find('[role="presentation"]').classes()).toContain(
      "text-grey-300",
    );
  });

  it("should not tint a disabled tile even when selected", () => {
    const wrapper = createWrapper({
      disabled: true,
      accent: "success",
      value: "positive",
      modelValue: "positive",
    });

    expect(wrapper.find("label").classes()).not.toContain(
      "bg-semantic-success-50",
    );
  });

  it("should mark the border when the radio family tone is error", () => {
    const wrapper = createWrapper({ tone: "error" });

    expect(wrapper.find("label").classes()).toContain(
      "border-semantic-error-200",
    );
  });

  it("should honour the deprecated error prop", () => {
    const wrapper = createWrapper({ error: true });

    expect(wrapper.find("label").classes()).toContain(
      "border-semantic-error-200",
    );
  });

  it("should keep accent independent from the validation tone", () => {
    // FzRadioGroup spreads `tone` down to every child; it must not steal the
    // per-tile colour.
    const wrapper = createWrapper({
      tone: "error",
      accent: "success",
      value: "positive",
      modelValue: "positive",
    });

    expect(wrapper.find('[role="presentation"]').classes()).toContain(
      "text-semantic-success-200",
    );
    expect(wrapper.find("label").classes()).toContain(
      "border-semantic-success-200",
    );
  });

  it("should forward name and required to the input", () => {
    const wrapper = createWrapper({ name: "csat", required: true });
    const input = wrapper.find("input");

    expect(input.attributes("name")).toBe("csat");
    expect(input.element.required).toBe(true);
  });

  it("should be reachable by keyboard", () => {
    expect(createWrapper().find("input").attributes("tabindex")).toBe("0");
  });

  it("should take part in a radiogroup", () => {
    const wrapper = mount(FzRadioGroup, {
      props: { label: "Come è andata?", variant: "horizontal", name: "csat" },
      slots: {
        default: `
          <FzRadioIconTile label="Soddisfatto" icon-name="face-smile" value="positive" accent="success" name="csat" />
          <FzRadioIconTile label="Nella media" icon-name="face-meh" value="neutral" accent="warning" name="csat" />
          <FzRadioIconTile label="Insoddisfatto" icon-name="face-frown" value="negative" accent="error" name="csat" />
        `,
      },
      global: { components: { FzRadioIconTile } },
    });

    const group = wrapper.find('[role="radiogroup"]');
    const inputs = wrapper.findAll('input[type="radio"]');

    expect(group.exists()).toBe(true);
    expect(inputs).toHaveLength(3);
    // A shared name is what makes the three a single-select set for the browser.
    expect(inputs.every((input) => input.attributes("name") === "csat")).toBe(
      true,
    );
  });
});
