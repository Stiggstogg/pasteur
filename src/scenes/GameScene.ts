import Phaser from 'phaser';

import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private head!: Phaser.GameObjects.Image;
    private bowlLeft!: Phaser.GameObjects.Image;
    private bowlRight!: Phaser.GameObjects.Image;

    // Constructor
    constructor() {
        super({
            key: 'Game'
        });
    }

    /// Initialize parameters
    init(): void {

    }

    // load assets
    preload(): void {

    }

    // Creates all objects of this scene
    create(): void {

        // scene setup (background, table, etc,...)
        this.add.image(0, 0, 'floor').setOrigin(0);
        this.add.image(0, 0, 'table').setOrigin(0);
        this.add.rectangle(0, gameOptions.gameHeight, gameOptions.gameWidth, 0.2 * gameOptions.gameHeight, 0x333399).setOrigin(0, 1);
        this.head = this.add.image(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 0.82, 'head', 0);

        this.bowlLeft = this.add.sprite(gameOptions.gameWidth * 0.17, gameOptions.gameHeight * 0.53, 'bowlLeft').setInteractive();
        this.bowlRight = this.add.sprite(gameOptions.gameWidth * 0.85, gameOptions.gameHeight * 0.53, 'bowlRight').setInteractive();

        // setup events
        this.bowlLeft.on('pointerdown', function(this: GameScene) {
            console.log('Left bowl was clicked!');      // TODO: Add proper function
            this.head.setFrame(0);
        }, this);

        this.bowlRight.on('pointerdown', function(this: GameScene) {
            console.log('Right bowl was clicked!');      // TODO: Add proper function
            this.head.setFrame(1);
        }, this);

        // Crystal test
        this.add.existing(new Crystal(this));

        // Add keyboard inputs
        this.addKeys();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed


    }

    // Add keyboard input to the scene.
    addKeys(): void {

        // up and down keys (moving the selection of the entries)
        this.input.keyboard!.addKey('Left').on('down', function(this: GameScene) {
            this.head.setFrame(0)
        }, this);
        this.input.keyboard!.addKey('Down').on('down', function(this: GameScene) {
            this.head.setFrame(1)
        }, this);
        this.input.keyboard!.addKey('Right').on('down', function(this: GameScene) {
            this.head.setFrame(2)
        }, this);

    }

}