import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);
export type BusStation = z.infer<typeof BusStationSchema>;
export const BusStationSchema = z.object({
  id: z.string(),
  operator_id: z.string(),
  user_id: z.string()
});
