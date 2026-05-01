import { Rosco } from '../ui/rosco.js';
import { Question } from '../ui/question.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.mainButton = null;
        this.rosco = null;
        this.question = null;
    }

    preload() {
        this.load.spritesheet('buttons', 'assets/buttons_sprite.png',
            { frameWidth: 250, frameHeight: 250 }
        );
        this.load.image('background', 'assets/background_squares.png');
    }

    create() {
        const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
        const bgScale = Math.max(this.scale.width / bg.width, this.scale.height / bg.height);
        bg.setScale(bgScale);

        const layoutCenter = {
            x: this.scale.width / 2,
            y: this.scale.height * 0.46
        };

        const roscoConfig = {
            letters: 'ABCDEFGHIJLMNÑOPQRSTUVXYZ',
            centerX: layoutCenter.x,
            centerY: layoutCenter.y,
            roscoRadius: 220,
            buttonRadius: 22,
            backgroundColor: '#F0F0F0'
        };

        this.rosco = new Rosco(this, roscoConfig);

        this.question = new Question(
            this,
            { text: 'Respuesta A', index: 1 },
            { text: 'Respuesta B', index: 2 },
            { text: 'Respuesta C', index: 3 },
            { text: 'Respuesta D', index: 4 },
            'Escribe aquí el enunciado de la pregunta',
            {
                centerX: layoutCenter.x,
                centerY: layoutCenter.y,
                roscoRadius: roscoConfig.roscoRadius,
                roscoButtonRadius: roscoConfig.buttonRadius
            }
        );
    };

    update() {
    }
}
