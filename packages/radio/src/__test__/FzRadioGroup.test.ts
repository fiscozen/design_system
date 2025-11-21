import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { h } from "vue";
import { FzRadioGroupProps, FzRadioGroup, FzRadio } from "..";

const createWrapper = async (props: FzRadioGroupProps) => {
  const content = mount(FzRadioGroup, {
    props,
    slots: {
      default: (props) => [
        h(FzRadio, {
          label: "Radio 1",
          value: "Radio 1",
          ...props.radioGroupProps,
        }),
        h(FzRadio, {
          label: "Radio 2",
          value: "Radio 2",
          ...props.radioGroupProps,
        }),
      ],
    },
  });
  return content;
};

describe("FzRadioGroup", () => {
  it("should render correctly", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      name: "radio",
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should set error state", async () => {
    const wrapper = mount(FzRadioGroup, {
      props: {
        label: "Radio",
        size: "md",
        error: true,
      },
      slots: {
        default: (props) => [
          h(FzRadio, {
            label: "Radio 1",
            value: "Radio 1",
            ...props.radioGroupProps,
          }),
          h(FzRadio, {
            label: "Radio 2",
            value: "Radio 2",
            ...props.radioGroupProps,
          }),
        ],
        error: "Error text",
      },
    });

    await wrapper.vm.$nextTick();

    // FzAlert should be used instead of FzRadioErrorText
    expect(wrapper.findComponent({ name: "FzAlert" }).exists()).toBe(true);
    wrapper
      .find('[test-id="slot-container"]')
      .findAll("label")
      .forEach((input) => {
        expect(input.classes()).toContain("before:border-semantic-error");
      });
  });

  it("should set disabled state", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      disabled: true,
    });

    await wrapper.vm.$nextTick();
    wrapper.findAll("input").forEach((input) => {
      expect(input.element.disabled).toBe(true);
    });
  });

  it("should set emphasized class", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      emphasis: true,
    });
    await wrapper.vm.$nextTick();
    wrapper
      .find('[test-id="slot-container"]')
      .findAll("label")
      .forEach((input) => {
        expect(input.classes()).toContain(
          "peer-checked:before:border-blue-500",
        );
      });
  });

  it("should support variant prop", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      variant: "horizontal",
    });
    await wrapper.vm.$nextTick();
    const slotContainer = wrapper.find('[test-id="slot-container"]');
    expect(slotContainer.classes()).toContain("flex-row");
  });

  it("should default to vertical variant", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
    });
    await wrapper.vm.$nextTick();
    const slotContainer = wrapper.find('[test-id="slot-container"]');
    expect(slotContainer.classes()).toContain("flex-col");
  });

  it("should support tone prop", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      tone: "emphasis",
    });
    await wrapper.vm.$nextTick();
    wrapper
      .find('[test-id="slot-container"]')
      .findAll("label")
      .forEach((input) => {
        expect(input.classes()).toContain(
          "peer-checked:before:border-blue-500",
        );
      });
  });

  it("should maintain backward compatibility with emphasis prop", async () => {
    const wrapper = await createWrapper({
      label: "Radio",
      size: "md",
      emphasis: true,
    });
    await wrapper.vm.$nextTick();
    wrapper
      .find('[test-id="slot-container"]')
      .findAll("label")
      .forEach((input) => {
        expect(input.classes()).toContain(
          "peer-checked:before:border-blue-500",
        );
      });
  });
});
