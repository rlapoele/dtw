import { createCn } from "cn/config";

/** Keep custom typography roles distinct from text colors and font families. */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["caption"] }],
      "font-weight": [{ font: ["heading"] }],
    },
  },
});
