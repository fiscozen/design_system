import { describe, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzPdfViewer } from "..";

const awaitTime = function (time : number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

describe.concurrent("FzPdfViewer", () => {
  it("should render with a pdf file", async ({ expect }) => {
    const wrapper = mount(FzPdfViewer, {
      props: {
        src: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find("canvas").exists()).toBe(true);
    await awaitTime(1000);
    expect(wrapper.find('[data-testid="pdf-page"]').text()).toBe("1 / 14");
    expect(wrapper.find('[data-testid="pdf-scale"]').text()).toBe("100 %");
  });
});
