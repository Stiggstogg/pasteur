import { GameObjects } from 'phaser';

export default class Hand extends GameObjects.Sprite {

    public canFlip = false;
    public front = true;       // if this is true the front is shown
    public right: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, right: boolean) {

        super(scene, x, y, 'hand', 0);

        this.right = right;

        // mirror the hand if it is the left one
        if (!this.right) {
            this.setFlip(true, false);
        }

        // flip the hand in case it can be flipped
        this.setInteractive();
        this.on('pointerdown', () => {
            if (this.canFlip) {

                if (this.front) {       // front is shown, change it to back
                    this.setFrame(1);

                    if (this.right) {
                        this.setFlip(true, false)
                    }
                    else {
                        this.setFlip(false, false)
                    }

                }
                else {                  // back is shown change it to front
                    this.setFrame(0);

                    if (this.right) {
                        this.setFlip(false, false)
                    }
                    else {
                        this.setFlip(true, false)
                    }
                }

                this.front = !this.front;

                this.scene.events.emit('flipped');     // emit the event to the scene

            }
        });

    }


}