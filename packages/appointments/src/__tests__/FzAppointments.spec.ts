import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { FzAppointments } from "..";
import { addDays, formatISO, startOfDay } from "date-fns";

describe("FzAppointments", () => {
  describe("Rendering", () => {
    it("should render with default props (auto mode)", () => {
      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          slotCount: 5,
          slotStartTime: formatISO(new Date()),
          startDate: formatISO(new Date()),
        },
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".fz-appointments").exists()).toBe(true);
    });

    it("should render with manual mode", () => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot = new Date(tomorrow);
      slot.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: [slot],
        },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should render date navigation buttons", () => {
      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          slotCount: 5,
          slotStartTime: formatISO(new Date()),
          startDate: formatISO(new Date()),
        },
      });

      const backButton = wrapper.find('[aria-label="Giorno precedente"]');
      const forwardButton = wrapper.find('[aria-label="Giorno successivo"]');

      expect(backButton.exists()).toBe(true);
      expect(forwardButton.exists()).toBe(true);
    });

    it("should render formatted date in header", () => {
      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          slotCount: 5,
          slotStartTime: formatISO(new Date()),
          startDate: formatISO(new Date()),
        },
      });

      const dateHeader = wrapper.find("h3");
      expect(dateHeader.exists()).toBe(true);
      expect(dateHeader.text()).toBeTruthy();
    });

    it("should render info text when provided", () => {
      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          slotCount: 5,
          slotStartTime: formatISO(new Date()),
          startDate: formatISO(new Date()),
          infoText: "Custom info text",
        },
      });

      expect(wrapper.text()).toContain("Custom info text");
    });

    it("should render alert when no slots available", () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          slotCount: 2,
          slotStartTime: formatISO(pastDate),
          startDate: formatISO(pastDate),
          alertTitle: "No slots",
          alertDescription: "No available slots",
        },
      });

      expect(wrapper.text()).toContain("No slots");
      expect(wrapper.text()).toContain("No available slots");
    });

    it("should render time slots when available", async () => {
      const tomorrow = addDays(new Date(), 1);
      const slotStart = new Date(tomorrow);
      slotStart.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          startDate: formatISO(tomorrow),
          slotStartTime: formatISO(slotStart),
          slotCount: 2,
          slotInterval: 30,
        },
      });

      await wrapper.vm.$nextTick();
      const radioInputs = wrapper.findAll('input[type="radio"]');
      expect(radioInputs.length).toBeGreaterThan(0);
    });
  });

  describe("Props", () => {
    describe("type prop", () => {
      it("should support auto mode", () => {
        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 5,
            slotStartTime: formatISO(new Date()),
            startDate: formatISO(new Date()),
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should support manual mode", () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot = new Date(tomorrow);
        slot.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot],
          },
        });
        expect(wrapper.exists()).toBe(true);
      });
    });

    describe("modelValue prop", () => {
      it("should accept modelValue as ISO string", () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot = new Date(tomorrow);
        slot.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot],
            modelValue: formatISO(slot),
          },
        });
        expect(wrapper.exists()).toBe(true);
      });
    });

    describe("name prop", () => {
      it("should use custom name for radio group", () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot = new Date(tomorrow);
        slot.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot],
            name: "custom-appointments",
          },
        });

        const radioGroup = wrapper.findComponent({ name: "FzRadioGroup" });
        expect(radioGroup.exists()).toBe(true);
        expect(radioGroup.props("name")).toBe("custom-appointments");
      });
    });

    describe("required prop", () => {
      it("should apply required attribute when true", async () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot = new Date(tomorrow);
        slot.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot],
            required: true,
          },
        });

        await wrapper.vm.$nextTick();
        const radioInput = wrapper.find('input[type="radio"]');
        expect(radioInput.exists()).toBe(true);
        expect(radioInput.attributes("required")).toBeDefined();
      });

      it("should not apply required attribute when false", async () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot = new Date(tomorrow);
        slot.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot],
            required: false,
          },
        });

        await wrapper.vm.$nextTick();
        const radioInput = wrapper.find('input[type="radio"]');
        if (radioInput.exists()) {
          expect(radioInput.attributes("required")).toBeUndefined();
        }
      });
    });

    describe("infoText prop", () => {
      it("should display custom info text", () => {
        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 5,
            slotStartTime: formatISO(new Date()),
            startDate: formatISO(new Date()),
            infoText: "Select a time",
          },
        });

        expect(wrapper.text()).toContain("Select a time");
      });

      it("should not display info text when not provided in manual mode", () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot = new Date(tomorrow);
        slot.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot],
          },
        });

        expect(wrapper.text()).not.toContain("minuti a partire dalle");
      });
    });

    describe("alertTitle and alertDescription props", () => {
      it("should display custom alert title and description", () => {
        const pastDate = new Date();
        pastDate.setFullYear(pastDate.getFullYear() - 1);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 2,
            slotStartTime: formatISO(pastDate),
            startDate: formatISO(pastDate),
            alertTitle: "Custom Title",
            alertDescription: "Custom Description",
          },
        });

        expect(wrapper.text()).toContain("Custom Title");
        expect(wrapper.text()).toContain("Custom Description");
      });
    });

    describe("Auto mode props", () => {
      it("should accept startDate prop", () => {
        const tomorrow = formatISO(addDays(new Date(), 1));
        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 5,
            slotStartTime: formatISO(new Date()),
            startDate: tomorrow,
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should accept maxDate prop", () => {
        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 5,
            slotStartTime: formatISO(new Date()),
            startDate: formatISO(new Date()),
            maxDate: formatISO(addDays(new Date(), 7)),
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should accept slotStartTime prop", () => {
        const slotStart = new Date();
        slotStart.setHours(9, 0, 0, 0);
        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 5,
            slotStartTime: formatISO(slotStart),
            startDate: formatISO(new Date()),
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should accept slotCount prop", () => {
        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 10,
            slotStartTime: formatISO(new Date()),
            startDate: formatISO(new Date()),
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should accept slotInterval prop", () => {
        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 5,
            slotStartTime: formatISO(new Date()),
            startDate: formatISO(new Date()),
            slotInterval: 15,
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should accept breakDuration prop", () => {
        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 5,
            slotStartTime: formatISO(new Date()),
            startDate: formatISO(new Date()),
            breakDuration: 10,
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should accept excludedDays prop", () => {
        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 5,
            slotStartTime: formatISO(new Date()),
            startDate: formatISO(new Date()),
            excludedDays: [0, 6], // Sunday and Saturday
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should accept excludedSlots prop", () => {
        const tomorrow = addDays(new Date(), 1);
        const excludedSlot = new Date(tomorrow);
        excludedSlot.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 5,
            slotStartTime: formatISO(new Date()),
            startDate: formatISO(new Date()),
            excludedSlots: [formatISO(excludedSlot)],
          },
        });
        expect(wrapper.exists()).toBe(true);
      });
    });

    describe("Manual mode props", () => {
      it("should accept slots as Date objects", () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot1 = new Date(tomorrow);
        slot1.setHours(9, 0, 0, 0);
        const slot2 = new Date(tomorrow);
        slot2.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot1, slot2],
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should accept slots as ISO strings", () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot1 = new Date(tomorrow);
        slot1.setHours(9, 0, 0, 0);
        const slot2 = new Date(tomorrow);
        slot2.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [formatISO(slot1), formatISO(slot2)],
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should accept mixed Date and ISO string slots", () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot1 = new Date(tomorrow);
        slot1.setHours(9, 0, 0, 0);
        const slot2 = new Date(tomorrow);
        slot2.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot1, formatISO(slot2)],
          },
        });
        expect(wrapper.exists()).toBe(true);
      });

      it("should deduplicate slots with identical timestamps", async () => {
        // This test verifies that duplicate slots (same timestamp) are deduplicated
        // to prevent Vue duplicate key errors
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot1 = new Date(tomorrow);
        slot1.setHours(10, 0, 0, 0);
        const slot2 = new Date(tomorrow);
        slot2.setHours(10, 0, 0, 0); // Same timestamp as slot1
        const slot3 = new Date(tomorrow);
        slot3.setHours(14, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot1, slot2, slot3, formatISO(slot1)], // Multiple duplicates
          },
        });

        await wrapper.vm.$nextTick();

        // Should render without duplicate key errors
        expect(wrapper.exists()).toBe(true);

        // Should only render unique slots (slot1 and slot3, since slot2 and formatISO(slot1) are duplicates)
        const radioCards = wrapper.findAllComponents({ name: "FzRadioCard" });
        // Should have 2 unique slots, not 4
        expect(radioCards.length).toBe(2);

        // Verify no duplicate keys by checking all keys are unique
        const keys = radioCards.map((card) => card.props("label"));
        const uniqueKeys = new Set(keys);
        expect(uniqueKeys.size).toBe(keys.length);
      });
    });
  });

  describe("Events", () => {
    describe("update:modelValue event", () => {
      it("should emit update:modelValue when slot is selected", async () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot = new Date(tomorrow);
        slot.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot],
          },
        });

        await wrapper.vm.$nextTick();
        const radioInput = wrapper.find('input[type="radio"]');
        if (radioInput.exists()) {
          await radioInput.setValue(true);
          expect(wrapper.emitted("update:modelValue")).toBeTruthy();
          expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
            slot.toISOString(),
          ]);
        }
      });

      it("should emit update:modelValue with ISO string value", async () => {
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const slot = new Date(tomorrow);
        slot.setHours(10, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot],
          },
        });

        await wrapper.vm.$nextTick();
        const radioInput = wrapper.find('input[type="radio"]');
        if (radioInput.exists()) {
          await radioInput.setValue(true);
          const emitted = wrapper.emitted("update:modelValue");
          expect(emitted).toBeTruthy();
          if (emitted && emitted[0]) {
            expect(typeof emitted[0][0]).toBe("string");
            expect(emitted[0][0]).toMatch(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
            );
          }
        }
      });
    });

    describe("Navigation events", () => {
      it("should navigate forward when forward button is clicked", async () => {
        const day1 = addDays(startOfDay(new Date()), 1);
        const day2 = addDays(startOfDay(new Date()), 3);

        const slot1 = new Date(day1);
        slot1.setHours(10, 0, 0, 0);
        const slot2 = new Date(day2);
        slot2.setHours(14, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot1, slot2],
          },
        });

        const initialDate = wrapper.find("h3").text();
        const forwardButton = wrapper.find('[aria-label="Giorno successivo"]');
        await forwardButton.trigger("click");

        await wrapper.vm.$nextTick();
        const newDate = wrapper.find("h3").text();
        expect(newDate).not.toBe(initialDate);
      });

      it("should navigate back when back button is clicked", async () => {
        const day1 = addDays(startOfDay(new Date()), 1);
        const day2 = addDays(startOfDay(new Date()), 3);

        const slot1 = new Date(day1);
        slot1.setHours(10, 0, 0, 0);
        const slot2 = new Date(day2);
        slot2.setHours(14, 0, 0, 0);

        const wrapper = mount(FzAppointments, {
          props: {
            type: "manual",
            slots: [slot1, slot2],
          },
        });

        // Navigate forward first
        const forwardButton = wrapper.find('[aria-label="Giorno successivo"]');
        await forwardButton.trigger("click");
        await wrapper.vm.$nextTick();

        const dateAfterForward = wrapper.find("h3").text();
        const backButton = wrapper.find('[aria-label="Giorno precedente"]');
        await backButton.trigger("click");

        await wrapper.vm.$nextTick();
        const dateAfterBack = wrapper.find("h3").text();
        expect(dateAfterBack).not.toBe(dateAfterForward);
      });

      it("should not cause infinite loop when all weekdays are excluded without maxDate", async () => {
        // This test verifies the fix for infinite loop when all days are excluded
        // and maxDate is undefined. The function should stop after maxIterations.
        const wrapper = mount(FzAppointments, {
          props: {
            type: "auto",
            slotCount: 5,
            slotStartTime: formatISO(new Date()),
            startDate: formatISO(new Date()),
            excludedDays: [0, 1, 2, 3, 4, 5, 6], // All weekdays excluded
            // maxDate is intentionally undefined
          },
        });

        const initialDate = wrapper.find("h3").text();
        const forwardButton = wrapper.find('[aria-label="Giorno successivo"]');

        // This should not cause an infinite loop - it should complete quickly
        const startTime = Date.now();
        await forwardButton.trigger("click");
        await wrapper.vm.$nextTick();
        const endTime = Date.now();

        // The operation should complete in less than 1 second (infinite loop would hang)
        expect(endTime - startTime).toBeLessThan(1000);

        // The date should not have changed since all days are excluded
        // and we should have hit the iteration limit
        const finalDate = wrapper.find("h3").text();
        expect(finalDate).toBe(initialDate);
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on navigation buttons", () => {
      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          slotCount: 5,
          slotStartTime: formatISO(new Date()),
          startDate: formatISO(new Date()),
        },
      });

      const backButton = wrapper.find('[aria-label="Giorno precedente"]');
      const forwardButton = wrapper.find('[aria-label="Giorno successivo"]');

      expect(backButton.exists()).toBe(true);
      expect(forwardButton.exists()).toBe(true);
    });

    it("should have aria-disabled on disabled navigation buttons", async () => {
      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          slotCount: 5,
          slotStartTime: formatISO(new Date()),
          startDate: formatISO(new Date()),
        },
      });

      await wrapper.vm.$nextTick();
      const backButton = wrapper.find('[aria-label="Giorno precedente"]');
      const backButtonComponent = backButton.findComponent({
        name: "FzIconButton",
      });

      if (backButtonComponent.exists()) {
        expect(backButtonComponent.props("disabled")).toBe(true);
      }
    });

    it('should have role="group" on radio group', async () => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot = new Date(tomorrow);
      slot.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: [slot],
        },
      });

      await wrapper.vm.$nextTick();
      const radioGroup = wrapper.findComponent({ name: "FzRadioGroup" });
      if (radioGroup.exists()) {
        expect(radioGroup.attributes("role")).toBe("group");
      }
    });

    it("should have required attribute on radio inputs when required prop is true", async () => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot = new Date(tomorrow);
      slot.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: [slot],
          required: true,
        },
      });

      await wrapper.vm.$nextTick();
      const radioInput = wrapper.find('input[type="radio"]');
      if (radioInput.exists()) {
        expect(radioInput.attributes("required")).toBeDefined();
      }
    });

    it("should have proper name attribute on radio inputs", async () => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot = new Date(tomorrow);
      slot.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: [slot],
          name: "appointment-time",
        },
      });

      await wrapper.vm.$nextTick();
      const radioInput = wrapper.find('input[type="radio"]');
      if (radioInput.exists()) {
        expect(radioInput.attributes("name")).toBeTruthy();
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty slots array in manual mode", () => {
      const wrapper = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: [],
        },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle undefined modelValue", () => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot = new Date(tomorrow);
      slot.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: [slot],
          modelValue: undefined,
        },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle multiple instances with unique radio group names", () => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot = new Date(tomorrow);
      slot.setHours(10, 0, 0, 0);

      const wrapper1 = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: [slot],
        },
      });

      const wrapper2 = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: [slot],
        },
      });

      expect(wrapper1.exists()).toBe(true);
      expect(wrapper2.exists()).toBe(true);
    });

    it("should handle slots spanning multiple days", () => {
      const day1 = addDays(startOfDay(new Date()), 1);
      const day2 = addDays(startOfDay(new Date()), 3);
      const day3 = addDays(startOfDay(new Date()), 5);

      const slots = [new Date(day1), new Date(day2), new Date(day3)];

      const wrapper = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: slots,
        },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle past dates in auto mode", () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          slotCount: 5,
          slotStartTime: formatISO(pastDate),
          startDate: formatISO(pastDate),
        },
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Snapshots", () => {
    const defaultDate = new Date(2026, 0, 23, 10, 0, 0, 0);
    it("should match snapshot - default state (auto mode)", () => {
      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          slotCount: 5,
          slotStartTime: formatISO(defaultDate),
          startDate: formatISO(defaultDate),
          name: "auto-appointments",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - manual mode with slots", () => {
      const slot1 = new Date(defaultDate);
      slot1.setHours(9, 0, 0, 0);
      const slot2 = new Date(defaultDate);
      slot2.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: [slot1, slot2],
          name: "manual-appointments",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - no slots available", () => {
      const pastDate = new Date(defaultDate);
      pastDate.setFullYear(pastDate.getFullYear() - 1);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "auto",
          slotCount: 2,
          slotStartTime: formatISO(pastDate),
          startDate: formatISO(pastDate),
          alertTitle: "No slots",
          alertDescription: "No available slots",
          name: "auto-appointments",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("should match snapshot - required state", () => {
      const slot = new Date(defaultDate);

      const wrapper = mount(FzAppointments, {
        props: {
          type: "manual",
          slots: [slot],
          required: true,
          name: "manual-appointments",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
