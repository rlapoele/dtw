import { createCn } from "cn/engine";
import tables from "@presentation/lib/cn-tables.generated";

/** The build compiles our CSS theme; browser code only consumes merge tables. */
export const cn = createCn(tables);
