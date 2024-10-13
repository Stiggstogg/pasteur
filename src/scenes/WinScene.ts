import Phaser from 'phaser';
import gameOptions from "../helper/gameOptions";
import {WinSceneData} from "../helper/types";

// "Win" scene: Scene which is shown when you finished the game
export default class WinScene extends Phaser.Scene {

    private winData!: WinSceneData
    private soundtrack!: Phaser.Sound.WebAudioSound;
    private fading!: boolean;

    // Constructor
    constructor() {
        super({
            key: 'Win'
        });
    }

    // Initialize parameters
    init(data: WinSceneData): void {

        this.winData = data;

    }

    // Shows the home screen and waits for the user to select a menu entry
    create(): void {

        // initialize variables
        this.fading = false;

        // fade in and start the music
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);
        this.soundtrack = this.sound.get('soundtrackGame');         // get the soundtrack

        // Texts
        this.add.bitmapText(0.5 * gameOptions.gameWidth, gameOptions.gameHeight * 0.15, 'minogram', 'Congratulations!', 30).setOrigin(0.5);
        this.add.bitmapText(0.5 * gameOptions.gameWidth, gameOptions.gameHeight * 0.30, 'minogram', 'You sorted all crystals', 20).setOrigin(0.5);

        const startY = 0.45 * gameOptions.gameHeight;
        const distanceY = 0.1 * gameOptions.gameHeight;
        let startX = 0.25 * gameOptions.gameWidth;

        this.add.bitmapText(startX, startY, 'minogram', 'Left bowl:', 20).setOrigin(0, 0.5);
        this.add.bitmapText(startX, startY + distanceY, 'minogram', 'Right bowl:', 20).setOrigin(0, 0.5);
        this.add.bitmapText(startX, startY + 2 * distanceY, 'minogram', 'Time:', 20).setOrigin(0, 0.5);
        this.add.bitmapText(startX, startY + 3 * distanceY, 'minogram', 'Score:', 20).setOrigin(0, 0.5);

        startX = 0.6 * gameOptions.gameWidth;

        this.add.bitmapText(startX, startY, 'minogram', this.winData.leftBowlEE.toFixed(0) + ' %ee', 20).setOrigin(0, 0.5);
        this.add.bitmapText(startX, startY + distanceY, 'minogram', this.winData.rightBowlEE.toFixed(0) + ' %ee', 20).setOrigin(0, 0.5);
        this.add.bitmapText(startX, startY + 2 * distanceY, 'minogram', this.winData.time, 20).setOrigin(0, 0.5);
        this.add.bitmapText(startX, startY + 3 * distanceY, 'minogram', this.winData.score.toFixed(0), 20).setOrigin(0, 0.5);

        this.add.bitmapText(0.5 * gameOptions.gameWidth, gameOptions.gameHeight * 0.9, 'minogram', 'Click anywhere to go back', 10).setOrigin(0.5);

        // Click event
        this.input.on('pointerdown', () => {

            if (!this.fading) {
                this.fading = true;         // set fading to true

                this.cameras.main.fadeOut(gameOptions.fadeInOutTime);       // fade out the screen

                // fade out the music
                this.tweens.add({
                    targets: this.soundtrack,
                    volume: 0,
                    duration: gameOptions.fadeInOutTime
                });

                this.cameras.main.once('camerafadeoutcomplete', () => {     // when the fade out is complete
                    this.soundtrack.stop();                                                 // stop the soundtrack
                    this.scene.start('Home');                                          // go back to the home scene
                });

            }

        });

        // ensure the music is really stopped
        this.events.once('shutdown', () => {
            this.sound.get('soundtrackGame').stop();
        });


    }



}