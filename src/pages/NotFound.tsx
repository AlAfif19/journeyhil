export function NotFound() {
  return (
    <main className="not-found-page">
      <h1>Theme not found</h1>
      <p>Pick one of the JourneyHil routes.</p>
      <div className="hero-actions">
        <a href="/theme/magical">Magical</a>
        <a href="/theme/pixel">Pixel</a>
        <a href="/theme/scrapbook">Scrapbook</a>
      </div>
    </main>
  );
}
