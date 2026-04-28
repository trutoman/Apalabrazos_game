import { MainScene } from './src/scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#F0F0F0',
    scene: [MainScene]
};

new Phaser.Game(config);
