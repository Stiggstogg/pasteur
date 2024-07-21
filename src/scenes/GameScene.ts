import Phaser from 'phaser';
import * as THREE from 'three';

import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";
import {Clicks, CrystalEnantiomer, CrystalLocation} from "../helper/types";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private head!: Phaser.GameObjects.Image;                // TODO: Implement that the head changes based on the %ee values
    private bowlLeft!: Phaser.GameObjects.Image;
    private bowlRight!: Phaser.GameObjects.Image;
    private eeLeft!: number;                                 // %ee value in the left bowl
    private eeRight!: number;                                // %ee value in the right bowl
    private eeLeftText!: Phaser.GameObjects.BitmapText;     // text which shows the ee value in the left bowl
    private eeRightText!: Phaser.GameObjects.BitmapText;    // text which shows the ee value in the right bowl
    private allCrystals!: Crystal[];                        // all crystals in the game
    private dragging!: boolean;                             // is the crystal currently dragged?
    private previousPointerPos!: Phaser.Math.Vector2;       // previous pointer position (from last frame)
    private microscope!: Phaser.GameObjects.Image;
    private threeRenderer!: THREE.WebGLRenderer;
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
        this.previousPointerPos = new Phaser.Math.Vector2();
        this.eeLeft = 0;
        this.eeRight = 0;

        // set up the 2D world (background table, bowls etc...)
        this.setup2DWorld();

        // set up texts
        this.setupTexts();

        // set up the THREE canvas and scene (3D world)
        this.setupThree();

        // create the crystals
        this.createCrystals();

        // Add click event listeners
        this.addClickEventListeners();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        // rotate the crystal when dragging is activated
        if (this.dragging && !this.input.activePointer.noButtonDown()) {                          // not sure if !this.input.activePointer.noButtonDown() is necessary (comes from this example: https://labs.phaser.io/view.html?src=src/input/pointer/pointer%20buttons.js)

            // get the crystal in the microscope
            const crystal = this.getOpenCrystal();

            // rotate the crystal
            if (crystal) {

                const currentPointerPos = new Phaser.Math.Vector2(this.input.activePointer.position.x, this.input.activePointer.position.y);

                // rotate the crystal based on the difference between the previous pointer position and the current pointer position
                crystal.rotate((currentPointerPos.y - this.previousPointerPos.y) / gameOptions.gameWidth * gameOptions.dragSensitivity, (currentPointerPos.x - this.previousPointerPos.x) / gameOptions.gameWidth * gameOptions.dragSensitivity);

                // save the current pointer position as previous pointer position (for next frame)
                this.previousPointerPos = currentPointerPos;

            }

        }

    }

    setup2DWorld(): void {

        // scene setup (background, table, etc,...)
        this.add.image(0, 0, 'floor').setOrigin(0);
        this.add.image(0, 0, 'table').setOrigin(0);
        this.add.rectangle(0, gameOptions.gameHeight, gameOptions.gameWidth, 0.2 * gameOptions.gameHeight, 0x333399).setOrigin(0, 1);
        this.head = this.add.image(gameOptions.gameWidth * 0.5, gameOptions.gameHeight * 0.82, 'head', 0);

        this.bowlLeft = this.add.sprite(gameOptions.gameWidth * gameOptions.bowlLeftPosition.x, gameOptions.gameHeight * gameOptions.bowlLeftPosition.y, 'bowlLeft').setInteractive();
        this.bowlRight = this.add.sprite(gameOptions.gameWidth * gameOptions.bowlRightPosition.x, gameOptions.gameHeight * gameOptions.bowlRightPosition.y, 'bowlRight').setInteractive();

        const microscopeSpace = 0.03;
        this.microscope = this.add.sprite(gameOptions.gameWidth * (1 - microscopeSpace), gameOptions.gameWidth * microscopeSpace, 'microscope').setOrigin(1, 0).setInteractive();
        this.microscope.setVisible(false);          // make microscope invisible

    }

    // set up texts
    setupTexts() {

        // %ee descriptions for bowls
        const eeHeight = 0.86;
        this.add.bitmapText(this.bowlLeft.x, gameOptions.gameHeight * eeHeight, 'minogram', '%ee', 20).setOrigin(0.5);
        this.add.bitmapText(this.bowlRight.x, gameOptions.gameHeight * eeHeight, 'minogram', '%ee', 20).setOrigin(0.5);

        // %ee values for bowls
        const valueHeight = eeHeight + 0.09;
        this.eeLeftText = this.add.bitmapText(this.bowlLeft.x, gameOptions.gameHeight * valueHeight, 'minogram', this.eeLeft.toFixed(), 20).setOrigin(0.5);
        this.eeRightText = this.add.bitmapText(this.bowlRight.x, gameOptions.gameHeight * valueHeight, 'minogram', this.eeRight.toFixed(), 20).setOrigin(0.5);

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
        this.threeRenderer = new THREE.WebGLRenderer({
            canvas: threeCanvas,
            antialias: true
        });
        this.threeRenderer.autoClear = false;             // if this is true, the three.js renderer will clear everything (all things rendered by Phaser) before it renders the three.js objects

        // add a camera
        this.threeCamera = new THREE.PerspectiveCamera(45, gameOptions.gameWidth / gameOptions.gameHeight, 1, 100);
        this.threeCamera.position.set(0, 0, 10);

        //create an external game object, add it to the Phaser scene and ensure it is rendered together with the other objects in the game loop
        const view = this.add.extern();

        // @ts-expect-error
        view.render = () => {
            this.threeRenderer.state.reset();
            this.threeRenderer.render(this.threeScene, this.threeCamera);
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
            this.putInBowl(CrystalLocation.BOWLLEFT);
        }, this);

        this.bowlRight.on('pointerdown', function(this: GameScene) {
            this.putInBowl(CrystalLocation.BOWLRIGHT);
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
                this.dragging = true;                               // start dragging
                this.previousPointerPos.x = pointer.position.x;       // save the initial position of the pointer as previous pointer position
                this.previousPointerPos.y = pointer.position.y;
            }

        });

        this.input.on('pointerup', () => {
                this.dragging = false;              // stop dragging when the pointer is released
        });

    }

    // get crystal in microscope, returns undefined in case there is no crystal in the microscope
    getOpenCrystal(): Crystal | undefined {
        return this.allCrystals.find(crystal => crystal.location === CrystalLocation.MICROSCOPE);    // get the first crystal in the microscope
    }

    // caluculate the %ee values in the bowls and set the texts
    calculateEEInBowls(): void {

        // get the crystals in the bowls
        const crystalsLeft = this.allCrystals.filter(crystal => crystal.location === CrystalLocation.BOWLLEFT);
        const crystalsRight = this.allCrystals.filter(crystal => crystal.location === CrystalLocation.BOWLRIGHT);

        // calculate the %ee and update the texts
        this.eeLeft = this.calculateEEValue(crystalsLeft);
        this.eeRight = this.calculateEEValue(crystalsRight);
        this.eeLeftText.setText(this.eeLeft.toFixed());
        this.eeRightText.setText(this.eeRight.toFixed());

    }

    // calculate the %ee value
    calculateEEValue(crystals: Crystal[]): number {

        // get enantiomeres
        const enantiomersR = crystals.filter(crystal => crystal.enantiomer === CrystalEnantiomer.R);
        const enantiomersS = crystals.filter(crystal => crystal.enantiomer === CrystalEnantiomer.S);

        // get the total weights of enantiomeres
        const weightR = enantiomersR.reduce((accumulator, crystal) => accumulator + crystal.weight, 0);
        const weightS = enantiomersS.reduce((accumulator, crystal) => accumulator + crystal.weight, 0);

        // calculate the %ee value based on the weights of the enantiomeres
        const ee = Math.abs(weightR - weightS) / (weightR + weightS) * 100;

        if (isNaN(ee)) {
            return 0;
        }
        else {
            return ee;
        }

    }

    // put crystal in a bowl
    putInBowl(location: CrystalLocation): void {

        const openCrystal = this.getOpenCrystal();

        if (openCrystal) {

            openCrystal.putInBowl(location);
            this.calculateEEInBowls();

        }

        this.microscope.setVisible(false);        // make microscope invisible

        // check if game is finished
        if (this.allCrystals.every(crystal => crystal.location === CrystalLocation.BOWLLEFT || crystal.location === CrystalLocation.BOWLRIGHT)) {

            // create a dummy cube to hide the crystals (for some strange reason the crystals are still visible after the scene is changed).
            // As soon as all crystals are disposed from the scene and the scene is rendered one last time, the crystals are still visible,
            // for some strange reason the scene does not rerender when there are no visible objects in it anymore.
            // Adding an invisible dummy object (and then also dispose it after the last render) solves that.
            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0,  transparent: true} ); // transparent cube with opacity 0 --> not visible
            const cube = new THREE.Mesh( geometry, material );
            this.threeScene.add(cube);

            // dispose all crystals
            this.allCrystals.forEach(crystal => crystal.dispose());

            this.threeRenderer.render(this.threeScene, this.threeCamera);     // render the scene one last time

            // dispose the dummy cube
            material.dispose();
            geometry.dispose();
            this.threeScene.remove(cube);

            // change the scene
            this.scene.start('Win', {leftBowlEE: this.eeLeft, rightBowlEE: this.eeRight});

        }

    }

}