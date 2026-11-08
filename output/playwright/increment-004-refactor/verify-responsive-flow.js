async (page) => {
  await page.goto("http://127.0.0.1:5173/test/browser/fixture.html");
  await page
    .getByRole("button")
    .filter({
      has: page.locator(".token-identity strong", {
        hasText: "protected-color",
      }),
    })
    .first()
    .click();
  await page
    .getByLabel("Red", { exact: true })
    .fill("0.123456789123456789123456789123456789");
  for (const size of [
    { width: 1024, height: 768 },
    { width: 320, height: 568 },
    { width: 640, height: 360 },
  ]) {
    await page.setViewportSize(size);
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw Error("Horizontal page overflow " + size.width);
    if (
      (await page.getByLabel("Red", { exact: true }).inputValue()) !==
      "0.123456789123456789123456789123456789"
    )
      throw Error("Resize lost draft");
    await page
      .getByRole("button", { name: "Collapse token inspector" })
      .click();
    if (await page.getByLabel("Red", { exact: true }).isVisible())
      throw Error("Collapsed form visible");
    await page.getByRole("button", { name: "Expand token inspector" }).click();
    await page.getByLabel("Red", { exact: true }).focus();
    await page.keyboard.press("Tab");
    const active = await page.evaluate(() => ({
      tag: document.activeElement.tagName,
      hidden: !!document.activeElement.closest("[hidden]"),
    }));
    if (active.hidden) throw Error("Focus entered hidden content");
    await page.screenshot({
      path:
        "output/playwright/increment-004-refactor/final-06-responsive-" +
        size.width +
        ".png",
    });
  }
  await page.getByRole("button", { name: "Open project navigation" }).click();
  await page.getByRole("dialog", { name: "Project navigation" }).waitFor();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    await page.waitForFunction(
      () => !!document.activeElement.closest("[role=dialog]"),
      { timeout: 1000 },
    );
  }
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Open project navigation" }).waitFor();
  await page.waitForFunction(
    () =>
      document.activeElement?.getAttribute("aria-label") ===
      "Open project navigation",
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page
    .getByRole("button", { name: "New token", exact: true })
    .first()
    .click();
  await page.getByRole("dialog", { name: "Create a color token" }).waitFor();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    await page.waitForFunction(
      () => !!document.activeElement.closest("[role=dialog]"),
      { timeout: 1000 },
    );
  }
  await page.keyboard.press("Escape");
}
