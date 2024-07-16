import Phaser from 'phaser';
import gameOptions from "../helper/gameOptions";

// "Win" scene: Scene which is shown when you finished the game
export default class WinScene extends Phaser.Scene {

    private bowlData!: {leftBowlEE: number, rightBowlEE: number};

    // Constructor
    constructor() {
        super({
            key: 'Win'
        });
    }

    // Initialize parameters
    init(bowlData: {leftBowlEE: number, rightBowlEE: number}): void {

        this.bowlData = bowlData;

    }

    // Shows the home screen and waits for the user to select a menu entry
    create(): void {

        // Texts
        this.add.bitmapText(0.5 * gameOptions.gameWidth, gameOptions.gameHeight * 0.25, 'minogram', 'Congratulations!', 30).setOrigin(0.5);
        this.add.bitmapText(0.5 * gameOptions.gameWidth, gameOptions.gameHeight * 0.4, 'minogram', 'You sorted all crystals', 20).setOrigin(0.5);

        this.add.bitmapText(0.25 * gameOptions.gameWidth, gameOptions.gameHeight * 0.6, 'minogram', 'Left bowl:', 20).setOrigin(0, 0.5);
        this.add.bitmapText(0.25 * gameOptions.gameWidth, gameOptions.gameHeight * 0.7, 'minogram', 'Right bowl:', 20).setOrigin(0, 0.5);

        this.add.bitmapText(0.6 * gameOptions.gameWidth, gameOptions.gameHeight * 0.6, 'minogram', this.bowlData.leftBowlEE.toFixed(0) + ' %ee', 20).setOrigin(0, 0.5);
        this.add.bitmapText(0.6 * gameOptions.gameWidth, gameOptions.gameHeight * 0.7, 'minogram', this.bowlData.rightBowlEE.toFixed(0) + ' %ee', 20).setOrigin(0, 0.5);

        this.add.bitmapText(0.5 * gameOptions.gameWidth, gameOptions.gameHeight * 0.9, 'minogram', 'Click anywhere to start a new game.', 10).setOrigin(0.5);

        // Click event
        this.input.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }


}