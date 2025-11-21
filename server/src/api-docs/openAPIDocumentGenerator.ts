import {
	OpenAPIRegistry,
	OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter";
import { userRegistry } from "@/api/user/user.routes";
import { authRegistry } from "@/api/auth/auth.routes";
import { busStationRegistry } from "@/api/bus_station/bus_station.routes";
import { provinceRegistry } from "@/api/province/province.routes";
import { busOperatorRegistry } from "@/api/bus_operator/bus_operator.routes";
import { busRegistry } from "@/api/bus/bus.routes";
import { routeRegistry } from "@/api/route/route.routes";
import { routeStopRegistry } from "@/api/route_stop/route_stop.routes";
import { paymentRegistry } from "@/api/payment/payment.routes";
import { bookingRegistry } from "@/api/booking/booking.routes";
import { seatRegistry } from "@/api/seat/seat.routes";
import { tripRegistry } from "@/api/trip/trip.routes";

export type OpenAPIDocument = ReturnType<
	OpenApiGeneratorV3["generateDocument"]
>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry([
		healthCheckRegistry,
		authRegistry,
		userRegistry,
		busStationRegistry,
		provinceRegistry,
		busOperatorRegistry,
		busRegistry,
		routeRegistry,
		routeStopRegistry,
		paymentRegistry,
		bookingRegistry,
		seatRegistry,
		tripRegistry,
	]);
	registry.registerComponent("securitySchemes", "bearerAuth", {
		type: "http",
		scheme: "bearer",
		bearerFormat: "JWT",
		description: "Enter your JWT token in the format: Bearer <token>",
	});
	const generator = new OpenApiGeneratorV3(registry.definitions);
	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Bus Ticket Booking API",
		},
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	});
}
