import { Scene } from 'phaser';

// "Boot" scene: First scene, which is used to load basic (and small) assets for the "Loading" scene
export default class BootScene extends Scene {

    constructor() {
        super('Boot');
    }

    // load basic asset for "Loading" scene (e.g. logo), this asset should be small
    preload(): void {

        // load logo
        this.load.image('logo', 'assets/images/logo.png');

    }


    // change to "Loading" scene
    create(): void {

        this.scene.start('Loading');

    }

}