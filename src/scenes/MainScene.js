import { InteractiveButton } from '../ui/buttonA.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.mainButton = null;
        this.letterButtons = new Map();
        this.buttonsByName = new Map();
        this.buttonsGroup = null;
    }

    preload() {
        this.load.spritesheet('buttons', 'assets/buttons_sprite.png',
        { frameWidth: 250 , frameHeight: 250 }
    );
    }

    create() {
        this.letterButtons.clear();
        this.buttonsByName.clear();
        this.buttonsGroup = this.add.group();

        const letters = "ABCDEFGHIJLMNÑOPQRSTUVXYZ".split("");
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        const roscoRadius = 220; // Radio del rosco
        const buttonRadius = 22;

        this.cameras.main.setBackgroundColor('#F0F0F0');

        letters.forEach((char, i) => {
            const angle = -Math.PI / 2 + (i / letters.length) * Math.PI * 2;
            const buttonX = centerX + Math.cos(angle) * roscoRadius;
            const buttonY = centerY + Math.sin(angle) * roscoRadius;
            const buttonName = `${char}_button`;

            const button = new InteractiveButton(
                this,
                buttonName,
                buttonX,
                buttonY,
                buttonRadius * 2,
                buttonRadius * 2,
                char
            );

            this.buttonsGroup.add(button);
            this.letterButtons.set(char, button);
            this.buttonsByName.set(buttonName, button);
        });
    };

    getButtonByLetter(letter) {
        return this.letterButtons.get(letter) || null;
    }

    getButtonByName(buttonName) {
        return this.buttonsByName.get(buttonName) || null;
    }

    getButtonsByLetters(letters) {
        return letters
            .map((letter) => this.getButtonByLetter(letter))
            .filter((button) => button !== null);
    }

    getAllButtons() {
        return this.buttonsGroup ? this.buttonsGroup.getChildren() : [];
    }


    update() {
    }
}
