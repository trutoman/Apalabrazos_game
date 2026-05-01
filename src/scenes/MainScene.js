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
        { frameWidth: 250 , frameHeight: 250 }
    );
    }

    create() {
        const isNarrow = this.scale.width < 1000;

        const minSide = Math.min(this.scale.width, this.scale.height);
        const roscoRadius = Phaser.Math.Clamp(Math.round(minSide * 0.30), 130, 260);
        const buttonRadius = Phaser.Math.Clamp(Math.round(roscoRadius * 0.10), 14, 24);

        const topPadding = 16;
        const minCenterY = roscoRadius + buttonRadius + topPadding;
        const desiredCenterY = isNarrow ? this.scale.height * 0.22 : this.scale.height * 0.46;
        const layoutCenter = {
            x: this.scale.width / 2,
            y: Math.max(minCenterY, desiredCenterY)
        };

        const roscoConfig = {
            letters: 'ABCDEFGHIJLMNÑOPQRSTUVXYZ',
            centerX: layoutCenter.x,
            centerY: layoutCenter.y,
            roscoRadius,
            buttonRadius,
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

        this.scale.off('resize', this.handleResize, this);
        this.scale.on('resize', this.handleResize, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scale.off('resize', this.handleResize, this);
        });
    };

    handleResize() {
        this.scene.restart();
    }

    update() {
    }
}
