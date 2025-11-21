import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type BusStation = z.infer<typeof BusStationSchema>;
export const BusStationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  province_id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  type: z.string(),
});
export const GetBusStationSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
export const CreateBusStationSchema = z.object({
  body: z.object({
    name: commonValidations.name,
    address: commonValidations.address,
    province_id: commonValidations.id,
    latitude: commonValidations.position,
    longitude: commonValidations.position,
    type: z.string(),
  }),
});

export const CreateBusStationResponseSchema = z.object({
  id: z.string(),
});

export const UpdateBusStationSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
  body: z.object({
    name: commonValidations.name.optional(),
    address: commonValidations.address.optional(),
    province_id: commonValidations.id.optional(),
    latitude: commonValidations.position.optional(),
    longitude: commonValidations.position.optional(),
    type: z.string().optional(),
  }),
});
export const UpdateBusStationResponseSchema = z.object({
  id: z.string(),
});
export const GetBusStationResponseSchema = BusStationSchema;
export const GetAllBusStationsResponseSchema = z.array(BusStationSchema);
