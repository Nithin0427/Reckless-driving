
import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/gameConfig';

export class MenuScene extends Phaser.Scene {
    private bestScore = 0;

    constructor() {
        super('MenuScene');
    }

    create(): void {
        const { width, height } = GAME_CONFIG;

        // Activate main menu layout
        document.body.classList.remove('game-screen');
        document.body.classList.add('menu-screen');
        this.bestScore = Number(
            localStorage.getItem('reckless-driving-best-score') || 0
        );

        // Background
        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x10141c
        );

        // Decorative highway
        const roadWidth = width * 0.8;
        const roadLeft = (width - roadWidth) / 2;

        this.add.rectangle(
            width / 2,
            height / 2,
            roadWidth,
            height,
            0x303945
        );

        // Road boundaries
        this.add.rectangle(
            roadLeft,
            height / 2,
            4,
            height,
            0xffc857
        );

        this.add.rectangle(
            roadLeft + roadWidth,
            height / 2,
            4,
            height,
            0xffc857
        );

        // Lane markings
        const laneWidth = roadWidth / GAME_CONFIG.lanes;

        for (let i = 1; i < GAME_CONFIG.lanes; i++) {
            const x = roadLeft + laneWidth * i;

            for (let y = 20; y < height; y += 100) {
                this.add.rectangle(
                    x,
                    y,
                    3,
                    45,
                    0xffffff,
                    0.7
                );
            }
        }

        // Dark menu panel
        this.add.rectangle(
            width / 2,
            height / 2,
            350,
            470,
            0x10141c,
            0.96
        ).setStrokeStyle(2, 0x2589ff);

        // Game title
        this.add.text(
            width / 2,
            height / 2 - 145,
            'RECKLESS\nDRIVING',
            {
                fontFamily: 'Arial',
                fontSize: '38px',
                fontStyle: 'bold',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 5
            }
        ).setOrigin(0.5);

        // Subtitle
        this.add.text(
            width / 2,
            height / 2 - 65,
            'DODGE TRAFFIC. SURVIVE LONGER.',
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#94a3b8',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Best score
        this.add.text(
            width / 2,
            height / 2 - 15,
            `BEST SCORE: ${this.bestScore}`,
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                fontStyle: 'bold',
                color: '#ffc857'
            }
        ).setOrigin(0.5);

        // Play button
        const playButton = this.add.rectangle(
            width / 2,
            height / 2 + 45,
            210,
            55,
            0x2589ff
        ).setInteractive({
            useHandCursor: true
        });

        this.add.text(
            width / 2,
            height / 2 + 45,
            'PLAY GAME',
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        playButton.on('pointerover', () => {
            playButton.setFillStyle(0x0868dc);
        });

        playButton.on('pointerout', () => {
            playButton.setFillStyle(0x2589ff);
        });

        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        // Settings button
        const settingsButton = this.add.rectangle(
            width / 2,
            height / 2 + 110,
            210,
            45,
            0x334155
        ).setInteractive({
            useHandCursor: true
        });

        this.add.text(
            width / 2,
            height / 2 + 110,
            'SETTINGS',
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                fontStyle: 'bold',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        settingsButton.on('pointerover', () => {
            settingsButton.setFillStyle(0x475569);
        });

        settingsButton.on('pointerout', () => {
            settingsButton.setFillStyle(0x334155);
        });

        settingsButton.on('pointerdown', () => {
            this.openSettings();
        });

        // Controls
        // Pause instruction only
        this.add.text(
            width / 2,
            height / 2 + 175,
            'P / ESC  -  PAUSE GAME',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#94a3b8',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Keyboard start
        
        this.input.keyboard?.once('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
    }

    private openSettings(): void {
        const { width, height } = GAME_CONFIG;

        const panel = this.add.container(width / 2, height / 2);
        panel.setDepth(20);

        const background = this.add.rectangle(
            0, 0, 320, 390, 0x10141c, 0.98
        ).setStrokeStyle(2, 0x2589ff);

        const heading = this.add.text(
            0, -155, 'SETTINGS',
            {
                fontSize: '30px',
                fontStyle: 'bold',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        const difficulty = this.add.text(
            0, -90, 'DIFFICULTY\nNORMAL',
            {
                fontSize: '18px',
                color: '#38bdf8',
                align: 'center',
                lineSpacing: 8
            }
        ).setOrigin(0.5);

        const controls = this.add.text(
            0, -5,
            'CONTROLS\n\n← / →  Move your car\nMouse  Move your car\nP / ESC  Pause game',
            {
                fontSize: '15px',
                color: '#cbd5e1',
                align: 'center',
                lineSpacing: 7
            }
        ).setOrigin(0.5);

        const fullscreenButton = this.add.rectangle(
            0, 100, 210, 42, 0x334155
        ).setInteractive({ useHandCursor: true });

        const fullscreenText = this.add.text(
            0, 100, 'TOGGLE FULLSCREEN',
            {
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        fullscreenButton.on('pointerover', () => {
            fullscreenButton.setFillStyle(0x475569);
        });

        fullscreenButton.on('pointerout', () => {
            fullscreenButton.setFillStyle(0x334155);
        });

        fullscreenButton.on('pointerdown', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });

        const backButton = this.add.rectangle(
            0, 160, 210, 42, 0x2589ff
        ).setInteractive({ useHandCursor: true });

        const backText = this.add.text(
            0, 160, 'BACK',
            {
                fontSize: '15px',
                fontStyle: 'bold',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        backButton.on('pointerover', () => {
            backButton.setFillStyle(0x0868dc);
        });

        backButton.on('pointerout', () => {
            backButton.setFillStyle(0x2589ff);
        });

        backButton.on('pointerdown', () => {
            panel.destroy();
        });

        panel.add([
            background,
            heading,
            difficulty,
            controls,
            fullscreenButton,
            fullscreenText,
            backButton,
            backText
        ]);
    }
}
