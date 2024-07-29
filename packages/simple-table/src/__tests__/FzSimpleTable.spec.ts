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
            date: '12/12/2022',
          },
          {
            user: "John Doe1",
            date: '10/05/2024',
          },
        ],
      },
      slots: {
        default: () => [
          h(FzColumn, { field: "user", header: "User" }),
          h(FzColumn, { field: "date", header: "Date" }),
        ],
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
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
