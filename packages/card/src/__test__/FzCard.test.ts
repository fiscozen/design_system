import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import FzCard from "../FzCard.vue";

describe("FzCard", () => {
  it("renders correctly", async () => {
    const wrapper = mount(FzCard, {
      props: {
        title: "Test Card",
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("Test Card");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("computes correct background color", async () => {
    const wrapper = mount(FzCard, {
      props: {
        title: "Test Card",
        color: "orange",
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find("section").classes()).toContain(
      "bg-background-seashell",
    );
  });

  it("computes correct border color", async () => {
    const wrapper = mount(FzCard, {
      props: {
        title: "Test Card",
        color: "blue",
        primaryAction: {
          label: "Action 1",
        },
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find("header").classes()).toContain("border-blue-200");
    expect(wrapper.find("section").classes()).toContain("border-grey-100");
    expect(wrapper.find("footer").classes()).toContain("border-blue-200");
  });

  it("computes atLeastOneButton correctly", async () => {
    const wrapper = mount(FzCard, {
      props: {
        title: "Test Card",
        primaryAction: {
          label: "Action 1",
        },
      },
    });

    await wrapper.vm.$nextTick();
    // @ts-ignore computed property are not typed
    expect(wrapper.vm.atLeastOneButton).toBe(true);
  });

  it("warns if tertiaryAction is set without primaryAction and secondaryAction", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(FzCard, {
      props: {
        title: "Test Card",
        tertiaryAction: {
          icon: "bell",
          callback: () => {},
        },
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(
      "[Fiscozen Design System]: You should set primaryAction and secondaryAction if you want to set tertiaryAction",
    );
    warnSpy.mockRestore();
  });

  it("warns if secondaryAction is set without primaryAction", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(FzCard, {
      props: {
        title: "Test Card",
        secondaryAction: {
          label: "Action 2",
          callback: () => {},
        },
      },
    });

    expect(warnSpy).toHaveBeenCalledWith(
      "[Fiscozen Design System]: You should set primaryAction if you want to set secondaryAction",
    );
    warnSpy.mockRestore();
  });

  it("should emit click event when primaryAction is clicked", async () => {
    const wrapper = mount(FzCard, {
      props: {
        title: "Test Card",
        primaryAction: {
          label: "Action 1",
        },
      },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("fzprimary:click")).toBeTruthy();
  });

  it("should emit click event when secondaryAction is clicked", async () => {
    const wrapper = mount(FzCard, {
      props: {
        title: "Test Card",
        primaryAction: {
          label: "Action 1",
        },
        secondaryAction: {
          label: "Action 2",
        },
      },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("fzsecondary:click")).toBeTruthy();
  });

  it("should emit click event when tertiaryAction is clicked", async () => {
    const wrapper = mount(FzCard, {
      props: {
        title: "Test Card",
        primaryAction: {
          label: "Action 1",
        },
        secondaryAction: {
          label: "Action 2",
        },
        tertiaryAction: {
          icon: "bell",
        },
      },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("fztertiary:click")).toBeTruthy();
  });

  it("should expand and collapse when collapsible is true", async () => {
    const wrapper = mount(FzCard, {
      props: {
        title: "Test Card",
        collapsible: true,
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("article").exists()).toBeFalsy();
    await wrapper.find("header").find("button").trigger("click");
    expect(wrapper.find("article").exists()).toBeTruthy();
  });

  it("should hide the header when no title is defined", async () => {
    const wrapper = mount(FzCard, {
      props: {},
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("header").exists()).toBeFalsy();
  });

  it("should show the header when no title is defined but header slot is", async () => {
    const wrapper = mount(FzCard, {
      slots: {
        header: "<div>Header</div>",
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("header").exists()).toBeTruthy();
  });

  it("should show the header when no title is defined but header-content slot is", async () => {
    const wrapper = mount(FzCard, {
      slots: {
        "header-content": "<div>Header</div>",
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("header").exists()).toBeTruthy();
  });
});
