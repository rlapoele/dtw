async (page) => {
  await page.goto("http://127.0.0.1:4184/");
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors = [],
    requests = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1:4184/")) requests.push(r.url());
  });
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await page
    .getByRole("button", { name: "New token", exact: true })
    .first()
    .click();
  await page.getByLabel("Name", { exact: true }).fill("all spaces");
  await page.getByRole("button", { name: "Create", exact: true }).click();
  for (const [space, labels, values] of [
    ["display-p3", ["Red", "Green", "Blue"], ["0.2", "0.4", "0.6"]],
    ["oklab", ["Lightness", "a", "b"], ["0.6", "0.1", "-0.1"]],
    ["oklch", ["Lightness", "Chroma", "Hue (°)"], ["0.6", "0.1", "390"]],
    [
      "hsl",
      ["Hue (°)", "Saturation (%)", "Lightness (%)"],
      ["390", "50", "40"],
    ],
    ["srgb", ["Red", "Green", "Blue"], ["1.1", "none", "0.4"]],
  ]) {
    await page
      .getByRole("combobox", { name: "View color space", exact: true })
      .selectOption(space);
    for (let i = 0; i < 3; i++)
      await page.getByLabel(labels[i], { exact: true }).fill(values[i]);
    await page
      .getByLabel("Alpha", { exact: true })
      .fill("0.123456789123456789123456789");
    await page.getByRole("button", { name: "Apply changes" }).click();
    await page
      .getByRole("tabpanel", { name: "Authored value" })
      .getByText("Changes applied for this session.", { exact: true })
      .waitFor();
    if (
      space === "hsl" &&
      (await page.getByLabel("Hue (°)", { exact: true }).inputValue()) !== "30"
    )
      throw Error("Hue not normalized by constructor");
  }
  await page.getByLabel("Red", { exact: true }).fill("1.0");
  await page.getByRole("button", { name: "Apply changes" }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "canonical Decimal" })
    .waitFor();
  if ((await page.getByLabel("Red", { exact: true }).inputValue()) !== "1.0")
    throw Error("Invalid raw entry lost");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page
    .getByLabel("Red", { exact: true })
    .fill("0.123456789123456789123456789");
  await page.getByLabel("Green", { exact: true }).fill("0.4");
  await page.getByRole("button", { name: "Apply changes" }).click();
  await page
    .getByRole("combobox", { name: "RGB entry scale", exact: true })
    .selectOption("bytes");
  await page.getByLabel("Green", { exact: true }).fill("-");
  if (await page.getByRole("button", { name: "Apply changes" }).isEnabled())
    throw Error("Incomplete byte entry can apply");
  await page
    .getByRole("combobox", { name: "View color space", exact: true })
    .selectOption("hsl");
  await page
    .getByRole("alert")
    .filter({ hasText: "incomplete byte" })
    .waitFor();
  await page.getByLabel("Green", { exact: true }).fill("127.5");
  await page.getByRole("button", { name: "Apply changes" }).click();
  const raw = await page
    .getByRole("tabpanel", { name: "Authored value" })
    .locator(".applied-summary")
    .first()
    .innerText();
  if (!raw.includes("0.123456789123456789123456789") || !raw.includes("0.5"))
    throw Error("Byte edit changed untouched source or arithmetic");
  await page.screenshot({
    path: "output/playwright/increment-004-refactor/final-07-production-bytes.png",
  });
  if (errors.length || requests.length)
    throw Error(JSON.stringify({ errors, requests }));
}
