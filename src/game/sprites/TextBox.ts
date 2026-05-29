import { GameObjects, Scene } from 'phaser';
import gameOptions from "../helper/gameOptions";

// Container object with the text for the tutorial
export default class TextBox extends GameObjects.Container {

    private readonly frame: GameObjects.Rectangle;
    private readonly shadow: GameObjects.Rectangle;
    private readonly shadowDistance: number;
    private readonly text: GameObjects.BitmapText;
    private readonly textPosition = {x: 0.05, y: 0.02};    // relative (game width) position where the text starts, relative to the box
    private readonly maxWidth = 0.80;                   // maximum width of the text (relative to the game width)

    // Constructor
    constructor(scene: Scene) {

        super(scene, 0, 0);

        // set the basic properties of the container
        this.setVisible(false);             // hide the frame by default

        // create items
        this.shadowDistance = 0.015;
        this.shadow = new GameObjects.Rectangle(scene, this.shadowDistance * this.scene.scale.width, this.shadowDistance * this.scene.scale.width, 100, 100, 0x000000).setOrigin(0).setAlpha(0.5);
        this.frame = new GameObjects.Rectangle(scene, 0, 0, 100, 100, 0xB24E2A).setOrigin(0);
        this.frame.setStrokeStyle(2, 0x000000);
        this.text = new GameObjects.BitmapText(scene, Math.round(this.scene.scale.width * this.textPosition.x), Math.round(this.scene.scale.width * this.textPosition.y), 'minogram', 'Text', 10).setOrigin(0).setTint(gameOptions.textColorTutorial);
        this.text.setMaxWidth(Math.round(this.scene.scale.width * this.maxWidth));

        // add children
        this.add([this.shadow, this.frame, this.text]);

    }

    // position the text box (using relative coordinates)
    positionBox(x: number, y: number) {

        this.setPosition(Math.round(x * this.scene.scale.width), Math.round(y * this.scene.scale.height));

    }

    // Show the dialog
    showText(text: string) {

        // set the text
        this.text.setText(text);

        // adjust the frame size
        this.frame.setSize(Math.round(this.text.width + 2 * this.textPosition.x * this.scene.scale.width), Math.round(this.text.height + 2 * this.textPosition.y * this.scene.scale.width));
        this.shadow.setSize(this.frame.displayWidth, this.frame.displayHeight);

        this.setVisible(true);
    }

    // hide the text box
    hideText() {

        this.setVisible(false);
    }

    getWidth(): number {

        return this.frame.width;

    }

}