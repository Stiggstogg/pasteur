import { GameObjects, Scene, Geom } from 'phaser';
import gameOptions from "../helper/gameOptions";

// Container object for the continue button
export default class Continue extends GameObjects.Container {

    private readonly frame: GameObjects.Rectangle;
    private readonly text: GameObjects.BitmapText;
    private readonly textPosition = {x: 0.005, y: 0.005};    // relative (game width) position where the text starts, relative to the box

    // Constructor
    constructor(scene: Scene) {

        super(scene, 0, 0);

        // set the basic properties of the container
        this.setVisible(false);             // hide the frame by default

        // create items
        this.frame = new GameObjects.Rectangle(scene, 0, 0, 100, 100, 0xB24E2A).setOrigin(0);
        this.frame.setStrokeStyle(2, 0x000000);
        this.text = new GameObjects.BitmapText(scene, Math.round(this.scene.scale.width * this.textPosition.x), Math.round(this.scene.scale.width * this.textPosition.y), 'minogram', 'Continue >>', 10).setOrigin(0).setTint(gameOptions.textColorTutorial);

        // adjust the frame size
        this.frame.setSize(this.text.width + 2 * this.textPosition.x * this.scene.scale.width, this.text.height + 2 * this.textPosition.y * this.scene.scale.width);

        // add children
        this.add([this.frame, this.text]);

        // add interactivity
        this.setInteractive(new Geom.Rectangle(0, 0, this.frame.width, this.frame.height), Geom.Rectangle.Contains);
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

        // adjust the frame size
        this.frame.setSize(this.text.width + 2 * this.textPosition.x * this.scene.scale.width, this.text.height + 2 * this.textPosition.y * this.scene.scale.width);

    }

}