import { describe, expect, it } from "vitest";
import { stages } from "./stages";

describe("supply chain stages", () => {
  it("defines six surfaces", () => {
    expect(stages).toHaveLength(6);
  });

  it("uses unique ids", () => {
    const ids = stages.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("numbers stages in order from 01 to 06", () => {
    expect(stages.map((s) => s.num)).toEqual(["01", "02", "03", "04", "05", "06"]);
  });

  it("uses lowercase ids matching anchor convention", () => {
    for (const stage of stages) {
      expect(stage.id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });
});
