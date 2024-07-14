import Phaser from 'phaser';
import * as THREE from 'three';

import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";
import {Clicks, CrystalLocation} from "../helper/types";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private head!: Phaser.GameObjects.Image;
    private bowlLeft!: Phaser.GameObjects.Image;
    private bowlRight!: Phaser.GameObjects.Image;
    private allCrystals!: Crystal[];
    private dragging!: boolean;
    private dragStart!: {x: number, y: number};
    private microscope!: Phaser.GameObjects.Image;
    private threeScene!: THREE.Scene;
    private threeCamera!: THREE.PerspectiveCamera;

    // Constructor
    constructor() {
        super({
            key: 'Game'
        });
    }

    // Creates all objects of this scene
    create(): void {

        // initialize parameters
        this.dragging = false;
        this.dragStart = {x: 0, y: 0};

        // set up the 2D world (background table, bowls etc...)
        this.setup2DWorld();

        // set up the THREE canvas and scene (3D world)
        this.setupThree();

        // create the crystals
        this.createCrystals();

        // Add click event listeners
        this.addClickEventListeners();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

    }

    setup2DWorld(): void {

        // scene setup (background, table, etc,...)
        this.add.image(0, 0, 'floor').setOrigin(0);
        this.add.image(0, 0, 'table').setOrigin(0);
        this.add.rectangle(0, gameOptions.gameHeight, gameOptions.gameWidth, 0.2 * gameOptions.gameHeight, 0x333399).setOrigin(0, 1);
        this.head = this.add.image(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 0.82, 'head', 0);

        this.bowlLeft = this.add.sprite(gameOptions.gameWidth * 0.17, gameOptions.gameHeight * 0.53, 'bowlLeft').setInteractive();
        this.bowlRight = this.add.sprite(gameOptions.gameWidth * 0.85, gameOptions.gameHeight * 0.53, 'bowlRight').setInteractive();

        const microscopeSpace = 0.03;
        this.microscope = this.add.sprite(gameOptions.gameWidth * (1 - microscopeSpace), gameOptions.gameWidth * microscopeSpace, 'microscope').setOrigin(1, 0).setInteractive();
        this.microscope.setVisible(false);          // make microscope invisible

    }

    // Create the three canvas and scene
    setupThree() {

        // get the three canvas
        const threeCanvas = document.getElementById('threeCanvas') as HTMLCanvasElement;

        // set the style and size
        threeCanvas.style.position = 'absolute';        // set absolute position
        threeCanvas.style.top = '0';                    // position it on the top
        threeCanvas.style.left = '0';                   // position it on the left
        threeCanvas.style.margin = '0';                 // remove any margins
        threeCanvas.style.imageRendering = 'pixelated'; // apply the pixelated style for this canvas

        // resize the three canvas to match the game canvas
        this.resizeThreeCanvas();     // resize it for the first time
        this.scale.on('resize', () => {         // update the style of the three canvas to always be on top of the phaser canvas (when phaser canvas is resized)
            this.resizeThreeCanvas();
        },this);

        // create a new THREE scene
        this.threeScene = new THREE.Scene();

        // create a renderer
        const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
            canvas: threeCanvas,
            antialias: true
        });
        renderer.autoClear = false;             // if this is true, the three.js renderer will clear everything (all things rendered by Phaser) before it renders the three.js objects

        // add a camera
        this.threeCamera = new THREE.PerspectiveCamera(45, gameOptions.gameWidth / gameOptions.gameHeight, 1, 100);
        this.threeCamera.position.set(0, 0, 10);

        //create an external game object, add it to the Phaser scene and ensure it is rendered together with the other objects in the game loop
        const view = this.add.extern();

        // @ts-expect-error
        view.render = () => {
            renderer.state.reset();
            renderer.render(this.threeScene, this.threeCamera);
        }

    }

    // Resize THREE canvas
    resizeThreeCanvas() {

        // get the canvas
        const threeCanvas = document.getElementById('threeCanvas') as HTMLCanvasElement;
        const phaserCanvas = document.getElementById('phaserCanvas') as HTMLCanvasElement;

        // resize the canvas to match the phaser canvas (be on top of it)
        threeCanvas.style.width = phaserCanvas.style.width;                  // adapt width
        threeCanvas.style.height = phaserCanvas.style.height;                // adapt height
        threeCanvas.style.marginLeft = phaserCanvas.style.marginLeft;        // adapt margin
        threeCanvas.style.marginTop = phaserCanvas.style.marginTop;           // adapt margin

    }

    // Create the crystals
    createCrystals() {

        // create the crystals
        this.allCrystals = [];

        let x = gameOptions.crystalTableStart.x;
        let y = gameOptions.crystalTableStart.y;

        for (let i = 0; i < gameOptions.numberOfCrystals; i++) {

            if (i > 0) {
                x += gameOptions.crystalTableDistance;
            }

            if (x > 1 - gameOptions.crystalTableStart.x) {
                x = gameOptions.crystalTableStart.x;
                y += gameOptions.crystalTableDistance;
            }

            this.allCrystals.push(new Crystal(this.threeScene, this, this.threeCamera, x, y));
        }

    }

    // Add click event listeners
    addClickEventListeners() {

        // Bowl clicks
        this.bowlLeft.on('pointerdown', function(this: GameScene) {
            console.log('Left bowl was clicked!');      // TODO: Add proper function
            this.head.setFrame(0);
        }, this);

        this.bowlRight.on('pointerdown', function(this: GameScene) {
            console.log('Right bowl was clicked!');      // TODO: Add proper function
            this.head.setFrame(1);
        }, this);

        // Microscope click
        this.microscope.on('pointerdown', () => {

            // put all crystals (should only be one, as not more than one crystal can be put into the microscope) back on the table
            this.allCrystals.forEach(crystal => {
                if (crystal.location === CrystalLocation.MICROSCOPE) {
                    crystal.putOnTable();
                }
            });

            this.microscope.setVisible(false);        // make microscope invisible

        });

        // Click of the crystal
        this.events.on(Clicks.CRYSTAL, (crystal: Crystal) => {

            // put the crystal in the microscope
            if (!this.getOpenCrystal()) {        // check if one crystal is in the microscope ("undefined" is false in javascript, which means that if there is no crystal in the microscope, the condition is true)
                crystal.putInMicroscope();
                this.microscope.setVisible(true);        // make microscope visible
            }

        });

        // Dragging of the crystal
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {

            if (this.getOpenCrystal()) {
                this.dragging = true;
                this.dragStart.x = pointer.x;       // save the start position of the drag
                this.dragStart.y = pointer.y;
            }

        });

        this.input.on('pointerup', () => {
                this.dragging = false;              // stop dragging when the pointer is released
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {

            if (this.dragging && !pointer.noButtonDown()) {                          // not sure if !pointer.noButtonDown() is necessary (comes from this example: https://labs.phaser.io/view.html?src=src/input/pointer/pointer%20buttons.js)

                // get the crystal in the microscope
                const crystal = this.getOpenCrystal();

                // rotate the crystal           // TODO: Dragging feels strange... Not sure if function is correct...
                if (crystal) {
                    crystal.rotate((pointer.y - this.dragStart.y) / gameOptions.gameWidth * gameOptions.dragSensitivity, (pointer.x - this.dragStart.x) / gameOptions.gameWidth * gameOptions.dragSensitivity);
                }

            }

        });

    }

    // get crystal in microscope, returns undefined in case there is no crystal in the microscope
    getOpenCrystal(): Crystal | undefined {
        return this.allCrystals.find(crystal => crystal.location === CrystalLocation.MICROSCOPE);    // get the first crystal in the microscope
    }


}