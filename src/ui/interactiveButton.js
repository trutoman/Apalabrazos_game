export class InteractiveButton extends Phaser.GameObjects.Container {
    constructor(scene, buttonName, posX, posY, displayWidth, displayHeight, label = '', onPointerDown = null, options = {}) {
        super(scene, posX, posY);

        const radius = Math.min(displayWidth, displayHeight) / 2;
        const {
            type = 'circle',
            circleColor = 0xfadf09,
            strokeColor = 0x000000,
            strokeWidth = 1,
            textColor = '#000000',
            fontSize = '24px',
            fontFamily = 'Archivo Black',
            shadowColor = 0x000000,
            shadowAlpha = 1,
            useHandCursor = true,
            shadowDepth = 4
        } = options;

        this.buttonName = buttonName;
        this.label = label;
        this.onPointerDown = onPointerDown;
        this.baseOffset = 0;
        this.hoverOffset = -shadowDepth;
        this.shadowOffset = shadowDepth;

        const isSquare = type === 'square';

        if (isSquare) {
            this.shadow = scene.add.rectangle(this.shadowOffset, this.shadowOffset, displayWidth, displayHeight, shadowColor, shadowAlpha);
            this.circle = scene.add.rectangle(0, 0, displayWidth, displayHeight, circleColor);
        } else {
            this.shadow = scene.add.circle(this.shadowOffset, this.shadowOffset, radius, shadowColor, shadowAlpha);
            this.circle = scene.add.circle(0, 0, radius, circleColor);
        }

        this.circle.setStrokeStyle(strokeWidth, strokeColor);
        this.text = scene.add.text(0, 0, label, {
            fontSize,
            fontFamily,
            color: textColor
        }).setOrigin(0.5);

        this.add([this.shadow, this.circle, this.text]);
        this.setSize(displayWidth, displayHeight);
        this.setName(buttonName);

        this.circle.setInteractive({ useHandCursor });
        this.circle.on('pointerover', this.handlePointerOver, this);
        this.circle.on('pointerout', this.handlePointerOut, this);
        this.circle.on('pointerdown', this.handlePointerDown, this);

        scene.add.existing(this);
    }

    _moveContent(x, y) {
        this.each(child => {
            if (child !== this.shadow) {
                child.setPosition(x, y);
            }
        });
    }

    handlePointerOver() {
        this._moveContent(this.hoverOffset, this.hoverOffset);
    }

    handlePointerOut() {
        this._moveContent(this.baseOffset, this.baseOffset);
    }

    handlePointerDown() {
        this._moveContent(this.shadowOffset, this.shadowOffset);
        console.log(`pointerdown on button: ${this.buttonName}`);

        if (typeof this.onPointerDown === 'function') {
            this.onPointerDown(this.label, {
                circle: this.circle,
                text: this.text,
                shadow: this.shadow,
                buttonName: this.buttonName,
                button: this
            });
        }
    }
}
