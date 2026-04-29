export class InteractiveButton extends Phaser.GameObjects.Container {
    constructor(scene, buttonName, posX, posY, displayWidth, displayHeight, label = '', onPointerDown = null) {
        super(scene, posX, posY);

        const radius = Math.min(displayWidth, displayHeight) / 2;

        this.buttonName = buttonName;
        this.label = label;
        this.onPointerDown = onPointerDown;
        this.baseOffset = 0;
        this.hoverOffset = -4;

        this.shadow = scene.add.circle(4, 4, radius, 0x000000);
        this.circle = scene.add.circle(0, 0, radius, 0xfadf09);
        this.circle.setStrokeStyle(1, 0x000000);
        this.text = scene.add.text(0, 0, label, {
            fontSize: '24px',
            fontFamily: 'Archivo Black',
            color: '#000000'
        }).setOrigin(0.5);

        this.add([this.shadow, this.circle, this.text]);
        this.setSize(displayWidth, displayHeight);
        this.setName(buttonName);

        this.circle.setInteractive({ useHandCursor: true });
        this.circle.on('pointerover', this.handlePointerOver, this);
        this.circle.on('pointerout', this.handlePointerOut, this);
        this.circle.on('pointerdown', this.handlePointerDown, this);

        scene.add.existing(this);
    }

    handlePointerOver() {
        this.circle.setPosition(this.hoverOffset, this.hoverOffset);
        this.text.setPosition(this.hoverOffset, this.hoverOffset);
    }

    handlePointerOut() {
        this.circle.setPosition(this.baseOffset, this.baseOffset);
        this.text.setPosition(this.baseOffset, this.baseOffset);
    }

    handlePointerDown() {
        this.circle.setFillStyle(0xffffff);
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

