
import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GAME_CONFIG } from './config/gameConfig';
import './style.css';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,

    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,

    parent: 'game-root',

    backgroundColor: '#10141c',

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [MenuScene, GameScene]
};

new Phaser.Game(config);
