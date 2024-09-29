import { GameObjects } from 'phaser';
import gameOptions from "../helper/gameOptions";

// Container object with the text for the tutorial
export default class TextBox extends GameObjects.Container {

    private readonly frame: GameObjects.Rectangle;
    private readonly text: GameObjects.BitmapText;
    private readonly textPosition = {x: 0.05, y: 0.02};    // relative (game width) position where the text starts, relative to the box
    private readonly maxWidth = 0.80;                   // maximum width of the text (relative to the game width)

    // Constructor
    constructor(scene: Phaser.Scene) {

        super(scene, 0, 0);

        // set the basic properties of the container
        this.setVisible(false);             // hide the frame by default

        // create items
        this.frame = new GameObjects.Rectangle(scene, 0, 0, 100, 100, 0xB24E2A).setOrigin(0);
        this.frame.setStrokeStyle(2, 0x000000);
        this.text = new GameObjects.BitmapText(scene, gameOptions.gameWidth * this.textPosition.x, gameOptions.gameWidth * this.textPosition.y, 'minogram', 'Text', 10).setOrigin(0).setTint(0xE1E2A8);
        this.text.setMaxWidth(gameOptions.gameWidth * this.maxWidth);

        // add children
        this.add([this.frame, this.text]);

    }

    // Show the dialog
    showText(text: string) {

        // set the text
        this.text.setText(text);

        // adjust the frame size
        this.frame.setSize(this.text.width + 2 * this.textPosition.x * gameOptions.gameWidth, this.text.height + 2 * this.textPosition.y * gameOptions.gameWidth);

        this.setVisible(true);
    }

    // hide the text box
    hideText() {

        this.setVisible(false);
    }

}