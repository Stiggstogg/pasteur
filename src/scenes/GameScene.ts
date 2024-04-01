import Phaser from 'phaser';
import * as THREE from 'three';

import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private head!: Phaser.GameObjects.Image;
    private bowlLeft!: Phaser.GameObjects.Image;
    private bowlRight!: Phaser.GameObjects.Image;
    private crystal!: Crystal;

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

        // setup the THREE canvas and scene
        const threeScene = this.setupThree();

        // setup the crystal
        this.crystal = new Crystal(threeScene, this);

        // Add keyboard inputs
        this.addKeys();

        this.scale.on('resize', () => { //TODO: Add resize of THREE canvas?


        },this);

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed


    }

    // Add keyboard input to the scene.
    addKeys(): void {

        const rotationAngle = Math.PI/8;

        // up and down keys (moving the selection of the entries)
        this.input.keyboard!.addKey('Left').on('down', function(this: GameScene) {

            this.crystal.rotate(0, -rotationAngle);

        }, this);
        this.input.keyboard!.addKey('Right').on('down', function(this: GameScene) {

            this.crystal.rotate(0, rotationAngle);

        }, this);
        this.input.keyboard!.addKey('Up').on('down', function(this: GameScene) {

            this.crystal.rotate(-rotationAngle, 0);

        }, this);
        this.input.keyboard!.addKey('Down').on('down', function(this: GameScene) {

            this.crystal.rotate(rotationAngle, 0);

        }, this);

    }

    // Create the three canvas and scene
    setupThree(): THREE.Scene {

        // setup the three canvas and add it to the body
        const threeCanvas = document.createElement('canvas');   // create a new canvas
        threeCanvas.id = 'threeCanvas';
        document.body.appendChild(threeCanvas);

        // set the style and size
        threeCanvas.style.position = 'absolute';        // set absolute position
        threeCanvas.style.top = '0';                    // position it on the top
        threeCanvas.style.left = '0';                   // position it on the left
        threeCanvas.style.margin = '0';                 // remove any margins
        threeCanvas.style.imageRendering = 'pixelated'; // apply the pixelated style for this canvas

        // resize the three canvas to match the game canvas
        this.resizeThreeCanvas('threeCanvas');     // resize it for the first time
        this.scale.on('resize', () => {         // update the style of the three canvas to always be on top of the phaser canvas (when phaser canvas is resized)
            this.resizeThreeCanvas('threeCanvas')
        },this);

        // create a new THREE scene
        const threeScene: THREE.Scene = new THREE.Scene();

        // create a renderer
        const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
            canvas: threeCanvas,
            antialias: true
        });
        renderer.autoClear = false;             // if this is true, the three.js renderer will clear everything (all things rendered by Phaser) before it renders the three.js objects

        // add a camera
        const camera = new THREE.PerspectiveCamera(45, gameOptions.gameWidth / gameOptions.gameHeight, 0.1, 10);
        camera.position.set(0, 0, 5);

        //create an external game object, add it to the Phaser scene and ensure it is rendered together with the other objects in the game loop
        const view = this.add.extern();

        // @ts-expect-error
        view.render = () => {
            renderer.state.reset();
            renderer.render(threeScene, camera);
        }

        return threeScene;

    }

    // Resize THREE canvas
    resizeThreeCanvas(threeCanvasId:string) {

        // get the canvas
        const threeCanvas = document.getElementById(threeCanvasId) as HTMLCanvasElement;
        const phaserCanvas = this.sys.canvas;

        // resize the canvas to match the phaser canvas (be on top of it)
        threeCanvas.style.width = phaserCanvas.style.width;                  // adapt width
        threeCanvas.style.height = phaserCanvas.style.height;                // adapt height
        threeCanvas.style.marginLeft = phaserCanvas.style.marginLeft;        // adapt margin

    }

}