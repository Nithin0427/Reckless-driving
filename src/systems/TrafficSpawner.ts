
import Phaser from 'phaser';

import { GAME_CONFIG } from '../config/gameConfig';
import { Traffic } from '../entities/Traffic';
import type { VehicleType } from '../entities/Traffic';

export class TrafficSpawner {
    private scene: Phaser.Scene;

    private elapsed = 0;
    private spawnInterval = 1200;
    private lastLane = -1;
    private isDestroyed = false;

    private onSpawn: (traffic: Traffic) => void;

    private carColors: number[] = [
        0xff4545,
        0xffc107,
        0x22c55e,
        0xffffff,
        0xa855f7,
        0xff8c42
    ];

    private truckColors: number[] = [
        0xe6e6e6,
        0xf59e0b,
        0x2563eb,
        0x16a34a,
        0xdc2626
    ];

    constructor(
        scene: Phaser.Scene,
        onSpawn: (traffic: Traffic) => void
    ) {
        this.scene = scene;
        this.onSpawn = onSpawn;
    }

    update(
        delta: number,
        speedMultiplier: number,
        spawnInterval: number,
        level: number = 1
    ): void {
        if (this.isDestroyed) {
            return;
        }

        this.elapsed += delta;
        this.spawnInterval = Math.max(350, spawnInterval);

        if (this.elapsed >= this.spawnInterval) {
            this.elapsed %= this.spawnInterval;

            this.spawnTraffic(speedMultiplier, level);

            // Occasionally spawn a second vehicle at higher levels.
            if (level >= 4) {
                const extraSpawnChance = Math.min(
                    10 + (level - 4) * 5,
                    40
                );

                if (
                    Phaser.Math.Between(1, 100) <= extraSpawnChance
                ) {
                    this.spawnTraffic(speedMultiplier, level);
                }
            }
        }
    }

    private spawnTraffic(
        speedMultiplier: number,
        level: number
    ): boolean {
        if (this.isDestroyed) {
            return false;
        }

        // Increase the allowed traffic count with the level.
        const maxTraffic = Math.min(4 + level, 12);

        if (this.getActiveTrafficCount() >= maxTraffic) {
            return false;
        }

        const { width, road } = GAME_CONFIG;

        const roadWidth = width * road.widthRatio;
        const roadLeft = (width - roadWidth) / 2;
        const laneWidth = roadWidth / GAME_CONFIG.lanes;

        // Create and shuffle lane indexes.
        const lanes: number[] = Array.from(
            { length: GAME_CONFIG.lanes },
            (_, index) => index
        );

        for (let i = lanes.length - 1; i > 0; i--) {
            const j = Phaser.Math.Between(0, i);

            [lanes[i], lanes[j]] = [
                lanes[j],
                lanes[i]
            ];
        }

        // Prefer lanes different from the previous spawn.
        const orderedLanes = [
            ...lanes.filter(lane => lane !== this.lastLane),
            ...lanes.filter(lane => lane === this.lastLane)
        ];

        for (const lane of orderedLanes) {
            const vehicleType = this.chooseVehicleType(level);
            const dimensions = this.getDimensions(vehicleType);

            const x = roadLeft + laneWidth * (lane + 0.5);
            const spawnY = -dimensions.height;

            if (
                !this.isLaneClear(
                    x,
                    spawnY,
                    dimensions.height,
                    laneWidth
                )
            ) {
                continue;
            }

            this.createVehicle(
                x,
                spawnY,
                vehicleType,
                speedMultiplier
            );

            this.lastLane = lane;

            return true;
        }

        // All lanes are currently too close to existing traffic.
        return false;
    }

    private createVehicle(
        x: number,
        y: number,
        type: VehicleType,
        speedMultiplier: number
    ): void {
        let baseSpeed: number;

        switch (type) {
            case 'delivery':
                baseSpeed = Phaser.Math.Between(220, 290);
                break;

            case 'cargo':
                baseSpeed = Phaser.Math.Between(190, 260);
                break;

            case 'trailer':
                baseSpeed = Phaser.Math.Between(170, 235);
                break;

            default:
                baseSpeed = Phaser.Math.Between(260, 340);
        }

        const requestedSpeed = baseSpeed * speedMultiplier;
        const speed = this.getSafeSpeed(x, y, requestedSpeed);

        const colors =
            type === 'car'
                ? this.carColors
                : this.truckColors;

        const color = Phaser.Utils.Array.GetRandom(colors);

        const traffic = new Traffic(
            this.scene,
            x,
            y,
            speed,
            color,
            type
        );

        this.onSpawn(traffic);
    }

    private chooseVehicleType(level: number): VehicleType {
        if (level < 2) {
            return 'car';
        }

        const roll = Phaser.Math.Between(1, 100);

        const deliveryChance = Math.min(
            15 + (level - 2) * 1.5,
            25
        );

        const cargoChance = level >= 3
            ? Math.min(12 + (level - 3) * 1.5, 20)
            : 0;

        const trailerChance = level >= 5
            ? Math.min(5 + (level - 5) * 2, 15)
            : 0;

        if (roll <= trailerChance) {
            return 'trailer';
        }

        if (roll <= trailerChance + cargoChance) {
            return 'cargo';
        }

        if (
            roll <= trailerChance + cargoChance + deliveryChance
        ) {
            return 'delivery';
        }

        return 'car';
    }

    private getDimensions(type: VehicleType): {
        width: number;
        height: number;
    } {
        const dimensions: Record<
            VehicleType,
            { width: number; height: number }
        > = {
            car: { width: 38, height: 68 },
            delivery: { width: 44, height: 88 },
            cargo: { width: 48, height: 112 },
            trailer: { width: 52, height: 150 }
        };

        return dimensions[type];
    }

    private getSafeSpeed(
        x: number,
        y: number,
        requestedSpeed: number
    ): number {
        const { width, road } = GAME_CONFIG;

        const roadWidth = width * road.widthRatio;
        const laneWidth = roadWidth / GAME_CONFIG.lanes;

        const existingTraffic = this.scene.children.list.filter(
            (child): child is Traffic => child instanceof Traffic
        );

        let safeSpeed = requestedSpeed;
        let nearestVehicleY = Infinity;

        for (const vehicle of existingTraffic) {
            const sameLane =
                Math.abs(vehicle.x - x) < laneWidth * 0.4;

            // Only consider vehicles ahead of the new vehicle.
            const isAhead = vehicle.y > y;

            if (!sameLane || !isAhead) {
                continue;
            }

            // Find the nearest vehicle ahead.
            if (vehicle.y < nearestVehicleY) {
                nearestVehicleY = vehicle.y;

                // Never allow the following vehicle to be faster.
                safeSpeed = Math.min(safeSpeed, vehicle.speed);
            }
        }

        return safeSpeed;
    }


    private isLaneClear(
        x: number,
        spawnY: number,
        newVehicleHeight: number,
        laneWidth: number
    ): boolean {
        const existingTraffic = this.scene.children.list.filter(
            (child): child is Traffic => child instanceof Traffic
        );

        for (const vehicle of existingTraffic) {
            const sameLane =
                Math.abs(vehicle.x - x) < laneWidth * 0.4;

            if (!sameLane) {
                continue;
            }

            const verticalDistance = Math.abs(
                vehicle.y - spawnY
            );

            const minimumGap =
                (vehicle.vehicleHeight + newVehicleHeight) / 2 + 75;

            if (verticalDistance < minimumGap) {
                return false;
            }
        }

        return true;
    }

    private getActiveTrafficCount(): number {
        return this.scene.children.list.filter(
            child => child instanceof Traffic
        ).length;
    }

    destroy(): void {
        if (this.isDestroyed) {
            return;
        }

        this.isDestroyed = true;
    }
}
