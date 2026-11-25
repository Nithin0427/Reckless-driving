
import Phaser from 'phaser';

import { GAME_CONFIG } from '../config/gameConfig';
import { Traffic } from '../entities/Traffic';

import { TrafficSpawner } from '../systems/TrafficSpawner';
import { CollisionManager } from '../systems/CollisionManager';
import { ScoreManager } from '../systems/ScoreManager';
import { Environment } from '../systems/Environment';

export class GameScene extends Phaser.Scene {

    // =====================================
    // GAME PROPERTIES
    // =====================================

    private road!: Phaser.GameObjects.Graphics;

    private environment!: Environment;

    private player!: Phaser.GameObjects.Graphics;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private playerX = 240;

    private targetX = 240;

    private roadOffset = 0;

    private traffic: Traffic[] = [];

    private trafficSpawner!: TrafficSpawner;

    private scoreManager!: ScoreManager;

    private isGameOver = false;
    private isPaused = false;

    private pauseOverlay?: Phaser.GameObjects.Container;

    private pauseButton!: Phaser.GameObjects.Container;

    constructor() {
        super('GameScene');
    }

    // =====================================
    // CREATE
    // =====================================

    create(): void {

        const { width, height } = GAME_CONFIG;

        // Activate gameplay layout
        document.body.classList.remove('menu-screen');
        document.body.classList.add('game-screen');

        this.playerX = width / 2;
        this.targetX = width / 2;

        this.isGameOver = false;
        this.isPaused = false;
        this.pauseOverlay = undefined;

        this.traffic = [];
        this.roadOffset = 0;

        // Initialize score manager
        this.scoreManager = new ScoreManager();

        // Reset HUD
        this.updateHUD();

        // Create road
        this.road = this.add.graphics();
        this.road.setDepth(0);

        // Keyboard controls
        this.cursors = this.input.keyboard!.createCursorKeys();

        // Create player
        this.player = this.add.graphics();
        this.player.setDepth(10);

        this.drawPlayer();

        this.player.setPosition(
            this.playerX,
            height - 115
        );

        // Mouse controls
        this.input.on(
            'pointerdown',
            (pointer: Phaser.Input.Pointer) => {

                if (!this.isGameOver && !this.isPaused) {
                    this.targetX = pointer.x;
                }

            }
        );

        this.input.on(
            'pointermove',
            (pointer: Phaser.Input.Pointer) => {

                if (pointer.isDown && !this.isGameOver && !this.isPaused) {
                    this.targetX = pointer.x;
                }

            }
        );

        

        this.createPauseButton();

        // Initialize roadside environment
        this.environment = new Environment(this);
        // Initial highway
        this.drawRoad();
        // Start traffic generation
        this.trafficSpawner = new TrafficSpawner(
            this,
            (vehicle: Traffic) => {

                if (!this.isGameOver) {
                    this.traffic.push(vehicle);
                } else {
                    vehicle.destroy();
                }

            }
        );

        // Restart using R key
        this.input.keyboard!.on(
            'keydown-R',
            this.restartGame,
            this
        );


        this.input.keyboard!.on('keydown-ESC', () => {
            if (this.isPaused) {
                this.resumeGame();
            } else {
                this.pauseGame();
            }
        });

        this.input.keyboard!.on('keydown-P', () => {
            if (this.isPaused) {
                this.resumeGame();
            } else {
                this.pauseGame();
            }
        });

        // Clean up when scene shuts down
        this.events.once('shutdown', () => {

            this.trafficSpawner.destroy();

            this.environment.destroy();

            this.input.keyboard?.off(
                'keydown-R',
                this.restartGame,
                this
            );
            this.input.keyboard?.off('keydown-ESC');
            this.input.keyboard?.off('keydown-P');

        });

    }



        private createPauseButton(): void {
            const { width } = GAME_CONFIG;

            this.pauseButton = this.add.container(
                width - 28,
                28
            );

            this.pauseButton.setDepth(50);

            const background = this.add.circle(
                0,
                0,
                17,
                0x10141c,
                0.9
            );

            background.setStrokeStyle(1, 0x64748b);

            const icon = this.add.text(
                0,
                0,
                'Ⅱ',
                {
                    fontSize: '19px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5);

            const hitArea = this.add.rectangle(
                0,
                0,
                40,
                40,
                0xffffff,
                0
            );

            hitArea.setInteractive({
                useHandCursor: true
            });

            hitArea.on('pointerdown', () => {
                this.pauseGame();
            });

            this.pauseButton.add([
                background,
                icon,
                hitArea
            ]);
        }

        private pauseGame(): void {
            if (this.isGameOver || this.isPaused) {
                return;
            }

            this.isPaused = true;

            const { width, height } = GAME_CONFIG;

            this.pauseOverlay = this.add.container(
                width / 2,
                height / 2
            );

            this.pauseOverlay.setDepth(100);

            const background = this.add.rectangle(
                0,
                0,
                300,
                300,
                0x10141c,
                0.97
            );

            background.setStrokeStyle(2, 0x2589ff);

            const heading = this.add.text(
                0,
                -65,
                'PAUSED',
                {
                    fontSize: '32px',
                    fontStyle: 'bold',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);

            const resumeButton = this.add.rectangle(
                0,
                5,
                180,
                45,
                0x2589ff
            ).setInteractive({
                useHandCursor: true
            });

            const resumeText = this.add.text(
                0,
                5,
                'RESUME',
                {
                    fontSize: '16px',
                    fontStyle: 'bold',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);

            resumeButton.on('pointerdown', () => {
                this.resumeGame();
            });

            const restartButton = this.add.rectangle(
                0,
                65,
                180,
                40,
                0x334155
            ).setInteractive({
                useHandCursor: true
            });

            const restartText = this.add.text(
                0,
                65,
                'RESTART',
                {
                    fontSize: '15px',
                    fontStyle: 'bold',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);

            restartButton.on('pointerdown', () => {
                this.scene.restart();
            });

            // Main Menu button
            const menuButton = this.add.rectangle(
                0,
                115,
                180,
                40,
                0x475569
            ).setInteractive({
                useHandCursor: true
            });

            const menuText = this.add.text(
                0,
                115,
                'MAIN MENU',
                {
                    fontSize: '15px',
                    fontStyle: 'bold',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);

            menuButton.on('pointerover', () => {
                menuButton.setFillStyle(0x64748b);
            });

            menuButton.on('pointerout', () => {
                menuButton.setFillStyle(0x475569);
            });

            menuButton.on('pointerdown', () => {
                this.scene.start('MenuScene');
            });

            this.pauseOverlay.add([
                background,
                heading,
                resumeButton,
                resumeText,
                restartButton,
                restartText,
                menuButton,
                menuText
            ]);
        }

        private resumeGame(): void {
            if (!this.isPaused) {
                return;
            }

            this.isPaused = false;

            this.pauseOverlay?.destroy();
            this.pauseOverlay = undefined;
        }

    

    private blendColor(dayColor: number, nightColor: number): number {
        const intensity = this.environment.getNightIntensity();

        const dayR = (dayColor >> 16) & 255;
        const dayG = (dayColor >> 8) & 255;
        const dayB = dayColor & 255;

        const nightR = (nightColor >> 16) & 255;
        const nightG = (nightColor >> 8) & 255;
        const nightB = nightColor & 255;

        const r = Math.round(Phaser.Math.Linear(dayR, nightR, intensity));
        const g = Math.round(Phaser.Math.Linear(dayG, nightG, intensity));
        const b = Math.round(Phaser.Math.Linear(dayB, nightB, intensity));

        return (r << 16) | (g << 8) | b;
    }

    // =====================================
    // HIGHWAY RENDERING
    // =====================================
    private drawRoad(): void {
        const { width, height, road } = GAME_CONFIG;

        const roadWidth = width * road.widthRatio;
        const left = (width - roadWidth) / 2;
        const laneWidth = roadWidth / GAME_CONFIG.lanes;

        this.road.clear();

        // Background
        this.road.fillStyle(
            this.blendColor(0x202833, 0x080e18)
        );

        this.road.fillRect(0, 0, width, height);

        // Highway surface
        this.road.fillStyle(
            this.blendColor(road.background, 0x252d3a)
        );

        this.road.fillRect(left, 0, roadWidth, height);

        // Road boundaries
        this.road.fillStyle(
            this.blendColor(road.boundary, 0xffc857)
        );

        this.road.fillRect(left, 0, 4, height);

        this.road.fillRect(
            left + roadWidth - 4,
            0,
            4,
            height
        );

        // Lane markings
        this.road.fillStyle(
            this.blendColor(road.laneLine, 0xdbeafe)
        );

        for (let i = 1; i < GAME_CONFIG.lanes; i++) {
            const x = left + laneWidth * i;

            for (
                let y = this.roadOffset - 60;
                y < height;
                y += 60
            ) {
                this.road.fillRect(
                    x - 1.5,
                    y,
                    3,
                    30
                );
            }
        }
    }

    // =====================================
    // SCORE HUD
    // =====================================

    private updateHUD(): void {

        const scoreElement =
            document.getElementById('score');

        const distanceElement =
            document.getElementById('distance');

        const levelElement =
            document.getElementById('level');

        const levelRemainingElement =
            document.getElementById('levelRemaining');
        const bestElement =
            document.getElementById('bestScore');
        const levelProgressElement =
            document.getElementById('levelProgress');

        // Update level progression
        const distance = this.scoreManager.getDistance();

        const progress = (distance % 500) / 500 * 100;
        const remaining = 500 - (distance % 500);

        // Update progress bar
        if (levelProgressElement) {
            levelProgressElement.style.width = `${progress}%`;
        }

        // Update remaining distance
        if (levelRemainingElement) {
            levelRemainingElement.textContent =
                `${remaining} m to next level`;
        }

        if (scoreElement) {

            scoreElement.textContent =
                String(this.scoreManager.getScore()).padStart(6, '0');

        }

        if (distanceElement) {

            distanceElement.textContent =
                `${this.scoreManager.getDistance()} m`;

        }

        if (levelElement) {

            levelElement.textContent =
                String(this.scoreManager.getDifficulty().level);

        }

        if (bestElement) {

            bestElement.textContent =
                String(this.scoreManager.getBestScore()).padStart(6, '0');

        }

    }

    // =====================================
    // PLAYER CAR
    // =====================================

    private drawPlayer(): void {

        const { width, height, color } = GAME_CONFIG.player;

        this.player.clear();

        // Shadow
        this.player.fillStyle(0x000000, 0.35);

        this.player.fillRoundedRect(
            -width / 2 + 3,
            -height / 2 + 5,
            width,
            height,
            10
        );

        // Main body
        this.player.fillStyle(color);

        this.player.fillRoundedRect(
            -width / 2,
            -height / 2,
            width,
            height,
            10
        );

        // Front section
        this.player.fillStyle(0x55b1ff);

        this.player.fillRoundedRect(
            -width / 2 + 5,
            -height / 2 + 5,
            width - 10,
            18,
            5
        );

        // Windshield
        this.player.fillStyle(0x152b43);

        this.player.fillRoundedRect(
            -width / 2 + 6,
            -height / 2 + 25,
            width - 12,
            20,
            5
        );

        // Rear window
        this.player.fillRoundedRect(
            -width / 2 + 6,
            height / 2 - 25,
            width - 12,
            13,
            4
        );

        // Headlights
        this.player.fillStyle(0xffffff);

        this.player.fillRect(
            -width / 2 + 4,
            -height / 2 + 2,
            8,
            4
        );

        this.player.fillRect(
            width / 2 - 12,
            -height / 2 + 2,
            8,
            4
        );

        // Rear lights
        this.player.fillStyle(0xff4545);

        this.player.fillRect(
            -width / 2 + 4,
            height / 2 - 5,
            8,
            4
        );

        this.player.fillRect(
            width / 2 - 12,
            height / 2 - 5,
            8,
            4
        );

    }

    // =====================================
    // GAME OVER SCREEN
    // =====================================

    private showGameOver(): void {

        this.isGameOver = true;

        // Crash screen shake effect
        this.cameras.main.shake(250, 0.015);
        // Red crash flash effect
        this.cameras.main.flash(200, 255, 40, 40, false);
        // Crash particle effect
        this.createCrashParticles();
        // Stop traffic generation
        this.trafficSpawner.destroy();

        // Save best score
        this.scoreManager.saveBestScore();

        // Update final HUD
        this.updateHUD();

        // Freeze traffic
        this.traffic.forEach(vehicle => {
            vehicle.speed = 0;
        });

        // Freeze player visually
        this.player.setAlpha(0.65);

        const { width, height } = GAME_CONFIG;

        const overlay = this.add.container(
            width / 2,
            height / 2
        );

        overlay.setDepth(100);

        // Background panel
        const background = this.add.rectangle(
            0,
            0,
            370,
            370,
            0x10141c,
            0.97
        );

        background.setStrokeStyle(
            2,
            0xff4545
        );

        // Heading
        const heading = this.add.text(
            0,
            -115,
            'GAME OVER',
            {
                fontSize: '34px',
                fontStyle: 'bold',
                color: '#ff4545',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        // Final statistics
        const summary = this.add.text(
            0,
            -25,
            `FINAL SCORE: ${this.scoreManager.getScore()}\n` +
            `DISTANCE: ${this.scoreManager.getDistance()} m\n` +
            `BEST SCORE: ${this.scoreManager.getBestScore()}\n` +
            `LEVEL REACHED: ${this.scoreManager.getDifficulty().level}`,
            {
                fontSize: '15px',
                color: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                lineSpacing: 10
            }
        ).setOrigin(0.5);

        // Restart button
        const button = this.add.rectangle(
            0,
            95,
            190,
            48,
            0x2589ff
        );

        button.setInteractive({
            useHandCursor: true
        });

        button.on('pointerover', () => {
            button.setFillStyle(0x0868dc);
        });

        button.on('pointerout', () => {
            button.setFillStyle(0x2589ff);
        });

        button.on('pointerdown', () => {
            this.scene.restart();
        });

       // Main Menu button
        const menuButton = this.add.rectangle(
            0,
            155,
            190,
            42,
            0x475569
        ).setInteractive({
            useHandCursor: true
        });

        const menuText = this.add.text(
            0,
            155,
            'MAIN MENU',
            {
                fontSize: '15px',
                fontStyle: 'bold',
                color: '#ffffff',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);
        const buttonText = this.add.text(
            0,
            95,
            'RESTART GAME',
            {
                fontSize: '15px',
                fontStyle: 'bold',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        menuButton.on('pointerover', () => {
            menuButton.setFillStyle(0x64748b);
        });

        menuButton.on('pointerout', () => {
            menuButton.setFillStyle(0x475569);
        });

        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        overlay.add([
        background,
        heading,
        summary,
        button,
        buttonText,
        menuButton,
        menuText
    ]);

        // Entrance animation
        overlay.setScale(0.8);

        this.tweens.add({
            targets: overlay,
            scale: 1,
            duration: 250,
            ease: 'Back.Out'
        });

    }

    // =====================================
    // CRASH PARTICLE EFFECT
    // =====================================

    private createCrashParticles(): void {
        const particleCount = 18;

        const colors = [
            0xff4545, // Red
            0xff8c42, // Orange
            0xffd166, // Yellow
            0xffffff  // White
        ];

        for (let i = 0; i < particleCount; i++) {

            const angle = Phaser.Math.DegToRad(
                Phaser.Math.Between(0, 359)
            );

            const distance = Phaser.Math.Between(35, 95);

            const particle = this.add.circle(
                this.player.x,
                this.player.y,
                Phaser.Math.Between(2, 5),
                Phaser.Utils.Array.GetRandom(colors),
                1
            );

            particle.setDepth(110);

            this.tweens.add({
                targets: particle,

                x: this.player.x + Math.cos(angle) * distance,
                y: this.player.y + Math.sin(angle) * distance,

                alpha: 0,
                scale: 0.1,

                duration: Phaser.Math.Between(350, 600),

                ease: 'Cubic.Out',

                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }


    // =====================================
    // RESTART
    // =====================================

    private restartGame(): void {
        if (this.isGameOver || this.isPaused) {
            this.scene.restart();
        }
    }

    // =====================================
    // MAIN GAME LOOP
    // =====================================

    update(_time: number, delta: number): void {

        if (this.isGameOver || this.isPaused) {
            return;
        }

        const dt = Math.min(delta / 1000, 0.05);

        const { width, height, road, player } = GAME_CONFIG;

        // =====================================
        // 1. UPDATE SCORE
        // =====================================

        this.scoreManager.update(delta);

        const difficulty =
            this.scoreManager.getDifficulty();

        this.updateHUD();

        // =====================================
        // 2. PLAYER MOVEMENT
        // =====================================

        const roadWidth = width * road.widthRatio;

        const left = (width - roadWidth) / 2;

        const right = left + roadWidth;

        const minX = left + player.width / 2 + 5;

        const maxX = right - player.width / 2 - 5;

        if (this.cursors.left.isDown) {

            this.targetX -= player.speed * dt;

        }

        if (this.cursors.right.isDown) {

            this.targetX += player.speed * dt;

        }

        // Keep player inside highway
        this.targetX = Phaser.Math.Clamp(
            this.targetX,
            minX,
            maxX
        );

        // Smooth movement
        this.playerX = Phaser.Math.Linear(
            this.playerX,
            this.targetX,
            Math.min(1, 12 * dt)
        );

        const playerY = height - 115;

        this.player.setPosition(
            this.playerX,
            playerY
        );

        // =====================================
        // 3. DYNAMIC ROAD AND ENVIRONMENT
        // =====================================
        const roadScrollDelta =
            road.scrollSpeed *
            difficulty.speedMultiplier *
            dt;

        // Scroll highway markings
        this.roadOffset += roadScrollDelta;
        this.roadOffset %= 60;

        // Update day/night environment
        this.environment.update(
            roadScrollDelta,
            this.scoreManager.getDistance()
        );

        // Redraw highway using current theme
        this.drawRoad();

        // =====================================
        // 4. DYNAMIC TRAFFIC GENERATION
        // =====================================

        this.trafficSpawner.update(
            delta,
            difficulty.speedMultiplier,
            difficulty.spawnInterval,
            difficulty.level
        );

        // =====================================
        // 5. UPDATE TRAFFIC
        // =====================================

        this.traffic = this.traffic.filter(
            (vehicle: Traffic) => {

                const isOffscreen = vehicle.update(delta);

                if (isOffscreen) {

                    vehicle.destroy();

                    return false;

                }

                return true;

            }
        );

        // =====================================
        // 6. COLLISION DETECTION
        // =====================================

        const collisionDetected =
            CollisionManager.checkPlayerCollision(
                this.playerX,
                playerY,
                this.traffic
            );

        if (collisionDetected) {

            this.showGameOver();

        }

    }

}
