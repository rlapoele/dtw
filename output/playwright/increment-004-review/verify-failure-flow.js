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
  await page.getByLabel("Red", { exact: true }).fill("0.8");
  const before = await page.evaluate(() =>
    JSON.stringify(window.dtwFixture.snapshot()),
  );
  await page.evaluate(() => window.dtwFixture.failCommit(true));
  await page.getByRole("button", { name: "Apply changes" }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Storage commit failed" })
    .waitFor();
  if ((await page.getByLabel("Red", { exact: true }).inputValue()) !== "0.8")
    throw Error("Commit failure lost draft");
  if (
    (await page.evaluate(() =>
      JSON.stringify(window.dtwFixture.snapshot()),
    )) !== before
  )
    throw Error("Failed commit changed stored data");
  await page.evaluate(() => window.dtwFixture.failRead(true));
  await page
    .getByRole("heading", { name: "Could not read the project" })
    .waitFor();
  if (
    await page
      .getByRole("button", { name: "New token", exact: true })
      .first()
      .isEnabled()
  )
    throw Error("Mutation available during failed read");
  await page.evaluate(() => window.dtwFixture.failRead(false));
  if ((await page.getByLabel("Red", { exact: true }).inputValue()) !== "0.8")
    throw Error("Read recovery lost draft");
  await page.evaluate(() => window.dtwFixture.failCommit(false));
  await page.getByRole("button", { name: "Apply changes" }).click();
  const stored = await page.evaluate(() => window.dtwFixture.snapshot());
  const protectedToken = stored.value.tokens.find(
    (t) => t.id === "protected-color",
  );
  if (
    protectedToken.authoring.regeneration !== "protected" ||
    protectedToken.description !== "Retained authored description" ||
    protectedToken.semanticRole !== "content.primary" ||
    protectedToken.definition.assignments[0].value.components[0] !== "0.8"
  )
    throw Error("Metadata/protection preservation failed");
  await page
    .getByRole("button", { name: "New token", exact: true })
    .first()
    .click();
  await page.getByLabel("Name", { exact: true }).fill("retained-create");
  await page.evaluate(() => window.dtwFixture.failCommit(true));
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Create token failed" })
    .waitFor();
  if (
    (await page.getByLabel("Name", { exact: true }).inputValue()) !==
    "retained-create"
  )
    throw Error("Creation failure lost fields");
  await page.evaluate(() => window.dtwFixture.failRead(true));
  await page
    .getByText(
      "Project unavailable. Inputs retained; Retry reading the project to resume.",
      { exact: true },
    )
    .waitFor();
  if (
    await page.getByRole("button", { name: "Create", exact: true }).isEnabled()
  )
    throw Error("Open creation form allowed failed-read mutation");
  await page.screenshot({
    path: "output/playwright/increment-004-review/final-04-read-failure-modal.png",
  });
  await page.evaluate(() => window.dtwFixture.failRead(false));
  await page.evaluate(() => window.dtwFixture.failCommit(false));
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await page
    .getByRole("button")
    .filter({
      has: page.locator(".token-identity strong", { hasText: "number" }),
    })
    .click();
  await page
    .getByText("Inspection only: this token is outside", { exact: false })
    .waitFor();
  if (await page.getByRole("button", { name: "Apply changes" }).count())
    throw Error("Ineligible token offers revision");
  await page.goto(
    "http://127.0.0.1:5173/test/browser/fixture.html?broken=true",
  );
  await page
    .getByRole("button")
    .filter({
      has: page.locator(".token-identity strong", { hasText: "broken-a" }),
    })
    .click();
  await page
    .getByRole("combobox", { name: "Target token", exact: true })
    .selectOption("protected-color");
  const brokenBefore = await page.evaluate(() =>
    JSON.stringify(window.dtwFixture.snapshot()),
  );
  await page.getByRole("button", { name: "Apply changes" }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "missing-reference" })
    .waitFor();
  if (
    (await page.evaluate(() =>
      JSON.stringify(window.dtwFixture.snapshot()),
    )) !== brokenBefore
  )
    throw Error("Blocked repair changed data");
  await page.screenshot({
    path: "output/playwright/increment-004-review/final-05-blocked-repair.png",
  });
}
