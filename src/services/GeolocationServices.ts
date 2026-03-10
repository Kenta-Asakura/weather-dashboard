import { Coordinates } from "../types/location.types";

export class GeolocationService {
    getCurrentPosition(): Promise<Coordinates> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'))
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log('Geolocation error:', error);
                }
            )
        });
    }
}