async (page) => {
  await page.goto("http://127.0.0.1:5173/test/browser/fixture.html");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page
    .getByRole("button")
    .filter({
      has: page.locator(".token-identity strong", {
        hasText: "protected-color",
      }),
    })
    .first()
    .click();
  const appliedBefore = await page.evaluate(() =>
    JSON.stringify(window.dtwFixture.snapshot()),
  );
  const tinyNegative = "-0." + "0".repeat(400) + "1";
  const cases = [
    {
      space: "srgb",
      label: "Red",
      min: "0",
      max: "1",
      below: tinyNegative,
      above: "1.0000000000000000000000001",
    },
    {
      space: "display-p3",
      label: "Red",
      min: "0",
      max: "1",
      below: tinyNegative,
      above: "1.0000000000000000000000001",
    },
    {
      space: "hsl",
      label: "Hue (°)",
      min: "0",
      max: "359.9",
      below: tinyNegative,
      above: "359.9000000000000000000000001",
    },
    {
      space: "hsl",
      label: "Saturation (%)",
      min: "0",
      max: "100",
      below: tinyNegative,
      above: "100.0000000000000000000000001",
    },
    {
      space: "oklab",
      label: "Lightness",
      min: "0",
      max: "1",
      below: tinyNegative,
      above: "1.0000000000000000000000001",
    },
    {
      space: "oklab",
      label: "a",
      min: "-0.4",
      max: "0.4",
      below: "-0.4000000000000000000000001",
      above: "0.4000000000000000000000001",
    },
    {
      space: "oklch",
      label: "Chroma",
      min: "0",
      max: "0.4",
      below: tinyNegative,
      above: "0.4000000000000000000000001",
    },
    {
      space: "srgb",
      label: "Red",
      bytes: true,
      min: "0",
      max: "255",
      below: tinyNegative,
      above: "255.0000000000000000000000001",
    },
    {
      space: "srgb",
      label: "Alpha",
      min: "0",
      max: "1",
      below: tinyNegative,
      above: "1.0000000000000000000000001",
    },
  ];
  for (const c of cases) {
    await page
      .getByRole("combobox", { name: "View color space", exact: true })
      .selectOption(c.space);
    if (c.bytes)
      await page
        .getByRole("combobox", { name: "RGB entry scale", exact: true })
        .selectOption("bytes");
    const field = page.getByLabel(c.label, { exact: true });
    const slider = page.getByRole("slider", {
      name: c.label + " slider",
      exact: true,
    });
    for (const text of [c.min, c.max]) {
      await field.fill(text);
      await slider.waitFor();
    }
    for (const text of [c.above, c.below]) {
      await field.fill(text);
      if (await slider.count())
        throw Error("Fabricated thumb " + c.space + " " + c.label + " " + text);
      const control = field.locator("xpath=../..");
      await control
        .locator(".range-unavailable")
        .filter({ hasText: "Outside visual range" })
        .waitFor();
      if ((await field.inputValue()) !== text)
        throw Error("Exact entry changed " + c.label);
      if (
        (await page.evaluate(() =>
          JSON.stringify(window.dtwFixture.snapshot()),
        )) !== appliedBefore
      )
        throw Error("Slider eligibility changed source");
      if (
        c.space === "srgb" &&
        c.label === "Red" &&
        !c.bytes &&
        text === c.above
      )
        await page.screenshot({
          path: "output/playwright/increment-004-refactor/final-11-r1-exact-outside.png",
        });
    }
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
  }
  await page.goto("http://127.0.0.1:4184/");
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await page
    .getByRole("button", { name: "New token", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await page
    .getByLabel("Red", { exact: true })
    .fill("1.0000000000000000000000001");
  if (
    await page.getByRole("slider", { name: "Red slider", exact: true }).count()
  )
    throw Error("Production still shows fabricated thumb");
  await page.getByLabel("Red", { exact: true }).fill("1");
  await page.getByRole("slider", { name: "Red slider", exact: true }).waitFor();
}
