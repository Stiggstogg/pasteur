import { Scene, GameObjects } from 'phaser';
import Continue from "../sprites/Continue";
import gameOptions from "../helper/gameOptions";

// "Win" scene: Scene which is shown when you finished the game
export default class CreditsScene extends Scene {

    private aGameText!: GameObjects.BitmapText;

    private ideaText!: GameObjects.BitmapText;
    private programmingText!: GameObjects.BitmapText;
    private artText!: GameObjects.BitmapText;
    private musicText!: GameObjects.BitmapText;
    private songText!: GameObjects.BitmapText;
    private platformText!: GameObjects.BitmapText;
    private frameworkText!: GameObjects.BitmapText;
    private synthesizerText!: GameObjects.BitmapText;
    private artworkText!: GameObjects.BitmapText;

    private ideaValue!: GameObjects.BitmapText;
    private programmingValue!: GameObjects.BitmapText;
    private artValue!: GameObjects.BitmapText;
    private musicValue!: GameObjects.BitmapText;
    private songValue!: GameObjects.BitmapText;
    private platformValue!: GameObjects.BitmapText;
    private frameworkValue!: GameObjects.BitmapText;
    private synthesizerValue!: GameObjects.BitmapText;
    private artworkValue!: GameObjects.BitmapText;

    private backButton!: Continue;

    // Constructor
    constructor() {
        super({
            key: 'Credits'
        });
    }

    // Shows the home screen and waits for the user to select a menu entry
    create(): void {

        // fade in and start the music
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);

        // background image
        this.add.image(0, 0, 'credits').setOrigin(0);
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);

        // Texts
        this.aGameText = this.add.bitmapText(1.03 * this.scale.width, this.scale.height * 0.10, 'minogram', 'a game by Fabian "Stiggstogg" Hobi and Benjamin "Boojakascha" Spenger', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);

        const startY = 0.20 * this.scale.height;
        const distanceY = 0.07 * this.scale.height;
        let startX = 1.03 * this.scale.width;

        this.ideaText = this.add.bitmapText(startX, startY, 'minogram', 'Idea:', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.programmingText = this.add.bitmapText(startX, startY + distanceY, 'minogram', 'Programming:', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.artText = this.add.bitmapText(startX, startY + 2 * distanceY, 'minogram', 'Art:', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.musicText = this.add.bitmapText(startX, startY + 3 * distanceY, 'minogram', 'Music:', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.songText = this.add.bitmapText(startX, startY + 4 * distanceY, 'minogram', 'Song:', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.platformText = this.add.bitmapText(startX, startY + 6 * distanceY, 'minogram', 'Platform:', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.frameworkText = this.add.bitmapText(startX, startY + 7 * distanceY, 'minogram', 'Framework:', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.synthesizerText = this.add.bitmapText(startX, startY + 8 * distanceY, 'minogram', 'Synthesizer:', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.artworkText = this.add.bitmapText(startX, startY + 9 * distanceY, 'minogram', 'Artwork:', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);

        startX = 1.40 * this.scale.width;

        this.ideaValue = this.add.bitmapText(startX, startY, 'minogram', 'Boojakascha', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.programmingValue = this.add.bitmapText(startX, startY + distanceY, 'minogram', 'Stiggstogg', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.artValue = this.add.bitmapText(startX, startY + 2 * distanceY, 'minogram', 'Boojakascha', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.musicValue = this.add.bitmapText(startX, startY + 3 * distanceY, 'minogram', 'Boojakascha & Stiggstogg', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.songValue = this.add.bitmapText(startX, startY + 4 * distanceY, 'minogram', 'Meet Me in St. Louis, Louis (1904)', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.platformValue = this.add.bitmapText(startX, startY + 6 * distanceY, 'minogram', 'HTML5', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.frameworkValue = this.add.bitmapText(startX, startY + 7 * distanceY, 'minogram', 'Phaser 3', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.synthesizerValue = this.add.bitmapText(startX, startY + 8 * distanceY, 'minogram', 'Roland SC-88 pro (1996)', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);
        this.artworkValue = this.add.bitmapText(startX, startY + 9 * distanceY, 'minogram', 'Macromedia Fireworks MX (2002)', 10).setOrigin(0, 0.5).setDropShadow(gameOptions.textShadowSettings.horizontalOffset, gameOptions.textShadowSettings.verticalOffset, gameOptions.textShadowSettings.color, gameOptions.textShadowSettings.alpha);

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

    }

    // move in objects
    moveInObjects() {

        const textX = 0.03 * this.scale.width;
        const valueX = 0.22 * this.scale.width;

        this.add.timeline([
            {
                at: gameOptions.fadeInOutTime,
                tween: {
                    targets: this.aGameText,
                    x: 0.03 * this.scale.width,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 750,
                tween: {
                    targets: this.ideaText,
                    x: textX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.programmingText,
                    x: textX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.artText,
                    x: textX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.musicText,
                    x: textX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.songText,
                    x: textX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.platformText,
                    x: textX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.frameworkText,
                    x: textX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.synthesizerText,
                    x: textX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.artworkText,
                    x: textX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 750,
                tween: {
                    targets: this.ideaValue,
                    x: valueX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.programmingValue,
                    x: valueX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.artValue,
                    x: valueX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.musicValue,
                    x: valueX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.songValue,
                    x: valueX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.platformValue,
                    x: valueX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.frameworkValue,
                    x: valueX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.synthesizerValue,
                    x: valueX,
                    ease: 'Cubic.easeOut',
                    duration: 750
                }
            },
            {
                from: 250,
                tween: {
                    targets: this.artworkValue,
                    x: valueX,
                    ease: 'Cubic.easeOut',
                    duration: 750
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
            },
        ]).play();

    }

}