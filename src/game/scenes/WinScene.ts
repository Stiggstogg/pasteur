import { Scene, Sound, GameObjects } from 'phaser';
import gameOptions from "../helper/gameOptions";
import {WinSceneData} from "../helper/types";
import Continue from '../sprites/Continue.ts';

// "Win" scene: Scene which is shown when you finished the game
export default class WinScene extends Scene {

    private winData!: WinSceneData
    private soundtrack!: Sound.WebAudioSound;
    private fading!: boolean;
    private titleText!: GameObjects.BitmapText;
    private descriptionText!: GameObjects.BitmapText;
    private leftBowlText!: GameObjects.BitmapText;
    private rightBowlText!: GameObjects.BitmapText;
    private timeText!: GameObjects.BitmapText;
    private scoreText!: GameObjects.BitmapText;
    private leftBowlValue!: GameObjects.BitmapText;
    private rightBowlValue!: GameObjects.BitmapText;
    private timeValue!: GameObjects.BitmapText;
    private scoreValue!: GameObjects.BitmapText;
    private clickText!: GameObjects.BitmapText;

    private backButton!: Continue;

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

        // background image
        this.add.image(0, 0, 'win').setOrigin(0);

        // Texts
        this.titleText = this.add.bitmapText(1.05 * this.scale.width, this.scale.height * 0.15, 'minogram', 'Congratulations!', 30).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.descriptionText = this.add.bitmapText(1.05 * this.scale.width, this.scale.height * 0.27, 'minogram', 'You sorted all crystals', 20).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);

        const startY = 0.42 * this.scale.height;
        const distanceY = 0.1 * this.scale.height;
        let startX = 1.05 * this.scale.width;

        this.leftBowlText = this.add.bitmapText(startX, startY, 'minogram', 'Left bowl:', 20).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.rightBowlText = this.add.bitmapText(startX, startY + distanceY, 'minogram', 'Right bowl:', 20).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.timeText = this.add.bitmapText(startX, startY + 2 * distanceY, 'minogram', 'Time:', 20).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.scoreText = this.add.bitmapText(startX, startY + 3.7 * distanceY, 'minogram', 'Score:', 30).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);

        startX = 1.40 * this.scale.width;

        this.leftBowlValue = this.add.bitmapText(startX, startY, 'minogram', this.winData.leftBowlEE.toFixed(0) + ' %ee', 20).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.rightBowlValue = this.add.bitmapText(startX, startY + distanceY, 'minogram', this.winData.rightBowlEE.toFixed(0) + ' %ee', 20).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.timeValue = this.add.bitmapText(startX, startY + 2 * distanceY, 'minogram', this.winData.time, 20).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.scoreValue = this.add.bitmapText(startX, startY + 3.7 * distanceY, 'minogram', this.winData.score.toFixed(0), 30).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);

        // add button
        this.backButton = this.add.existing(new Continue(this));
        this.backButton.showButton();
        this.backButton.positionButton(0.78, 1.2);
        this.backButton.changeText('Back');

        this.backButton.on('continue', () => {

            // disable the button
            this.backButton.disableInteractive();

            this.cameras.main.fadeOut(gameOptions.fadeInOutTime);       // fade out the screen

            this.cameras.main.once('camerafadeoutcomplete', () => {     // when the fade out is complete
                this.scene.start('Home');                                          // go back to the home scene
            });

        });

        // move in objects
        this.moveInObjects();

        // ensure the music is really stopped
        this.events.once('shutdown', () => {
            this.sound.get('soundtrackGame').stop();
        });


    }

    // move in objects
    moveInObjects() {

        this.add.timeline([
            {
                at: gameOptions.fadeInOutTime,
                tween: {
                    targets: this.titleText,
                    x: 0.05 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.descriptionText,
                    x: 0.05 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 750,
                tween: {
                    targets: this.leftBowlText,
                    x: 0.05 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.rightBowlText,
                    x: 0.05 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.timeText,
                    x: 0.05 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 750,
                tween: {
                    targets: this.leftBowlValue,
                    x: 0.4 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.rightBowlValue,
                    x: 0.4 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.timeValue,
                    x: 0.4 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 750,
                tween: {
                    targets: this.scoreText,
                    x: 0.05 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 750,
                tween: {
                    targets: this.scoreValue,
                    x: 0.40 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 750,
                tween: {
                    targets: this.scoreValue,
                    scale: 1.5,
                    ease: 'Cubic.easeOut',
                    yoyo: true,
                    duration: 500
                }
            },
            {
                from: 1000,
                tween: {
                    targets: this.clickText,
                    y: 0.93 * this.scale.height,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            },
            {
                from: 500,
                tween: {
                    targets: this.backButton,
                    y: 0.9 * this.scale.height,
                    ease: 'Cubic.easeOut',
                    duration: 500
                }
            }
        ]).play();

    }

}