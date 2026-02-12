import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { FzChatContainer } from "..";
import { FzIconButton } from "@fiscozen/button";
import { FzIcon } from "@fiscozen/icons";

beforeEach(() => {
  // Mock matchMedia for useMediaQuery composable (used by FzCard)
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
import type { FzChatContainerProps } from "../types";

const createMockMessage = (
  overrides: Partial<FzChatContainerProps["messages"][number]> = {},
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

describe("FzChatContainer", () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe("Rendering", () => {
    it("should render with empty messages", () => {
      const wrapper = mount(FzChatContainer, {
        props: { messages: [] },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should render empty state when messages is empty and emptyMessage is provided", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [],
          emptyMessage: "No messages yet",
        },
      });
      expect(wrapper.text()).toContain("No messages yet");
    });

    it("should render empty message description when provided and no messages", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [],
          emptyMessage: "No messages yet",
          emptyMessageDescription: "Start a conversation",
        },
      });
      expect(wrapper.text()).toContain("No messages yet");
      expect(wrapper.text()).toContain("Start a conversation");
    });

    it("should not render empty message when there are messages", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [createMockMessage()],
          emptyMessage: "No messages yet",
        },
      });
      expect(wrapper.text()).not.toContain("No messages yet");
    });

    it("should render messages with user name and message content", () => {
      const messages = [
        createMockMessage({
          message: "First message",
          variant: "invisible",
          user: { firstName: "Jane", lastName: "Smith", avatar: "" },
        }),
      ];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      expect(wrapper.text()).toContain("Jane Smith");
      expect(wrapper.text()).toContain("First message");
    });

    it("should render multiple messages", () => {
      const messages = [
        createMockMessage({ message: "Message 1" }),
        createMockMessage({ message: "Message 2", variant: "invisible" }),
      ];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      expect(wrapper.text()).toContain("Message 1");
      expect(wrapper.text()).toContain("Message 2");
    });

    it("should render waiting for response message when last message is primary (sent by user)", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [createMockMessage({ variant: "primary" })],
          waitingForResponseMessage: "Waiting for response...",
        },
      });
      expect(wrapper.text()).toContain("Waiting for response...");
    });

    it("should not render waiting for response when last message is invisible (received)", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [createMockMessage({ variant: "invisible" })],
          waitingForResponseMessage: "Waiting for response...",
        },
      });
      expect(wrapper.text()).not.toContain("Waiting for response...");
    });

    it("should not render waiting for response when messages is empty", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [],
          waitingForResponseMessage: "Waiting for response...",
        },
      });
      expect(wrapper.text()).not.toContain("Waiting for response...");
    });

    it("should vertically center-align the icon with the text in the waiting message", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [createMockMessage({ variant: "primary" })],
          waitingForResponseMessage: "Waiting for response...",
        },
      });
      const waitingIcon = wrapper
        .findAllComponents(FzIcon)
        .find((icon) => icon.props("name") === "clock");
      expect(waitingIcon).toBeDefined();
      // The direct parent FzContainer should have alignItems="center" for vertical alignment
      const parentContainer = waitingIcon!.element.closest(
        ".fz-container.align-items-center",
      );
      expect(parentContainer).not.toBeNull();
    });

    it("should apply grey-300 color to the clock icon in the waiting message", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [createMockMessage({ variant: "primary" })],
          waitingForResponseMessage: "Waiting for response...",
        },
      });
      const waitingIcon = wrapper
        .findAllComponents(FzIcon)
        .find((icon) => icon.props("name") === "clock");
      expect(waitingIcon).toBeDefined();
      expect(waitingIcon!.classes()).toContain("text-grey-300");
    });

    it("should render attachments with download button", () => {
      const messages = [
        createMockMessage({
          attachments: [
            { name: "document.pdf", url: "https://example.com/doc.pdf" },
          ],
        }),
      ];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      expect(wrapper.text()).toContain("document.pdf");
      expect(wrapper.findComponent(FzIconButton).exists()).toBe(true);
    });
  });

  // ============================================
  // PROPS TESTS
  // ============================================
  describe("Props", () => {
    it("should apply center alignment when messages is empty", () => {
      const wrapper = mount(FzChatContainer, {
        props: { messages: [] },
      });
      const container = wrapper.findComponent({ name: "FzContainer" });
      expect(container.exists()).toBe(true);
    });

    it("should render avatar for invisible (receiver) variant", () => {
      const messages = [createMockMessage({ variant: "invisible" })];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      const avatar = wrapper.findComponent({ name: "FzAvatar" });
      expect(avatar.exists()).toBe(true);
    });

    it("should not render avatar for primary (sender) variant", () => {
      const messages = [createMockMessage({ variant: "primary" })];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      const avatars = wrapper.findAllComponents({ name: "FzAvatar" });
      expect(avatars.length).toBe(0);
    });
  });

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe("Events", () => {
    it("should call window.open when download button is clicked", async () => {
      const downloadUrl = "https://example.com/document.pdf";
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      const messages = [
        createMockMessage({
          attachments: [{ name: "document.pdf", url: downloadUrl }],
        }),
      ];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      const iconButton = wrapper.findComponent(FzIconButton);
      await iconButton.trigger("click");
      expect(openSpy).toHaveBeenCalledWith(downloadUrl, "_blank");
      openSpy.mockRestore();
    });

    it("should call window.open with correct url when multiple attachments and first is clicked", async () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      const messages = [
        createMockMessage({
          attachments: [
            { name: "first.pdf", url: "https://example.com/first.pdf" },
            { name: "second.pdf", url: "https://example.com/second.pdf" },
          ],
        }),
      ];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      const iconButtons = wrapper.findAllComponents(FzIconButton);
      await iconButtons[0].trigger("click");
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
    it("should format ISO timestamp to Italian format (dd Mmm, HH:mm)", () => {
      const messages = [
        createMockMessage({ timestamp: "2024-01-15T10:30:00.000Z" }),
      ];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      // With TZ=Europe/Rome from vitest setup, 10:30 UTC = 11:30 CET
      // Format: "15 Gen, 11:30"
      expect(wrapper.text()).toMatch(/\d{2} [A-Z][a-z]{2}, \d{2}:\d{2}/);
    });

    it("should handle invalid timestamp gracefully", () => {
      const messages = [createMockMessage({ timestamp: "invalid-date" })];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  // ============================================
  // SCROLL BEHAVIOR
  // ============================================
  describe("Scroll behavior", () => {
    it("should scroll to bottom on mount", async () => {
      const messages = [createMockMessage()];
      let scrollTopValue = 0;
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      const container = wrapper.find(".grow.overflow-y-auto");
      Object.defineProperty(container.element, "scrollHeight", {
        value: 500,
        configurable: true,
      });
      Object.defineProperty(container.element, "scrollTop", {
        get: () => scrollTopValue,
        set: (v: number) => {
          scrollTopValue = v;
        },
        configurable: true,
      });
      await nextTick();
      await nextTick();
      expect(scrollTopValue).toBe(500);
    });
  });

  // ============================================
  // CSS CLASSES
  // ============================================
  describe("CSS Classes", () => {
    it("should apply base container classes", () => {
      const wrapper = mount(FzChatContainer, {
        props: { messages: [] },
      });
      const container = wrapper.find(".grow.overflow-y-auto");
      expect(container.exists()).toBe(true);
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================
  describe("Accessibility", () => {
    it("should render empty state with heading level 2", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [],
          emptyMessage: "No messages yet",
        },
      });
      const heading = wrapper.find("h2");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("No messages yet");
    });

    it("should give download buttons an aria-label with attachment name", () => {
      const messages = [
        createMockMessage({
          attachments: [
            { name: "report.pdf", url: "https://example.com/r.pdf" },
          ],
        }),
      ];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      const button = wrapper.findComponent(FzIconButton);
      expect(button.attributes("aria-label")).toBe("Scarica report.pdf");
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================
  describe("Edge Cases", () => {
    it("should handle message with empty attachments array", () => {
      const messages = [createMockMessage({ attachments: [] })];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      expect(wrapper.text()).toContain("Hello, world!");
      expect(wrapper.findAllComponents(FzIconButton).length).toBe(0);
    });

    it("should handle message with multiple attachments", () => {
      const messages = [
        createMockMessage({
          attachments: [
            { name: "a.pdf", url: "url1" },
            { name: "b.pdf", url: "url2" },
          ],
        }),
      ];
      const wrapper = mount(FzChatContainer, {
        props: { messages },
      });
      expect(wrapper.findAllComponents(FzIconButton).length).toBe(2);
    });
  });

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe("Snapshots", () => {
    it("should match snapshot - empty state", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [],
          emptyMessage: "No messages",
          emptyMessageDescription: "Start chatting",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - with messages", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [createMockMessage({ message: "Test message", variant: "invisible" })],
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - waiting for response", () => {
      const wrapper = mount(FzChatContainer, {
        props: {
          messages: [createMockMessage({ variant: "primary" })],
          waitingForResponseMessage: "Please wait...",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
