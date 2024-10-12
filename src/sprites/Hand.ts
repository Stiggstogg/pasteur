import { GameObjects } from 'phaser';

export default class Hand extends GameObjects.Sprite {

    public canFlip = false;
    public front = true;       // if this is true the front is shown

    constructor(scene: Phaser.Scene, x: number, y: number, right: boolean) {

        super(scene, x, y, 'hand', 0);

        // mirror the hand if it is the left one
        if (!right) {
            this.setFlip(true, false);
        }

        // flip the hand in case it can be flipped
        this.setInteractive();
        this.on('pointerdown', () => {
            if (this.canFlip) {

                if (this.front) {       // front is shown, change it to back
                    this.setFrame(1);
                }
                else {                  // back is shown change it to front
                    this.setFrame(0);
                }

                this.front = !this.front;

                this.scene.events.emit('flipped');     // emit the event to the scene

            }
        });

    }


}