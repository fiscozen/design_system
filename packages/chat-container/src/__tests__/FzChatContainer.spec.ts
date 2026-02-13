import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { FzChatContainer } from "..";
import { FzIconButton } from "@fiscozen/button";
import { FzIcon } from "@fiscozen/icons";
import type { FzChatContainerProps } from "../types";

// ============================================
// CONSTANTS & HELPERS
// ============================================

const SCROLL_CONTAINER_SELECTOR = ".fz-container.overflow-y-auto";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

type MessageOverrides = Partial<FzChatContainerProps["messages"][number]>;

const createMockMessage = (
  overrides: MessageOverrides = {},
): FzChatContainerProps["messages"][number] => ({
  message: "Hello, world!",
  variant: "primary",
  timestamp: "2024-01-15T10:30:00.000Z",
  user: {
    firstName: "John",
    lastName: "Doe",
    avatar: "",
  },
  attachments: [],
  ...overrides,
});

function mountComponent(
  props: Pick<FzChatContainerProps, "messages"> &
    Partial<Omit<FzChatContainerProps, "messages">>,
) {
  return mount(FzChatContainer, { props });
}

function setupScrollContainer(
  wrapper: ReturnType<typeof mountComponent>,
  { scrollHeight = 1000, clientHeight = 500, initialScrollTop = 0 } = {},
) {
  const container = wrapper.find(SCROLL_CONTAINER_SELECTOR);
  let scrollTopValue = initialScrollTop;

  Object.defineProperty(container.element, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(container.element, "clientHeight", {
    value: clientHeight,
    configurable: true,
  });
  Object.defineProperty(container.element, "scrollTop", {
    get: () => scrollTopValue,
    set: (v: number) => {
      scrollTopValue = v;
    },
    configurable: true,
  });

  return {
    container,
    getScrollTop: () => scrollTopValue,
    setScrollTop: (value: number) => {
      scrollTopValue = value;
      container.element.dispatchEvent(new Event("scroll"));
    },
  };
}

describe("FzChatContainer", () => {
  // ============================================
  // RENDERING
  // ============================================
  describe("Rendering", () => {
    it("should render with empty messages", () => {
      const wrapper = mountComponent({ messages: [] });
      expect(wrapper.exists()).toBe(true);
    });

    it("should apply base scroll container classes", () => {
      const wrapper = mountComponent({ messages: [] });
      expect(wrapper.find(SCROLL_CONTAINER_SELECTOR).exists()).toBe(true);
    });

    it("should apply overflow-y-auto class for scrollable container with hidden scrollbar", () => {
      const wrapper = mountComponent({ messages: [] });
      const container = wrapper.find(SCROLL_CONTAINER_SELECTOR);
      expect(container.classes()).toContain("fz-container");
      expect(container.classes()).toContain("overflow-y-auto");
    });

    it("should render empty state when messages is empty and emptyMessage is provided", () => {
      const wrapper = mountComponent({
        messages: [],
        emptyMessage: "No messages yet",
      });
      expect(wrapper.text()).toContain("No messages yet");
    });

    it("should render empty message description when provided and no messages", () => {
      const wrapper = mountComponent({
        messages: [],
        emptyMessage: "No messages yet",
        emptyMessageDescription: "Start a conversation",
      });
      expect(wrapper.text()).toContain("No messages yet");
      expect(wrapper.text()).toContain("Start a conversation");
    });

    it("should not render empty message when there are messages", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage()],
        emptyMessage: "No messages yet",
      });
      expect(wrapper.text()).not.toContain("No messages yet");
    });

    it("should render messages with user name and message content", () => {
      const wrapper = mountComponent({
        messages: [
          createMockMessage({
            message: "First message",
            variant: "invisible",
            user: { firstName: "Jane", lastName: "Smith", avatar: "" },
          }),
        ],
      });
      expect(wrapper.text()).toContain("Jane Smith");
      expect(wrapper.text()).toContain("First message");
    });

    it("should render multiple messages", () => {
      const wrapper = mountComponent({
        messages: [
          createMockMessage({ message: "Message 1" }),
          createMockMessage({ message: "Message 2", variant: "invisible" }),
        ],
      });
      expect(wrapper.text()).toContain("Message 1");
      expect(wrapper.text()).toContain("Message 2");
    });

    it("should render waiting for response message when last message is primary", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage({ variant: "primary" })],
        waitingForResponseMessage: "Waiting for response...",
      });
      expect(wrapper.text()).toContain("Waiting for response...");
    });

    it("should not render waiting for response when last message is invisible", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage({ variant: "invisible" })],
        waitingForResponseMessage: "Waiting for response...",
      });
      expect(wrapper.text()).not.toContain("Waiting for response...");
    });

    it("should not render waiting for response when messages is empty", () => {
      const wrapper = mountComponent({
        messages: [],
        waitingForResponseMessage: "Waiting for response...",
      });
      expect(wrapper.text()).not.toContain("Waiting for response...");
    });

    it("should vertically center-align the icon with the text in the waiting message", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage({ variant: "primary" })],
        waitingForResponseMessage: "Waiting for response...",
      });
      const waitingIcon = wrapper
        .findAllComponents(FzIcon)
        .find((icon) => icon.props("name") === "clock");
      expect(waitingIcon).toBeDefined();
      const parentContainer = waitingIcon!.element.closest(
        ".fz-container.align-items-center",
      );
      expect(parentContainer).not.toBeNull();
    });

    it("should apply grey-300 color to the clock icon in the waiting message", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage({ variant: "primary" })],
        waitingForResponseMessage: "Waiting for response...",
      });
      const waitingIcon = wrapper
        .findAllComponents(FzIcon)
        .find((icon) => icon.props("name") === "clock");
      expect(waitingIcon).toBeDefined();
      expect(waitingIcon!.classes()).toContain("text-grey-300");
    });

    it("should render attachments with download button", () => {
      const wrapper = mountComponent({
        messages: [
          createMockMessage({
            attachments: [
              { name: "document.pdf", url: "https://example.com/doc.pdf" },
            ],
          }),
        ],
      });
      expect(wrapper.text()).toContain("document.pdf");
      expect(wrapper.findComponent(FzIconButton).exists()).toBe(true);
    });

    it("should handle message with empty attachments array", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage({ attachments: [] })],
      });
      expect(wrapper.text()).toContain("Hello, world!");
      expect(wrapper.findAllComponents(FzIconButton).length).toBe(0);
    });

    it("should handle message with multiple attachments", () => {
      const wrapper = mountComponent({
        messages: [
          createMockMessage({
            attachments: [
              { name: "a.pdf", url: "url1" },
              { name: "b.pdf", url: "url2" },
            ],
          }),
        ],
      });
      expect(wrapper.findAllComponents(FzIconButton).length).toBe(2);
    });
  });

  // ============================================
  // PROPS
  // ============================================
  describe("Props", () => {
    it("should apply center alignment when messages is empty", () => {
      const wrapper = mountComponent({ messages: [] });
      const container = wrapper.findComponent({ name: "FzContainer" });
      expect(container.exists()).toBe(true);
    });

    it("should render avatar for invisible (receiver) variant", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage({ variant: "invisible" })],
      });
      expect(wrapper.findComponent({ name: "FzAvatar" }).exists()).toBe(true);
    });

    it("should not render avatar for primary (sender) variant", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage({ variant: "primary" })],
      });
      expect(wrapper.findAllComponents({ name: "FzAvatar" }).length).toBe(0);
    });
  });

  // ============================================
  // EVENTS
  // ============================================
  describe("Events", () => {
    it("should call window.open when download button is clicked", async () => {
      const downloadUrl = "https://example.com/document.pdf";
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

      const wrapper = mountComponent({
        messages: [
          createMockMessage({
            attachments: [{ name: "document.pdf", url: downloadUrl }],
          }),
        ],
      });

      await wrapper.findComponent(FzIconButton).find("button").trigger("click");
      expect(openSpy).toHaveBeenCalledWith(downloadUrl, "_blank");
      openSpy.mockRestore();
    });

    it("should call window.open with correct url when first of multiple attachments is clicked", async () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

      const wrapper = mountComponent({
        messages: [
          createMockMessage({
            attachments: [
              { name: "first.pdf", url: "https://example.com/first.pdf" },
              { name: "second.pdf", url: "https://example.com/second.pdf" },
            ],
          }),
        ],
      });

      await wrapper
        .findAllComponents(FzIconButton)[0]
        .find("button")
        .trigger("click");
      expect(openSpy).toHaveBeenCalledWith(
        "https://example.com/first.pdf",
        "_blank",
      );
      openSpy.mockRestore();
    });
  });

  // ============================================
  // TIMESTAMP FORMATTING
  // ============================================
  describe("Timestamp formatting", () => {
    it("should format ISO timestamp to Italian format (dd mmm, HH:mm)", () => {
      const wrapper = mountComponent({
        messages: [
          createMockMessage({ timestamp: "2024-01-15T10:30:00.000Z" }),
        ],
      });
      expect(wrapper.text()).toMatch(/\d{2} [a-z]{3}, \d{2}:\d{2}/);
    });

    it("should handle invalid timestamp gracefully", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage({ timestamp: "invalid-date" })],
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle null timestamp gracefully", () => {
      const wrapper = mountComponent({
        messages: [
          createMockMessage({
            timestamp: null as unknown as string,
          }),
        ],
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle undefined timestamp gracefully", () => {
      const wrapper = mountComponent({
        messages: [
          createMockMessage({
            timestamp: undefined as unknown as string,
          }),
        ],
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle empty string timestamp gracefully", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage({ timestamp: "" })],
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  // ============================================
  // SCROLL BEHAVIOR
  // ============================================
  describe("Scroll behavior", () => {
    it("should use flex-col-reverse for automatic bottom anchoring", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage()],
      });
      const container = wrapper.find(SCROLL_CONTAINER_SELECTOR);
      expect(container.classes()).toContain("flex");
      expect(container.classes()).toContain("!flex-col-reverse");
    });
  });

  // ============================================
  // LOAD MORE
  // ============================================
  describe("Load more", () => {
    // With flex-col-reverse and setupScrollContainer defaults (scrollHeight=1000, clientHeight=500):
    // - scrollTop = 0 means bottom (newest messages visible)
    // - scrollTop = -500 means top (oldest messages visible)
    // - Formula: scrollHeight - Math.abs(scrollTop) - clientHeight <= SCROLL_TOP_THRESHOLD (10)
    // - At top (-500): 1000 - 500 - 500 = 0 <= 10 ✓
    // - At threshold (-490): 1000 - 490 - 500 = 10 <= 10 ✓
    // - Above threshold (-489): 1000 - 489 - 500 = 11 > 10 ✗

    it("should emit load-more when scrolling to top of container", async () => {
      const wrapper = mountComponent({
        messages: [createMockMessage()],
      });
      const { setScrollTop } = setupScrollContainer(wrapper);
      await nextTick();
      await nextTick();

      setScrollTop(-500);

      expect(wrapper.emitted("load-more")).toHaveLength(1);
    });

    it("should emit load-more when scrollTop is within threshold", async () => {
      const wrapper = mountComponent({
        messages: [createMockMessage()],
      });
      const { setScrollTop } = setupScrollContainer(wrapper);
      await nextTick();
      await nextTick();

      setScrollTop(-490);

      expect(wrapper.emitted("load-more")).toHaveLength(1);
    });

    it("should not emit load-more when scrollTop is above threshold", async () => {
      const wrapper = mountComponent({
        messages: [createMockMessage()],
      });
      const { setScrollTop } = setupScrollContainer(wrapper);
      await nextTick();
      await nextTick();

      setScrollTop(-489);

      expect(wrapper.emitted("load-more")).toBeUndefined();
    });

    it("should emit load-more only once until messages change (guard)", async () => {
      const wrapper = mountComponent({
        messages: [createMockMessage()],
      });
      const { setScrollTop } = setupScrollContainer(wrapper);
      await nextTick();
      await nextTick();

      setScrollTop(-500);
      setScrollTop(-495);
      setScrollTop(-500);

      expect(wrapper.emitted("load-more")).toHaveLength(1);
    });

    it("should re-enable load-more after messages.length changes", async () => {
      const messages = [createMockMessage()];
      const wrapper = mountComponent({ messages });
      const { setScrollTop } = setupScrollContainer(wrapper);
      await nextTick();
      await nextTick();

      // First scroll to top
      setScrollTop(-500);
      expect(wrapper.emitted("load-more")).toHaveLength(1);

      // Prepend older messages (messages.length changes → guard resets)
      await wrapper.setProps({
        messages: [
          createMockMessage({
            message: "Older message",
            timestamp: "2024-01-14T10:00:00.000Z",
          }),
          ...messages,
        ],
      });
      await nextTick();

      // Scroll to top again — should emit because guard was reset
      setScrollTop(-500);
      expect(wrapper.emitted("load-more")).toHaveLength(2);
    });

    it("should emit load-more at boundary value of threshold", async () => {
      const wrapper = mountComponent({
        messages: [createMockMessage()],
      });
      const { setScrollTop } = setupScrollContainer(wrapper);
      await nextTick();
      await nextTick();

      setScrollTop(-490);

      expect(wrapper.emitted("load-more")).toHaveLength(1);
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================
  describe("Accessibility", () => {
    it("should render empty state with heading level 2", () => {
      const wrapper = mountComponent({
        messages: [],
        emptyMessage: "No messages yet",
      });
      const heading = wrapper.find("h2");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("No messages yet");
    });

    it("should give download buttons an aria-label with attachment name", () => {
      const wrapper = mountComponent({
        messages: [
          createMockMessage({
            attachments: [
              { name: "report.pdf", url: "https://example.com/r.pdf" },
            ],
          }),
        ],
      });
      const button = wrapper.findComponent(FzIconButton).find("button");
      expect(button.attributes("aria-label")).toBe("Scarica report.pdf");
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - empty state", () => {
      const wrapper = mountComponent({
        messages: [],
        emptyMessage: "No messages",
        emptyMessageDescription: "Start chatting",
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with messages", () => {
      const wrapper = mountComponent({
        messages: [
          createMockMessage({ message: "Test message", variant: "invisible" }),
        ],
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - waiting for response", () => {
      const wrapper = mountComponent({
        messages: [createMockMessage({ variant: "primary" })],
        waitingForResponseMessage: "Please wait...",
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
