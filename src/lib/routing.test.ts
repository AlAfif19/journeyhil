import { describe, expect, it } from "vitest";
import { resolveRoute } from "./routing";

describe("resolveRoute", () => {
  it("opens Magical as the default route", () => {
    expect(resolveRoute("/")).toEqual({ kind: "theme", theme: "magical" });
  });

  it("recognizes all theme routes", () => {
    expect(resolveRoute("/theme/magical")).toEqual({ kind: "theme", theme: "magical" });
    expect(resolveRoute("/theme/pixel")).toEqual({ kind: "theme", theme: "pixel" });
    expect(resolveRoute("/theme/scrapbook")).toEqual({ kind: "theme", theme: "scrapbook" });
  });

  it("returns not-found for unsupported routes", () => {
    expect(resolveRoute("/missing")).toEqual({ kind: "not-found" });
  });
});
