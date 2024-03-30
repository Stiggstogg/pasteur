import Phaser from 'phaser';
import WebFontFile from "../helper/WebFontFile";
import gameOptions from "../helper/gameOptions";

// images
import floorImg from '../assets/images/floor.png';
import tableImg from '../assets/images/table.png';
import headsImg from '../assets/images/heads.png';
import bowlLeftImg from '../assets/images/bowl-left.gif';
import bowlRightImg from '../assets/images/bowl-right.gif';

// audio

// json
import nodesAndFacesJson from '../assets/json/nodesAndFaces.json';
import simpleShapeJson from '../assets/json/simpleShape.json';

// "Loading" scene: Loads all assets and shows a progress bar while loading
export default class LoadingScene extends Phaser.Scene {

    // constructor
    constructor() {

        super({
            key: 'Loading'
        });

    }

    // Initialize parameters
    init(): void {

    }

    // Load all assets (for all scenes)
    preload(): void {

        // show logo
        this.add.sprite(gameOptions.gameWidth/2, gameOptions.gameHeight/2, 'logo').setScale(0.25, 0.25); // logo is already preloaded in 'Boot' scene

        // text
        this.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight * 0.20, 'CLOWNGAMING', {fontSize: '40px', color: '#FFFF00', fontStyle: 'bold'}).setOrigin(0.5);
        this.add.text(gameOptions.gameWidth/2, gameOptions.gameHeight * 0.73, 'Loading', {fontSize: '24px', color: '#27FF00'}).setOrigin(0.5);

        // progress bar background (e.g grey)
        const bgBar = this.add.graphics();
        const barW = gameOptions.gameWidth * 0.3;            // progress bar width
        const barH = barW * 0.1;          // progress bar height
        const barX = gameOptions.gameWidth / 2 - barW / 2;       // progress bar x coordinate (origin is 0, 0)
        const barY = gameOptions.gameHeight * 0.8 - barH / 2   // progress bar y coordinate (origin is 0, 0)
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

        // load images
        this.load.image('floor', floorImg);
        this.load.image('table', tableImg);
        this.load.image('bowlLeft', bowlLeftImg);
        this.load.image('bowlRight', bowlRightImg);


        // spritesheets
        this.load.spritesheet('head', headsImg, {frameWidth: 58, frameHeight: 83});

        // load audio
        //this.load.audio('miss', 'assets/audio/Pew.mp3');

        // load json
        this.load.json('nodesAndFaces', nodesAndFacesJson);
        this.load.json('simpleShape', simpleShapeJson);

        // load fonts (with "webfontloader")
        this.load.addFile(new WebFontFile(this.load, 'Orbitron'));

    }

    // Add the animations and change to "Home" scene, directly after loading
    create() {
        this.scene.start('Game');       // TODO: Remove after testing (Skips the menu screen)
        //this.scene.start('Home');
    }

}