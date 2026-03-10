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
                    // Map default browser error codes to human readable messages
                    const messages: Record<number, string> = {
                        1: 'Location permission denied.',
                        2: 'Location unavailable.',
                        3: 'Location request timed out.',
                    };
                    
                    const message = messages[error.code] ?? 'Unknown geolocation error.';
                    reject(new Error(message));
                }
            )
        });
    }
}