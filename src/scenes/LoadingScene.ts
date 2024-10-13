import Phaser from 'phaser';
import gameOptions from "../helper/gameOptions";

// images
import floorImg from '../assets/images/floor.png';
import tableImg from '../assets/images/table.png';
import headsImg from '../assets/images/heads.png';
import bowlLeftImg from '../assets/images/bowl-left.gif';
import bowlRightImg from '../assets/images/bowl-right.gif';
import microscopeImg from '../assets/images/microscope.png';
import titleImg from '../assets/images/title.gif';
import handImg from '../assets/images/hand.gif';
import thalidomideImg from '../assets/images/thalidomide.png';
import arrowImg from '../assets/images/arrow.png';

// audio: soundtrack
import soundtrackMenuMp3 from '../assets/audio/soundtrack_menu.mp3';
import soundtrackMenuOgg from '../assets/audio/soundtrack_menu.ogg';
import soundtrackGameMp3 from '../assets/audio/soundtrack_game.mp3';
import soundtrackGameOgg from '../assets/audio/soundtrack_menu.ogg';

// audio: game sound effects
import crystalToBowlAudio from '../assets/audio/CrystalToBowl.mp3';
import crystalToBowlJSON from '../assets/audio/CrystalToBowl.json?url';             // ?url is needed to prevent typescript errors, as Phaser needs a string. If this is not added, then the JSON will be imported and not its path
import crystalFromTableAudio from '../assets/audio/CrystalFromTable.mp3';
import crystalFromTableJSON from '../assets/audio/CrystalFromTable.json?url';
import crystalToTableAudio from '../assets/audio/CrystalToTable.mp3';
import crystalToTableJSON from '../assets/audio/CrystalToTable.json?url';
import pasteurVoiceAudio from '../assets/audio/PasteurVoice.mp3';
import pasteurVoiceJSON from '../assets/audio/PasteurVoice.json?url';

// audio: UI
import clickMp3 from '../assets/audio/select_001.mp3';
import selectMp3 from '../assets/audio/click_003.mp3';

// json
import simpleShapeJson from '../assets/json/simpleShape.json';
import crystalDataJson from '../assets/json/crystalData.json';

// fonts
import minogramPNG from "../assets/fonts/minogram_6x10.png";         // from here: https://frostyfreeze.itch.io/pixel-bitmap-fonts-png-xml (CC0 licensed)
import minogramXML from "../assets/fonts/minogram_6x10.xml?url";

// "Loading" scene: Loads all assets and shows a progress bar while loading
export default class LoadingScene extends Phaser.Scene {

    // constructor
    constructor() {

        super({
            key: 'Loading'
        });

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
        this.load.image('microscope', microscopeImg);
        this.load.image('title', titleImg);
        this.load.image('thalidomide', thalidomideImg);
        this.load.image('arrow', arrowImg);

        // spritesheets
        this.load.spritesheet('head', headsImg, {frameWidth: 58, frameHeight: 83});
        this.load.spritesheet('hand', handImg, {frameWidth: 73, frameHeight: 100});

        // load audio
        this.load.audioSprite('crystalToBowl', crystalToBowlJSON, crystalToBowlAudio);
        this.load.audioSprite('crystalFromTable', crystalFromTableJSON, crystalFromTableAudio);
        this.load.audioSprite('crystalToTable', crystalToTableJSON, crystalToTableAudio);
        this.load.audioSprite('pasteurVoice', pasteurVoiceJSON, pasteurVoiceAudio);

        this.load.audio('soundtrackMenu', [soundtrackMenuMp3, soundtrackMenuOgg]);
        this.load.audio('soundtrackGame', [soundtrackGameMp3, soundtrackGameOgg]);
        this.load.audio('soundtrackTutorial', [soundtrackGameMp3, soundtrackGameOgg]);          // TODO: Change to tutorial soundtrack as soon as it is available

        this.load.audio('select', selectMp3);
        this.load.audio('click', clickMp3);

        // load json
        this.load.json('simpleShape', simpleShapeJson);
        this.load.json('crystalData', crystalDataJson);

        // load fonts
        this.load.bitmapFont('minogram', minogramPNG, minogramXML);

    }

    // Add the animations and change to "Home" scene, directly after loading
    create() {
        this.scene.start('Tutorial');       // TODO: Remove after testing (Skips the menu screen)
        //this.scene.start('Home');
    }

}