
import Phaser from 'phaser';

export type VehicleType =
    | 'car'
    | 'delivery'
    | 'cargo'
    | 'trailer';

export class Traffic extends Phaser.GameObjects.Graphics {
    public speed: number;
    public vehicleWidth: number;
    public vehicleHeight: number;
    public vehicleType: VehicleType;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        speed: number,
        color: number,
        vehicleType: VehicleType = 'car'
    ) {
        super(scene);

        this.speed = speed;
        this.vehicleType = vehicleType;

        const dimensions: Record<
            VehicleType,
            { width: number; height: number }
        > = {
            car: { width: 38, height: 68 },
            delivery: { width: 44, height: 88 },
            cargo: { width: 48, height: 112 },
            trailer: { width: 52, height: 150 }
        };

        this.vehicleWidth = dimensions[vehicleType].width;
        this.vehicleHeight = dimensions[vehicleType].height;

        scene.add.existing(this);

        this.setPosition(x, y);
        this.setDepth(5);

        this.drawVehicle(color);
    }

    private drawVehicle(color: number): void {
        this.clear();

        const w = this.vehicleWidth;
        const h = this.vehicleHeight;

        if (this.vehicleType === 'car') {
            this.drawCar(w, h, color);
        } else {
            this.drawTruck(w, h, color);
        }
    }

    // =====================================
    // CAR DESIGN
    // =====================================

    private drawCar(
        w: number,
        h: number,
        color: number
    ): void {
        const left = -w / 2;
        const right = w / 2;
        const top = -h / 2;
        const bottom = h / 2;

        // Ground shadow
        this.fillStyle(0x000000, 0.38);
        this.fillRoundedRect(
            left + 3,
            top + 5,
            w,
            h,
            10
        );

        // Wheels
        this.drawCarWheels(w, h);

        // Main body outline
        this.fillStyle(0x111827);
        this.fillRoundedRect(
            left,
            top,
            w,
            h,
            10
        );

        // Main body
        this.fillStyle(color);
        this.fillRoundedRect(
            left + 2,
            top + 2,
            w - 4,
            h - 4,
            9
        );

        // Side body highlights
        this.fillStyle(0xffffff, 0.22);
        this.fillRect(
            left + 4,
            top + 13,
            3,
            h - 26
        );

        this.fillStyle(0x000000, 0.15);
        this.fillRect(
            right - 7,
            top + 13,
            3,
            h - 26
        );

        // Front hood
        this.fillStyle(0xffffff, 0.18);
        this.fillRoundedRect(
            left + 6,
            top + 5,
            w - 12,
            15,
            4
        );

        // Hood center line
        this.lineStyle(1, 0xffffff, 0.25);
        this.lineBetween(
            0,
            top + 7,
            0,
            top + 18
        );

        // Main windshield
        this.fillStyle(0x0b1728);
        this.fillRoundedRect(
            left + 6,
            top + 23,
            w - 12,
            18,
            5
        );

        // Windshield reflection
        this.fillStyle(0x75c8ff, 0.35);
        this.fillRoundedRect(
            left + 9,
            top + 25,
            w - 18,
            4,
            2
        );

        // Front interior dashboard
        this.fillStyle(0x253b50);
        this.fillRect(
            left + 8,
            top + 39,
            w - 16,
            2
        );

        // Rear window
        this.fillStyle(0x102338);
        this.fillRoundedRect(
            left + 7,
            bottom - 23,
            w - 14,
            12,
            4
        );

        // Rear window reflection
        this.fillStyle(0x75c8ff, 0.22);
        this.fillRect(
            left + 10,
            bottom - 21,
            w - 20,
            3
        );

        // Front headlights
        this.fillStyle(0xffffcc);
        this.fillRoundedRect(
            left + 4,
            top + 2,
            8,
            5,
            2
        );

        this.fillRoundedRect(
            right - 12,
            top + 2,
            8,
            5,
            2
        );

        // Rear brake lights
        this.drawRearLights(w, h);

        // Side mirrors
        this.fillStyle(0x172333);
        this.fillRoundedRect(
            left - 2,
            top + 24,
            4,
            8,
            2
        );

        this.fillRoundedRect(
            right - 2,
            top + 24,
            4,
            8,
            2
        );

        // Front bumper
        this.fillStyle(0xffffff, 0.3);
        this.fillRoundedRect(
            left + 7,
            top + 1,
            w - 14,
            2,
            1
        );

        // Rear bumper
        this.fillStyle(0x111827);
        this.fillRoundedRect(
            left + 8,
            bottom - 3,
            w - 16,
            3,
            1
        );
    }

    private drawCarWheels(
        w: number,
        h: number
    ): void {
        const left = -w / 2;
        const right = w / 2;
        const top = -h / 2;

        this.fillStyle(0x090909);

        // Front wheels
        this.fillRoundedRect(
            left - 2,
            top + 12,
            5,
            15,
            2
        );

        this.fillRoundedRect(
            right - 3,
            top + 12,
            5,
            15,
            2
        );

        // Rear wheels
        this.fillRoundedRect(
            left - 2,
            top + h - 27,
            5,
            15,
            2
        );

        this.fillRoundedRect(
            right - 3,
            top + h - 27,
            5,
            15,
            2
        );

        // Wheel highlights
        this.fillStyle(0x64748b);

        this.fillRect(
            left - 1,
            top + 17,
            2,
            5
        );

        this.fillRect(
            right - 2,
            top + 17,
            2,
            5
        );

        this.fillRect(
            left - 1,
            top + h - 22,
            2,
            5
        );

        this.fillRect(
            right - 2,
            top + h - 22,
            2,
            5
        );
    }

    // =====================================
    // TRUCK DESIGN
    // =====================================

    private drawTruck(
        w: number,
        h: number,
        color: number
    ): void {
        const isDelivery = this.vehicleType === 'delivery';
        const isCargo = this.vehicleType === 'cargo';
        const isTrailer = this.vehicleType === 'trailer';

        const cabHeight = isDelivery ? 29 : isCargo ? 31 : 34;

        const left = -w / 2;
        const top = -h / 2;

        const cargoTop = top + cabHeight;

        const cargoHeight = h - cabHeight - 5;

        // Ground shadow
        this.fillStyle(0x000000, 0.4);
        this.fillRoundedRect(
            left + 3,
            top + 5,
            w,
            h,
            5
        );

        // Truck wheels
        this.drawTruckWheels(w, h, isTrailer);

        // Cargo body outline
        this.fillStyle(0x171717);
        this.fillRoundedRect(
            left,
            cargoTop,
            w,
            cargoHeight,
            4
        );

        // Cargo body
        if (isTrailer) {
            this.drawTrailerBody(
                w,
                cargoTop,
                cargoHeight,
                color
            );
        } else if (isDelivery) {
            this.drawDeliveryBody(
                w,
                cargoTop,
                cargoHeight,
                color
            );
        } else {
            this.drawCargoBody(
                w,
                cargoTop,
                cargoHeight,
                color
            );
        }

        // Cabin
        this.drawTruckCabin(
            w,
            cabHeight,
            color,
            isDelivery
        );

        // Rear lights
        this.drawRearLights(w, h);
    }

    // =====================================
    // DELIVERY VAN BODY
    // =====================================

    private drawDeliveryBody(
        w: number,
        y: number,
        h: number,
        color: number
    ): void {
        const left = -w / 2;

        // White delivery box
        this.fillStyle(0xe5e7eb);
        this.fillRoundedRect(
            left + 2,
            y + 2,
            w - 4,
            h - 4,
            3
        );

        // Colored side panel
        this.fillStyle(color);
        this.fillRect(
            left + 4,
            y + 8,
            w - 8,
            h - 16
        );

        // Roof highlights
        this.fillStyle(0xffffff, 0.3);
        this.fillRect(
            left + 6,
            y + 10,
            3,
            h - 20
        );

        // Delivery door
        this.lineStyle(1, 0xffffff, 0.5);
        this.lineBetween(
            0,
            y + 8,
            0,
            y + h - 8
        );

        // Rear door handle
        this.fillStyle(0x222222);
        this.fillRect(
            -2,
            y + h / 2 - 3,
            4,
            6
        );
    }

    // =====================================
    // CARGO TRUCK BODY
    // =====================================

    private drawCargoBody(
        w: number,
        y: number,
        h: number,
        color: number
    ): void {
        const left = -w / 2;

        // Cargo container
        this.fillStyle(color);
        this.fillRoundedRect(
            left + 3,
            y + 3,
            w - 6,
            h - 6,
            3
        );

        // Top highlight
        this.fillStyle(0xffffff, 0.25);
        this.fillRect(
            left + 6,
            y + 6,
            w - 12,
            4
        );

        // Cargo panel lines
        this.lineStyle(1, 0x111827, 0.35);

        for (
            let lineY = y + 17;
            lineY < y + h - 8;
            lineY += 15
        ) {
            this.lineBetween(
                left + 5,
                lineY,
                -left - 5,
                lineY
            );
        }

        // Side reflections
        this.fillStyle(0xffffff, 0.2);
        this.fillRect(
            left + 5,
            y + 10,
            2,
            h - 20
        );
    }

    // =====================================
    // TRAILER BODY
    // =====================================

    private drawTrailerBody(
        w: number,
        y: number,
        h: number,
        color: number
    ): void {
        const left = -w / 2;

        // Main trailer
        this.fillStyle(0xd1d5db);
        this.fillRoundedRect(
            left + 2,
            y + 2,
            w - 4,
            h - 4,
            3
        );

        // Trailer roof/body color
        this.fillStyle(color);
        this.fillRect(
            left + 4,
            y + 4,
            w - 8,
            h - 8
        );

        // Trailer center panel
        this.fillStyle(0xffffff, 0.12);
        this.fillRect(
            left + 7,
            y + 7,
            w - 14,
            h - 14
        );

        // Multiple trailer divisions
        this.lineStyle(1, 0x172333, 0.4);

        for (
            let lineY = y + 15;
            lineY < y + h - 10;
            lineY += 19
        ) {
            this.lineBetween(
                left + 5,
                lineY,
                -left - 5,
                lineY
            );
        }

        // Reflective side strips
        this.fillStyle(0xffffff, 0.5);

        this.fillRect(
            left + 4,
            y + 5,
            2,
            h - 10
        );

        this.fillRect(
            -left - 6,
            y + 5,
            2,
            h - 10
        );

        // Trailer rear marking
        this.fillStyle(0xffcc00);
        this.fillRect(
            left + 6,
            y + h - 7,
            w - 12,
            3
        );
    }

    // =====================================
    // TRUCK CABIN
    // =====================================

    private drawTruckCabin(
        w: number,
        cabHeight: number,
        color: number,
        isDelivery: boolean
    ): void {
        const left = -w / 2;
        const right = w / 2;
        const top = -this.vehicleHeight / 2;

        // Cabin outer border
        this.fillStyle(0x111827);
        this.fillRoundedRect(
            left,
            top,
            w,
            cabHeight + 4,
            5
        );

        // Cabin body
        this.fillStyle(
            isDelivery ? 0xe5e7eb : color
        );

        this.fillRoundedRect(
            left + 3,
            top + 2,
            w - 6,
            cabHeight,
            4
        );

        // Front hood
        this.fillStyle(0xffffff, 0.25);
        this.fillRoundedRect(
            left + 6,
            top + 3,
            w - 12,
            5,
            2
        );

        // Front windshield
        this.fillStyle(0x0b1728);
        this.fillRoundedRect(
            left + 7,
            top + 10,
            w - 14,
            13,
            3
        );

        // Windshield reflection
        this.fillStyle(0x75c8ff, 0.4);
        this.fillRect(
            left + 10,
            top + 12,
            w - 20,
            3
        );

        // Lower windshield border
        this.fillStyle(0x334155);
        this.fillRect(
            left + 8,
            top + 24,
            w - 16,
            2
        );

        // Cabin side mirrors
        this.fillStyle(0x111827);

        this.fillRoundedRect(
            left - 3,
            top + 14,
            4,
            9,
            2
        );

        this.fillRoundedRect(
            right - 1,
            top + 14,
            4,
            9,
            2
        );

        // Headlights
        this.fillStyle(0xffffcc);

        this.fillRoundedRect(
            left + 4,
            top + 2,
            6,
            5,
            2
        );

        this.fillRoundedRect(
            right - 10,
            top + 2,
            6,
            5,
            2
        );

        // Front bumper
        this.fillStyle(0x9ca3af);
        this.fillRect(
            left + 7,
            top + cabHeight - 1,
            w - 14,
            3
        );
    }

    // =====================================
    // TRUCK WHEELS
    // =====================================

    private drawTruckWheels(
        w: number,
        h: number,
        isTrailer: boolean
    ): void {
        const left = -w / 2;
        const right = w / 2;
        const top = -h / 2;

        const wheelWidth = 5;
        const wheelHeight = isTrailer ? 17 : 15;

        const positions: number[] = isTrailer
            ? [top + 43, top + 68, top + 94, top + 119]
            : [top + 9, top + h - 25];

        for (const position of positions) {
            // Left wheel
            this.fillStyle(0x080808);
            this.fillRoundedRect(
                left - 2,
                position,
                wheelWidth,
                wheelHeight,
                2
            );

            // Right wheel
            this.fillRoundedRect(
                right - 3,
                position,
                wheelWidth,
                wheelHeight,
                2
            );

            // Tire highlight
            this.fillStyle(0x64748b);

            this.fillRect(
                left - 1,
                position + 4,
                2,
                6
            );

            this.fillRect(
                right - 2,
                position + 4,
                2,
                6
            );
        }
    }

    // =====================================
    // REAR LIGHTS
    // =====================================

    private drawRearLights(
        w: number,
        h: number
    ): void {
        const left = -w / 2;
        const right = w / 2;
        const bottom = h / 2;

        // Rear light housings
        this.fillStyle(0x450d0d);

        this.fillRoundedRect(
            left + 3,
            bottom - 7,
            9,
            6,
            2
        );

        this.fillRoundedRect(
            right - 12,
            bottom - 7,
            9,
            6,
            2
        );

        // Bright brake lights
        this.fillStyle(0xff2222);

        this.fillRoundedRect(
            left + 4,
            bottom - 6,
            7,
            4,
            1
        );

        this.fillRoundedRect(
            right - 11,
            bottom - 6,
            7,
            4,
            1
        );

        // Rear bumper
        this.fillStyle(0x64748b, 0.7);
        this.fillRect(
            left + 8,
            bottom - 2,
            w - 16,
            2
        );
    }

    // =====================================
    // MOVEMENT
    // =====================================

    update(delta: number): boolean {
        this.y += this.speed * (delta / 1000);

        return this.y > 900;
    }
}
