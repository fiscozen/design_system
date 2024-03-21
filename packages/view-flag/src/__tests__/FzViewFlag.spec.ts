import { describe, it } from "vitest";
import { mount } from "@vue/test-utils";
import { FzViewFlag } from "..";

describe.concurrent("FzViewFlag", () => {
  it("matches snapshot", async ({ expect }) => {
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
});
