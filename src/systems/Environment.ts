
import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/gameConfig';

export class Environment {
    private graphics: Phaser.GameObjects.Graphics;
    private offset = 0;

    private readonly treeSpacing = 150;
    private readonly lightSpacing = 300;

    private nightIntensity = 0;

    constructor(scene: Phaser.Scene) {
        this.graphics = scene.add.graphics();
        this.graphics.setDepth(1);

        this.draw();
    }

    update(scrollDelta: number, distance: number = 0): void {
        this.offset =
            (this.offset + scrollDelta) % this.treeSpacing;

        this.nightIntensity = this.calculateNightIntensity(distance);
        this.draw();
    }

    public getNightIntensity(): number {
        return this.nightIntensity;
    }

    // =====================================
    // DAY / NIGHT TRANSITION
    // =====================================

    private calculateNightIntensity(distance: number): number {
        const boundary = Math.round(distance / 1000) * 1000;

        // Gradual transition within 50 metres of each boundary.
        if (
            boundary > 0 &&
            Math.abs(distance - boundary) <= 50
        ) {
            const boundaryIndex = boundary / 1000;

            const previousTheme = (boundaryIndex - 1) % 2;
            const nextTheme = boundaryIndex % 2;

            const progress = Phaser.Math.Clamp(
                (distance - (boundary - 50)) / 100,
                0,
                1
            );

            // Smoothstep interpolation
            const smoothProgress =
                progress * progress * (3 - 2 * progress);

            return Phaser.Math.Linear(
                previousTheme,
                nextTheme,
                smoothProgress
            );
        }

        return Math.floor(distance / 1000) % 2;
    }

    private mixColor(
        dayColor: number,
        nightColor: number
    ): number {
        const t = this.nightIntensity;

        const dayR = (dayColor >> 16) & 255;
        const dayG = (dayColor >> 8) & 255;
        const dayB = dayColor & 255;

        const nightR = (nightColor >> 16) & 255;
        const nightG = (nightColor >> 8) & 255;
        const nightB = nightColor & 255;

        const r = Math.round(Phaser.Math.Linear(dayR, nightR, t));
        const g = Math.round(Phaser.Math.Linear(dayG, nightG, t));
        const b = Math.round(Phaser.Math.Linear(dayB, nightB, t));

        return (r << 16) | (g << 8) | b;
    }

    // =====================================
    // ENVIRONMENT RENDERING
    // =====================================

    private draw(): void {
        const { width, height, road } = GAME_CONFIG;

        const roadWidth = width * road.widthRatio;
        const roadLeft = (width - roadWidth) / 2;
        const roadRight = roadLeft + roadWidth;

        this.graphics.clear();

        // Grass verges
        this.graphics.fillStyle(
            this.mixColor(0x315b38, 0x101c25),
            1
        );

        this.graphics.fillRect(
            0,
            0,
            roadLeft - 4,
            height
        );

        this.graphics.fillRect(
            roadRight + 4,
            0,
            width - roadRight - 4,
            height
        );

        // Edge strips
        this.graphics.fillStyle(
            this.mixColor(0x3e7045, 0x1c3540),
            0.9
        );

        this.graphics.fillRect(0, 0, 5, height);
        this.graphics.fillRect(width - 5, 0, 5, height);

        // Tree and bush positions
        const leftX = roadLeft / 2;
        const rightX = roadRight + (width - roadRight) / 2;

        const objectCount =
            Math.ceil(height / this.treeSpacing) + 2;

        for (let i = 0; i < objectCount; i++) {
            const baseY =
                (
                    i * this.treeSpacing +
                    this.offset
                ) % (height + this.treeSpacing) -
                this.treeSpacing / 2;

            const rightY =
                (
                    baseY + this.treeSpacing / 2
                ) % (height + this.treeSpacing);

            if (i % 2 === 0) {
                this.drawTree(leftX, baseY);
                this.drawBush(rightX, rightY);
            } else {
                this.drawBush(leftX, baseY);
                this.drawTree(rightX, rightY);
            }
        }

        // Streetlights only appear at night
        if (this.nightIntensity > 0.01) {
            this.drawStreetlights(
                roadLeft,
                roadRight,
                height
            );
        }
    }

    // =====================================
    // TREES
    // =====================================

    private drawTree(x: number, y: number): void {
        const g = this.graphics;

        g.fillStyle(0x101810, 0.35);
        g.fillEllipse(x + 2, y + 5, 25, 12);

        g.fillStyle(
            this.mixColor(0x79502f, 0x493d38),
            1
        );
        g.fillRect(x - 2, y - 1, 4, 12);

        g.fillStyle(
            this.mixColor(0x14532d, 0x102c2c),
            1
        );
        g.fillCircle(x, y - 7, 11);

        g.fillStyle(
            this.mixColor(0x1f7a3a, 0x174538),
            1
        );
        g.fillCircle(x - 4, y - 10, 7);

        g.fillStyle(
            this.mixColor(0x269447, 0x1b5543),
            1
        );
        g.fillCircle(x + 4, y - 12, 6);
    }

    // =====================================
    // BUSHES
    // =====================================

    private drawBush(x: number, y: number): void {
        const g = this.graphics;

        g.fillStyle(0x101810, 0.3);
        g.fillEllipse(x + 2, y + 3, 22, 10);

        g.fillStyle(
            this.mixColor(0x14532d, 0x102c2c),
            1
        );
        g.fillCircle(x, y, 8);

        g.fillStyle(
            this.mixColor(0x1f7a3a, 0x174538),
            1
        );
        g.fillCircle(x - 4, y - 2, 5);

        g.fillStyle(
            this.mixColor(0x269447, 0x1b5543),
            1
        );
        g.fillCircle(x + 4, y - 3, 5);
    }

    // =====================================
    // STREETLIGHTS
    // =====================================

    private drawStreetlights(
        roadLeft: number,
        roadRight: number,
        height: number
    ): void {
        const leftX = roadLeft - 8;
        const rightX = roadRight + 8;

        const count =
            Math.ceil(height / this.lightSpacing) + 2;

        for (let i = 0; i < count; i++) {
            const y =
                (
                    i * this.lightSpacing +
                    this.offset * (this.lightSpacing / this.treeSpacing)
                ) % (height + this.lightSpacing) -
                this.lightSpacing / 2;

            this.drawStreetlight(leftX, y);
            this.drawStreetlight(rightX, y + 150);
        }
    }

    private drawStreetlight(x: number, y: number): void {
        const g = this.graphics;
        const intensity = this.nightIntensity;

        // Warm light glow
        g.fillStyle(0xffd76a, 0.10 * intensity);
        g.fillCircle(x, y - 12, 17);

        g.fillStyle(0xffd76a, 0.16 * intensity);
        g.fillCircle(x, y - 12, 10);

        // Pole
        g.fillStyle(0x64748b, 0.9);
        g.fillRect(x - 1, y - 12, 2, 28);

        // Lamp arm
        g.fillRect(x - 5, y - 15, 6, 2);

        // Lamp housing
        g.fillStyle(0x334155, 1);
        g.fillRoundedRect(
            x - 8,
            y - 18,
            8,
            5,
            2
        );

        // Illuminated bulb
        g.fillStyle(0xffe7a3, intensity);
        g.fillRoundedRect(
            x - 7,
            y - 17,
            6,
            3,
            1
        );
    }

    // =====================================
    // CLEANUP
    // =====================================

    destroy(): void {
        this.graphics.destroy();
    }
}
