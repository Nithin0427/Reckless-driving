
import { GAME_CONFIG } from '../config/gameConfig';
import { Traffic } from '../entities/Traffic';

export class CollisionManager {

    /**
     * Checks whether the player overlaps any traffic vehicle.
     * Uses vehicle-specific dimensions with forgiving hitboxes.
     */
    public static checkPlayerCollision(
        playerX: number,
        playerY: number,
        trafficVehicles: Traffic[]
    ): boolean {

        // Player collision dimensions
        const playerWidth = GAME_CONFIG.player.width * 0.85;
        const playerHeight = GAME_CONFIG.player.height * 0.85;

        for (const vehicle of trafficVehicles) {

            // Use actual dimensions for each vehicle type.
            const vehicleWidth = vehicle.vehicleWidth * 0.88;
            const vehicleHeight = vehicle.vehicleHeight * 0.90;

            const horizontalDistance = Math.abs(
                playerX - vehicle.x
            );

            const verticalDistance = Math.abs(
                playerY - vehicle.y
            );

            // Axis-aligned bounding box collision.
            const horizontalLimit =
                (playerWidth + vehicleWidth) / 2;

            const verticalLimit =
                (playerHeight + vehicleHeight) / 2;

            const isColliding =
                horizontalDistance < horizontalLimit &&
                verticalDistance < verticalLimit;

            if (isColliding) {
                return true;
            }
        }

        return false;
    }
}
