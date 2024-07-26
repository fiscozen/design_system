import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzSimpleTable, FzColumn } from "..";
import { h } from "vue";

describe.concurrent("FzSimpleTable", () => {
  it("matches snaphost", async ({ expect }) => {
    const wrapper = mount(FzSimpleTable, {
      props: {
        value: [
          {
            user: "John Doe",
            date: new Date(),
          },
          {
            user: "John Doe1",
            date: new Date(),
          },
        ],
      },
      slots: {
        default: () => [
          h(FzColumn, { field: "user", header: "User" }),
          h(FzColumn, { field: "date", header: "Date" }),
        ],
        header: ``,
        footer: ``,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("matches snaphost empty table", async ({ expect }) => {
    const wrapper = mount(FzSimpleTable, {
      props: {
        value: [],
      },
      slots: {
        default: () => [
          h(FzColumn, { field: "user", header: "User" }),
          h(FzColumn, { field: "date", header: "Date" }),
        ],
        header: ``,
        footer: ``,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
