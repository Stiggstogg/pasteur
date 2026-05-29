import { GameObjects, Scene, Tweens } from 'phaser';

export default class Arrow extends GameObjects.Sprite {

    private arrowTween!: Tweens.Tween;
    private direction!: string;

    constructor(scene: Scene, x: number, y: number) {

        super(scene, x, y, 'arrow');

        this.direction = 'right';

        this.arrowTween = this.scene.tweens.add({
            targets: this,
            x: this.x - 0.05 * this.scene.scale.width,
            y: this.y + 0.05 * this.scene.scale.width,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Cubic.easeIn'
        });

    }

    // position the arrow (using relative coordinates)
    setRelativePosition(x: number, y: number) {

        this.arrowTween.destroy();

        this.setPosition(x * this.scene.scale.width, y * this.scene.scale.height);

        // add tween to move the arrow
        const moveDistance = 0.03;
        let moveX = - moveDistance;
        let moveY = + moveDistance;

        if (this.direction == 'left') {
            moveX = + moveDistance;
            moveY = - moveDistance;
        }
        else if (this.direction == 'up') {
            moveX = + moveDistance;
            moveY = + moveDistance;
        }
        else if (this.direction == 'down') {
            moveX = - moveDistance;
            moveY = + moveDistance;
        }

        this.arrowTween = this.scene.tweens.add({
            targets: this,
            x: this.x + moveX * this.scene.scale.width,
            y: this.y + moveY * this.scene.scale.width,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Cubic.easeIn'
        });

        this.arrowTween.play();

    }

    // Define in which direction the arrow should look
    setDirection(direction: string) {

        this.direction = direction;

        if (direction == 'left') {

            this.setRotation(Math.PI / 2);

        }
        else if (direction == 'up') {

            this.setRotation(-Math.PI);

        }
        else if (direction == 'down') {

            this.setRotation(0);
        }
        else {

            this.direction = 'right';
            this.setRotation(-Math.PI / 2);
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