import type { BusStation } from "@/api/bus_station/bus_station.model";
import db from "@/configs/knex";

export class BusStationRepository {
	async getAllBusStations(): Promise<BusStation[]> {
		const result = await db("bus_stations").select("*");
		return result;
	}

    async getBusStationById(id: string): Promise<BusStation | null> {
        const result = await db("bus_stations").where({ id }).first();
        return result;
    }

    async getBusStationByName(name: string): Promise<BusStation | null> {
        const result = await db("bus_stations").where({ name }).first();
        return result;
    }
    
    async createBusStation(id: string,
      name: string,
      address: string,
      province_id: string,
      latitude: number,
      longitude: number,
      type: string): Promise<number> {
        const [newBusStation] = await db("bus_stations").insert({id, name, address, province_id, latitude, longitude, type});
        return newBusStation;
    }

    async updateBusStation(  
      id: string,
      name: string,
      address: string,
      province_id: string,
      latitude: number,
      longitude: number,
      type: string):Promise<string>{
        await db("bus_stations").where({ id }).update({name, address, province_id, latitude, longitude, type});
        return id;
    }

    async deleteBusStation(id: string): Promise<void> {
        await db("bus_stations").where({ id }).del();
    }
}
