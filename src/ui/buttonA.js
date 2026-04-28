/**
 * Creates an interactive button sprite with configurable frame states, position, and display size.
 *
 * @param {Phaser.Scene} scene - The Phaser scene context
 * @param {string} buttonName - The sprite key/name (spritesheet identifier)
 * @param {number} posX - X position where to paint the button
 * @param {number} posY - Y position where to paint the button
 * @param {number} displayWidth - Display width in pixels
 * @param {number} displayHeight - Display height in pixels
 * @param {number} frameHover - Frame to display on pointer over
 * @param {number} frameOut - Frame to display on pointer out
 * @param {number} frameDown - Frame to display on pointer down
 * @param {number} frameUp - Frame to display on pointer up
 * @returns {Phaser.Physics.Arcade.Sprite} The created button sprite
 */
export function createInteractiveButton(scene, buttonName, posX, posY, displayWidth, displayHeight, frameHover, frameOut, frameDown, frameUp) {
    const button = scene.add.sprite(posX, posY, buttonName, frameOut)
        .setInteractive({ useHandCursor: true })
        .setDisplaySize(displayWidth, displayHeight);

    button.on('pointerover', () => {
        button.setFrame(frameHover);
    });

    button.on('pointerout', () => {
        button.setFrame(frameOut);
    });

    button.on('pointerdown', () => {
        button.setFrame(frameDown);
    });

    button.on('pointerup', () => {
        button.setFrame(frameUp);
        console.log(`${buttonName} pulsado`);
    });

    return button;
}
