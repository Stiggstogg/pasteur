import { GameObjects, Scene, Geom } from 'phaser';
import gameOptions from "../helper/gameOptions";

// Container object for the continue button
export default class Continue extends GameObjects.Container {

    private readonly button: GameObjects.Image;
    private readonly text: GameObjects.BitmapText;
    private readonly textPosition = {x: 0.00, y: 0.0025};    // relative (game width) position where the text starts, relative to the box

    // Constructor
    constructor(scene: Scene) {

        super(scene, 0, 0);

        // set the basic properties of the container
        this.setVisible(false);             // hide the frame by default

        // create items
        this.button = new GameObjects.Image(scene, 0, 0, 'button').setOrigin(0).setScale(0.7);
        this.text = new GameObjects.BitmapText(scene, Math.round(this.button.displayWidth / 2 + this.scene.scale.width * this.textPosition.x), Math.round(this.button.displayHeight / 2 + this.scene.scale.width * this.textPosition.y), 'minogram', 'Continue', 10).setOrigin(0.5).setTint(gameOptions.textColorTutorial);


        // add children
        this.add([this.button, this.text]);

        // add interactivity
        this.setInteractive(new Geom.Rectangle(0, 0, this.button.displayWidth, this.button.displayHeight), Geom.Rectangle.Contains);
        this.on('pointerdown', () => {
            this.emit('continue');
        });

    }

    // Show the button
    showButton() {

        this.setVisible(true);

    }

    // hide the button
    hideButton() {

        this.setVisible(false);

    }

    // position the button (using relative coordinates)
    positionButton(x: number, y: number) {

        this.setPosition(x * this.scene.scale.width, y * this.scene.scale.height);

    }

    // change the text of the button
    changeText(text: string) {

        this.text.setText(text);

    }

}