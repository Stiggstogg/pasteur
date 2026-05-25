// imports
import {WEBGL, Game, Scale, Types} from 'phaser'

// scene imports
import BootScene from './scenes/BootScene';
import LoadingScene from './scenes/LoadingScene';
import HomeScene from './scenes/HomeScene';
import TutorialScene from './scenes/TutorialScene';
import GameScene from './scenes/GameScene';
import WinScene from './scenes/WinScene';

// define here game width and game height
const gameWidth = 425;
const gameHeight = 240;

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    title: "Pasteur the Game",
    type: WEBGL,
    width: gameWidth,
    height: gameHeight,
    canvas: document.getElementById('phaserCanvas') as HTMLCanvasElement,              // id of the phaser canvas element
    backgroundColor: '#000000',
    pixelArt: true,
    scale: {
        parent: 'canvasContainer',
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        zoom: Scale.MAX_ZOOM
        //max: {
        //    width: gameWidth * 1.5,
        //    height: gameHeight * 1.5
        //}
    },
    scene: [
        BootScene,
        LoadingScene,
        HomeScene,
        GameScene,
        TutorialScene,
        WinScene
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;