import { createInteractiveButton } from '../ui/buttonA.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.mainButton = null;
    }

    preload() {
        this.load.spritesheet('buttons', 'assets/buttons_sprite.png',
        { frameWidth: 250 , frameHeight: 250 }
    );
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.cameras.main.setBackgroundColor('#F0F0F0');

        const circleRadius = 310;
        const totalButtons = 25;
        const angleStep = (Math.PI * 2) / totalButtons;

        for (let i = 0; i < totalButtons; i++) {
            const angle = i * angleStep;
            const buttonX = centerX + circleRadius * Math.cos(angle);
            const buttonY = centerY + circleRadius * Math.sin(angle);
            const frameOut = i;
            const framePress = 25 + i;

            createInteractiveButton(this, 'buttons', buttonX, buttonY, 75, 75, frameOut, frameOut, framePress, frameOut);
        }
    }

    update() {
    }
}
