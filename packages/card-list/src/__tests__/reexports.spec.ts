import { describe, it, expect } from "vitest";
// Importing from "..", which resolves to ../index.ts — the same barrel
// consumers reach via `@fiscozen/card-list`. If FzActionProps or
// FzBadgeTone disappear from that barrel, `vue-tsc --noEmit` (run as
// part of the build) fails on this file.
import {
  FzCardList,
  FzCardListItem,
  type FzActionProps,
  type FzBadgeTone,
  type FzCardListItemProps,
} from "..";

describe("Public type re-exports", () => {
  it("exposes FzActionProps from @fiscozen/card-list", () => {
    const action: FzActionProps = {
      type: "action",
      variant: "textLeft",
      label: "Open",
    };
    expect(action.label).toBe("Open");
  });

  it("exposes FzBadgeTone from @fiscozen/card-list", () => {
    const tone: FzBadgeTone = "success";
    expect(tone).toBe("success");
  });

  it("exposes the existing FzCardListItemProps via re-export of types.ts", () => {
    const item: FzCardListItemProps = {
      title: "Sample",
    };
    expect(item.title).toBe("Sample");
  });

  it("exposes the component default exports", () => {
    expect(FzCardList).toBeDefined();
    expect(FzCardListItem).toBeDefined();
  });
});
