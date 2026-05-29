import { Scene } from 'phaser';

// "Loading" scene: Loads all assets and shows a progress bar while loading
export default class LoadingScene extends Scene {

    // constructor
    constructor() {

        super('Loading');

    }

    // Load all assets (for all scenes)
    preload(): void {

        // show logos
        this.add.image(this.scale.width * 0.35, this.scale.height * 0.58, 'boojakascha').setScale(0.4).setOrigin(0.5);   // logo is already preloaded in 'Boot' scene
        this.add.image(this.scale.width * 0.65, this.scale.height * 0.58, 'logo').setScale(0.4).setOrigin(0.5);

        // text
        this.add.text(this.scale.width/2, this.scale.height * 0.01, 'Boojakascha\n&\nCLOWNGAMING', {fontSize: '30px', color: '#AAAAAA', fontStyle: 'bold'}).setOrigin(0.5, 0).setAlign('center');
        this.add.text(this.scale.width/2, this.scale.height * 0.85, 'Loading', {fontSize: '24px', color: '#AAAAAA'}).setOrigin(0.5);

        // progress bar background (e.g grey)
        const bgBar = this.add.graphics();
        const barW = this.scale.width * 0.5;            // progress bar width
        const barH = barW * 0.07;          // progress bar height
        const barX = this.scale.width / 2 - barW / 2;       // progress bar x coordinate (origin is 0, 0)
        const barY = this.scale.height * 0.95 - barH / 2   // progress bar y coordinate (origin is 0, 0)
        bgBar.setPosition(barX, barY);
        bgBar.fillStyle(0x7A0000, 1);
        bgBar.fillRect(0, 0, barW, barH);    // position is 0, 0 as it was already set with ".setPosition()"

        // progress bar
        const progressBar = this.add.graphics();
        progressBar.setPosition(barX, barY);

        // listen to the 'progress' event (fires every time an asset is loaded and 'value' is the relative progress)
        this.load.on('progress', function(value: number) {

            // clearing progress bar (to draw it again)
            progressBar.clear();

            // set style
            progressBar.fillStyle(0xAAAAAA, 1);

            // draw rectangle
            progressBar.fillRect(0, 0, value * barW, barH);

        }, this);

        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('./assets/');

        // load images
        this.load.image('title-background', 'images/title-background.gif');
        this.load.image('title-signature', 'images/title-signature.gif');
        this.load.image('title-theGame', 'images/title-thegame.gif');
        this.load.image('floor', 'images/floor.png');
        this.load.image('table', 'images/table.png');
        this.load.image('bowlLeft', 'images/bowl-left.gif');
        this.load.image('bowlRight', 'images/bowl-right.gif');
        this.load.image('microscope', 'images/microscope_burgunderrot.png');
        this.load.image('thalidomide', 'images/thalidomide.png');
        this.load.image('arrow', 'images/arrow-darkred-45.png');
        this.load.image('button', 'images/button-darkred-black.png');
        this.load.image('credits', 'images/credits-background.gif');
        this.load.image('win', 'images/win.gif');

        // spritesheets
        this.load.spritesheet('head', 'images/heads.png', {frameWidth: 58, frameHeight: 83});
        this.load.spritesheet('hand', 'images/hand.gif', {frameWidth: 73, frameHeight: 100});

        // load audio
        this.load.audioSprite('crystalToBowl', 'audio/CrystalToBowl.json', 'audio/CrystalToBowl.mp3');
        this.load.audioSprite('crystalFromTable', 'audio/CrystalFromTable.json', 'audio/CrystalFromTable.mp3');
        this.load.audioSprite('crystalToTable', 'audio/CrystalToTable.json', 'audio/CrystalToTable.mp3');
        this.load.audioSprite('pasteurVoice', 'audio/PasteurVoice.json', 'audio/PasteurVoice.mp3');

        this.load.audio('soundtrackMenu', ['audio/soundtrack_menu.mp3']);
        this.load.audio('soundtrackGame', ['audio/soundtrack_game.mp3']);

        this.load.audio('select', 'audio/select_001.mp3');
        this.load.audio('click', 'audio/click_003.mp3');

        // load json
        this.load.json('simpleShape', 'json/simpleShape.json');
        this.load.json('crystalData', 'json/crystalData.json');

        // load fonts
        this.load.bitmapFont('minogram', 'fonts/minogram_6x10.png', 'fonts/minogram_6x10.xml');
        this.load.bitmapFont('thick', 'fonts/thick_8x8.png', 'fonts/thick_8x8.xml');

    }

    // Add the animations and change to "Home" scene, directly after loading
    create() {
        //this.scene.start('Tutorial');       // TODO: Remove after testing (Skips the menu screen)
        //this.scene.start('Credits');       // TODO: Remove after testing (Skips the menu screen)
        //this.scene.start('Win', {leftBowlEE: 100, rightBowlEE: 75, time: '00:35', score: 5236})       // TODO: Remove after testing (Skips the menu screen)
        this.scene.start('Home');
    }

}