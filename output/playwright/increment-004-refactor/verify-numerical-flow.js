async (page) => {
  await page.goto("http://127.0.0.1:5173/");
  const result = await page.evaluate(async () => {
    const C = await import("/src/domain/color-calculation.ts");
    const refs = await fetch("/test/domain/color-reference-fixtures.json").then(
      (r) => r.json(),
    );
    let count = 0;
    for (const f of refs) {
      const sourceNeutral =
        f.space === "srgb" || f.space === "display-p3"
          ? f.input[0] === f.input[1] && f.input[1] === f.input[2]
          : f.space === "hsl"
            ? f.input[1] === "0" || f.input[2] === "0" || f.input[2] === "100"
            : f.space === "oklab"
              ? f.input[1] === "0" && f.input[2] === "0"
              : f.input[1] === "0";
      const targetInvalid =
        f.target === "hsl" &&
        !sourceNeutral &&
        f.expected.slice(1).some((x) => Number(x) < 0 || Number(x) > 100);
      const tiny =
        f.space === "srgb" &&
        f.input[0] === "0.000000000000001" &&
        f.input[1] === "0" &&
        f.input[2] === "0" &&
        f.target === "hsl";
      const r = C.convertColor(
        {
          colorSpace: f.space,
          components: f.input,
          alpha: "0.123456789123456789",
        },
        f.target,
      );
      if (targetInvalid || tiny) {
        if (
          r.ok ||
          r.reason !==
            (tiny ? "numerical-failure" : "target-schema-incompatibility")
        )
          throw Error("Wrong refusal " + f.id);
      } else {
        if (!r.ok) throw Error("Unexpected failure " + f.id);
        const raw = C.rawColorCoordinates(r.value, "srgb");
        if (
          !raw.ok ||
          raw.components.some(
            (x, i) =>
              !Number.isFinite(Number(x)) ||
              Math.abs(Number(x) - Number(f.expectedSrgb[i])) >= 1e-8,
          )
        )
          throw Error("Accuracy " + f.id);
      }
      count++;
    }
    if (
      C.byteToNormalized("0.000000000001") !==
      "0.00000000000000392156862745098039"
    )
      throw Error("Browser exact byte arithmetic");
    return count;
  });
  if (result !== 180) throw Error("Incomplete browser corpus");
}
