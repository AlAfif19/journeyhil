import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { galleryItems } from "../data/journey";
import { GallerySection } from "./sections";

describe("GallerySection", () => {
  it("keeps every gallery item lazy without rendering a load-more button", () => {
    const markup = renderToStaticMarkup(<GallerySection theme="magical" />);

    expect(markup).not.toContain("More memories");
    expect(markup).not.toContain("gallery-load-more");
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain(galleryItems[0].src);
    expect(markup).toContain(galleryItems.at(-1)?.src);
  });
});
