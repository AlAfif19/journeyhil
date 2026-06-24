import { describe, expect, it } from "vitest";
import { resolveRoute } from "./routing";

describe("resolveRoute", () => {
  it("recognizes the theme chooser route", () => {
    expect(resolveRoute("/")).toEqual({ kind: "chooser" });
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
