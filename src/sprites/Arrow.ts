import { GameObjects } from 'phaser';
import gameOptions from "../helper/gameOptions";

export default class Arrow extends GameObjects.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {

        super(scene, x, y, 'arrow');

    }

    // position the arrow (using relative coordinates)
    setRelativePosition(x: number, y: number) {

        this.setPosition(x * gameOptions.gameWidth, y * gameOptions.gameHeight);

    }

    // Define in which direction the arrow should look
    setDirection(direction: string) {

        if (direction == 'left') {

            this.setRotation(Math.PI);

        }
        else if (direction == 'up') {

            this.setRotation(-Math.PI / 2);

        }
        else if (direction == 'down') {

                this.setRotation(Math.PI / 2);
        }
        else {

                this.setRotation(0);
        }

    }

    // Show the arrow
    show() {

        this.setVisible(true);

    }

    // hide the arrow
    hide() {

        this.setVisible(false);

    }


}