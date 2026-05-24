import { Scene } from 'phaser';

// "Loading" scene: Loads all assets and shows a progress bar while loading
export default class LoadingScene extends Scene {

    // constructor
    constructor() {

        super('Loading');

    }

    // Load all assets (for all scenes)
    preload(): void {

        // show logo
        this.add.sprite(this.scale.width/2, this.scale.height/2, 'logo').setScale(0.25, 0.25); // logo is already preloaded in 'Boot' scene

        // text
        this.add.text(this.scale.width/2, this.scale.height * 0.20, 'CLOWNGAMING', {fontSize: '40px', color: '#FFFF00', fontStyle: 'bold'}).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height * 0.73, 'Loading', {fontSize: '24px', color: '#27FF00'}).setOrigin(0.5);

        // progress bar background (e.g grey)
        const bgBar = this.add.graphics();
        const barW = this.scale.width * 0.3;            // progress bar width
        const barH = barW * 0.1;          // progress bar height
        const barX = this.scale.width / 2 - barW / 2;       // progress bar x coordinate (origin is 0, 0)
        const barY = this.scale.height * 0.8 - barH / 2   // progress bar y coordinate (origin is 0, 0)
        bgBar.setPosition(barX, barY);
        bgBar.fillStyle(0xF5F5F5, 1);
        bgBar.fillRect(0, 0, barW, barH);    // position is 0, 0 as it was already set with ".setPosition()"

        // progress bar
        const progressBar = this.add.graphics();
        progressBar.setPosition(barX, barY);

        // listen to the 'progress' event (fires every time an asset is loaded and 'value' is the relative progress)
        this.load.on('progress', function(value: number) {

            // clearing progress bar (to draw it again)
            progressBar.clear();

            // set style
            progressBar.fillStyle(0x27ff00, 1);

            // draw rectangle
            progressBar.fillRect(0, 0, value * barW, barH);

        }, this);

        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('./assets/');

        // load images
        this.load.image('floor', 'images/floor.png');
        this.load.image('table', 'images/table.png');
        this.load.image('bowlLeft', 'images/bowl-left.gif');
        this.load.image('bowlRight', 'images/bowl-right.gif');
        this.load.image('microscope', 'images/microscope.png');
        this.load.image('title', 'images/title.gif');
        this.load.image('thalidomide', 'images/thalidomide2.png');
        this.load.image('arrow', 'images/arrow.png');

        // spritesheets
        this.load.spritesheet('head', 'images/heads.png', {frameWidth: 58, frameHeight: 83});
        this.load.spritesheet('hand', 'images/hand.gif', {frameWidth: 73, frameHeight: 100});

        // load audio
        this.load.audioSprite('crystalToBowl', 'audio/CrystalToBowl.json', 'audio/CrystalToBowl.mp3');
        this.load.audioSprite('crystalFromTable', 'audio/CrystalFromTable.json', 'audio/CrystalFromTable.mp3');
        this.load.audioSprite('crystalToTable', 'audio/CrystalToTable.json', 'audio/CrystalToTable.mp3');
        this.load.audioSprite('pasteurVoice', 'audio/PasteurVoice.json', 'audio/PasteurVoice.mp3');

        this.load.audio('soundtrackMenu', ['audio/soundtrack_menu.mp3', 'audio/soundtrack_menu.ogg']);
        this.load.audio('soundtrackGame', ['audio/soundtrack_game.mp3', 'audio/soundtrack_game.ogg']);
        this.load.audio('soundtrackTutorial', ['audio/soundtrack_game.mp3', 'audio/soundtrack_game.ogg']);          // TODO: Change to tutorial soundtrack as soon as it is available

        this.load.audio('select', 'audio/select_001.mp3');
        this.load.audio('click', 'audio/click_003.mp3');

        // load json
        this.load.json('simpleShape', 'json/simpleShape.json');
        this.load.json('crystalData', 'json/crystalData.json');

        // load fonts
        this.load.bitmapFont('minogram', 'fonts/minogram_6x10.png', 'fonts/minogram_6x10.xml');

    }

    // Add the animations and change to "Home" scene, directly after loading
    create() {
        //this.scene.start('Tutorial');       // TODO: Remove after testing (Skips the menu screen)
        this.scene.start('Home');
    }

}