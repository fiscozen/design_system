import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { useUniqueId } from "../utils";

const Probe = defineComponent({
  setup() {
    const id = useUniqueId("probe");
    return () => h("span", { id }, id);
  },
});

describe("useUniqueId", () => {
  it("should prefix the id with the given string", () => {
    const wrapper = mount(Probe);
    expect(wrapper.get("span").attributes("id")).toMatch(/^probe-\d+$/);
  });

  it("should not repeat across Vue apps", () => {
    // Each mount() is its own app, which is exactly where useId() repeats itself.
    const ids = Array.from({ length: 5 }, () =>
      mount(Probe).get("span").attributes("id"),
    );
    expect(new Set(ids).size).toBe(5);
  });
});
