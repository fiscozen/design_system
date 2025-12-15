import { describe, it } from "vitest";
import { mount } from "@vue/test-utils";
import { FzAppointments } from "..";
import { addDays, addHours, formatISO, startOfDay } from "date-fns";

describe.concurrent("FzAppointments", () => {
  describe("Auto Mode", () => {
    it("generates slots correctly with ISO slotStartTime", async ({
      expect,
    }) => {
      // Use a future date to ensure slots are visible
      const tomorrow = addDays(new Date(), 1);
      const slotStart = new Date(tomorrow);
      slotStart.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          startDate: formatISO(tomorrow),
          slotStartTime: formatISO(slotStart),
          slotCount: 2,
          slotInterval: 30,
          type: "auto",
        },
      });

      expect(wrapper.text()).toContain("10:00");
      expect(wrapper.text()).toContain("10:30");
    });

    it("displays info text with slot interval", async ({ expect }) => {
      const wrapper = mount(FzAppointments, {
        props: {
          slotCount: 5,
          slotInterval: 45,
        },
      });

      expect(wrapper.text()).toContain("45 minuti a partire dalle");
    });

    it("allows custom info text", async ({ expect }) => {
      const wrapper = mount(FzAppointments, {
        props: {
          slotCount: 5,
          infoText: "Seleziona un orario",
        },
      });

      expect(wrapper.text()).toContain("Seleziona un orario");
    });

    it("shows alert when no slots available", async ({ expect }) => {
      // Create a scenario with no available slots (start in the past)
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);

      const wrapper = mount(FzAppointments, {
        props: {
          startDate: formatISO(pastDate),
          slotStartTime: formatISO(pastDate),
          slotCount: 2,
          alertTitle: "Nessun slot",
          alertDescription: "Non ci sono slot disponibili",
        },
      });

      expect(wrapper.text()).toContain("Nessun slot");
    });
  });

  describe("Manual Mode", () => {
    it("renders pre-defined slots", async ({ expect }) => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot1 = new Date(tomorrow);
      slot1.setHours(9, 0, 0, 0);
      const slot2 = new Date(tomorrow);
      slot2.setHours(10, 30, 0, 0);
      const slot3 = new Date(tomorrow);
      slot3.setHours(14, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          slots: [slot1, slot2, slot3],
          type: "manual",
        },
      });

      expect(wrapper.text()).toContain("09:00");
      expect(wrapper.text()).toContain("10:30");
      expect(wrapper.text()).toContain("14:00");
    });

    it("accepts ISO string slots", async ({ expect }) => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot1 = new Date(tomorrow);
      slot1.setHours(11, 0, 0, 0);
      const slot2 = new Date(tomorrow);
      slot2.setHours(15, 30, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          slots: [formatISO(slot1), formatISO(slot2)],
          type: "manual",
        },
      });

      expect(wrapper.text()).toContain("11:00");
      expect(wrapper.text()).toContain("15:30");
    });

    it("groups slots by day and navigates between days", async ({ expect }) => {
      const day1 = addDays(startOfDay(new Date()), 1);
      const day2 = addDays(startOfDay(new Date()), 3);

      const slot1 = new Date(day1);
      slot1.setHours(10, 0, 0, 0);
      const slot2 = new Date(day2);
      slot2.setHours(14, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          slots: [slot1, slot2],
          type: "manual",
        },
      });

      // Should show first day initially
      expect(wrapper.text()).toContain("10:00");
      expect(wrapper.text()).not.toContain("14:00");

      // Navigate forward
      const forwardButton = wrapper.find('[aria-label="Giorno successivo"]');
      await forwardButton.trigger("click");

      // Should now show second day
      expect(wrapper.text()).toContain("14:00");
      expect(wrapper.text()).not.toContain("10:00");
    });

    it("hides info text when not provided", async ({ expect }) => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot = new Date(tomorrow);
      slot.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          slots: [slot],
          type: "manual",
        },
      });

      // Should not contain the default auto mode info text
      expect(wrapper.text()).not.toContain("minuti a partire dalle");
    });

    it("shows custom info text when provided", async ({ expect }) => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot = new Date(tomorrow);
      slot.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          slots: [slot],
          infoText: "Orari disponibili per la consulenza",
          type: "manual",
        },
      });

      expect(wrapper.text()).toContain("Orari disponibili per la consulenza");
    });

    it("shows alert when no slots provided", async ({ expect }) => {
      const wrapper = mount(FzAppointments, {
        props: {
          slots: [],
          alertTitle: "Nessuna disponibilità",
          type: "manual",
        },
      });

      expect(wrapper.text()).toContain("Nessuna disponibilità");
    });

    it("emits update:modelValue when slot is selected", async ({ expect }) => {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const slot = new Date(tomorrow);
      slot.setHours(10, 0, 0, 0);

      const wrapper = mount(FzAppointments, {
        props: {
          slots: [slot],
          type: "manual",
        },
      });

      const radioInput = wrapper.find('input[type="radio"]');
      await radioInput.setValue(true);

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    });
  });
});
