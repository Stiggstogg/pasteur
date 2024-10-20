import Phaser from 'phaser';
import * as THREE from 'three';

import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";
import {Clicks, CrystalEnantiomer, CrystalLocation} from "../helper/types";

// Basic game scene which contains all the basic elements used for the main game scene and the tutorial scene
export default class BasicGameScene extends Phaser.Scene {

    private head!: Phaser.GameObjects.Image;
    protected bowlLeft!: Phaser.GameObjects.Image;
    protected bowlRight!: Phaser.GameObjects.Image;
    protected eeLeft!: number;                                 // %ee value in the left bowl
    protected eeRight!: number;                                // %ee value in the right bowl
    private averageEE!: number;                             // average %ee value of the two bowls
    private eeLeftText!: Phaser.GameObjects.BitmapText;     // text which shows the ee value in the left bowl
    private eeRightText!: Phaser.GameObjects.BitmapText;    // text which shows the ee value in the right bowl
    protected allCrystals!: Crystal[];                        // all crystals in the game
    private dragging!: boolean;                             // is the crystal currently dragged?
    private previousPointerPos!: Phaser.Math.Vector2;       // previous pointer position (from last frame)
    protected microscope!: Phaser.GameObjects.Image;
    private threeRenderer!: THREE.WebGLRenderer;
    protected threeScene!: THREE.Scene;
    protected threeCamera!: THREE.PerspectiveCamera;
    protected startTime!: number;                             // start time of the game (when the first crystal was clicked
    protected elapsedTime!: number;                           // elapsed time of the game (time since the first crystal was clicked)
    private elapsedTimeText!: Phaser.GameObjects.BitmapText; // text which shows the elapsed time
    protected timerRunning!: boolean;                         // is the timer running?
    private keyW!: Phaser.Input.Keyboard.Key;               // key W
    private keyA!: Phaser.Input.Keyboard.Key;               // key A
    private keyS!: Phaser.Input.Keyboard.Key;               // key S
    private keyD!: Phaser.Input.Keyboard.Key;               // key D
    private keyUp!: Phaser.Input.Keyboard.Key;              // key Up arrow
    private keyLeft!: Phaser.Input.Keyboard.Key;            // key Left arrow
    private keyDown!: Phaser.Input.Keyboard.Key;            // key Down arrow
    private keyRight!: Phaser.Input.Keyboard.Key;           // key Right arrow
    private readonly soundtrackKey: string;                 // key of the soundtrack
    protected soundtrack!: Phaser.Sound.WebAudioSound;        // soundtrack of the game

    // Constructor
    constructor(key: string, musicKey: string) {
        super({
            key: key
        });

        this.soundtrackKey = musicKey;

    }

    // Creates all objects of this scene
    create(): void {

        // fade in and start the music
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);
        this.startMusic();

        // initialize parameters
        this.dragging = false;
        this.previousPointerPos = new Phaser.Math.Vector2();
        this.eeLeft = 0;
        this.eeRight = 0;
        this.averageEE = 0;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerRunning = false;

        // create an empty array for the crystals
        this.allCrystals = [];

        // set up the 2D world (background table, bowls etc...)
        this.setup2DWorld();

        // set up texts
        this.setupTexts();

        // set up the THREE canvas and scene (3D world)
        this.setupThree();

        // add keyboard inputs
        this.addKeys();

        // Add click event listeners
        this.addClickEventListeners();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        // get the crystal in the microscope
        const crystal = this.getOpenCrystal();

        if (crystal) {      // check if a crystal is open (in the microscope)

            // rotate the crystal when dragging is activated
            if (this.dragging && !this.input.activePointer.noButtonDown()) {                          // not sure if !this.input.activePointer.noButtonDown() is necessary (comes from this example: https://labs.phaser.io/view.html?src=src/input/pointer/pointer%20buttons.js)


                // rotate the crystal
                const currentPointerPos = new Phaser.Math.Vector2(this.input.activePointer.position.x, this.input.activePointer.position.y);

                // rotate the crystal based on the difference between the previous pointer position and the current pointer position
                crystal.rotate((currentPointerPos.y - this.previousPointerPos.y) / gameOptions.gameWidth * gameOptions.dragSensitivity, (currentPointerPos.x - this.previousPointerPos.x) / gameOptions.gameWidth * gameOptions.dragSensitivity);

                // save the current pointer position as previous pointer position (for next frame)
                this.previousPointerPos = currentPointerPos;

            }

            // rotate the crystal when arrow keys are pressed
            let keyRotationX = 0;
            let keyRotationY = 0

            if (this.keyW.isDown || this.keyUp.isDown) {
                keyRotationX += -1;
            }
            if (this.keyS.isDown || this.keyDown.isDown) {
                keyRotationX += 1;
            }
            if (this.keyA.isDown || this.keyLeft.isDown) {
                keyRotationY += -1;
            }
            if (this.keyD.isDown || this.keyRight.isDown) {
                keyRotationY += +1;
            }

            crystal.rotate(keyRotationX * gameOptions.keyboardRotationSpeed, keyRotationY * gameOptions.keyboardRotationSpeed);

        }

        // update the elapsed time if the timer is running and set the text
        if (this.timerRunning) {
            this.elapsedTime = Date.now() - this.startTime;
            this.elapsedTimeText.setText(this.formatTime(Math.floor(this.elapsedTime)));
        }

    }

    setup2DWorld() {

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
        this.eeLeftText = this.add.bitmapText(this.bowlLeft.x, gameOptions.gameHeight * valueHeight, 'minogram', '-', 20).setOrigin(0.5);
        this.eeRightText = this.add.bitmapText(this.bowlRight.x, gameOptions.gameHeight * valueHeight, 'minogram', '-', 20).setOrigin(0.5);

        // time text
        const distanceMid = 0.08;
        const timeY = (eeHeight + valueHeight) / 2;
        this.add.bitmapText(gameOptions.gameWidth * (0.5 - distanceMid), gameOptions.gameHeight * timeY, 'minogram', 'TIME', 20).setOrigin(1, 0.5);
        this.elapsedTimeText = this.add.bitmapText(gameOptions.gameWidth * (0.5 + distanceMid), gameOptions.gameHeight * timeY, 'minogram', '00:00', 20).setOrigin(0, 0.5);

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

    // Create and add a single crystal
    createCrystals(numberOfCrystals: number, enantiomerSequence?: CrystalEnantiomer[]) {

        let x = gameOptions.crystalTableStart.x;
        let y = gameOptions.crystalTableStart.y;

        let enantiomer: CrystalEnantiomer | undefined = undefined;

        for (let i = 0; i < numberOfCrystals; i++) {

            if (i > 0) {
                x += gameOptions.crystalTableDistance;
            }

            if (x > 1 - gameOptions.crystalTableStart.x) {
                x = gameOptions.crystalTableStart.x;
                y += gameOptions.crystalTableDistance;
            }

            if (enantiomerSequence !== undefined && enantiomerSequence !== null) {
                enantiomer = enantiomerSequence[i];
            }

            this.allCrystals.push(new Crystal(this.threeScene, this, this.threeCamera, x, y, undefined, enantiomer));
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

    // add keyboard inputs
    addKeys() {

        // add keys (to rotate the crystals)
        this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.keyUp = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyLeft = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyDown = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyRight = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // add keys to pickup and put down crystals
        const keySpace = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);         // take next crystal and drop it again
        const keyG = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.G);                 // key to put the crystal in the left bowl
        const keyH = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H);                 // key to put the crystal in the right bowl

        keySpace.on('down', () => {
            const crystal = this.getOpenCrystal();
            if (crystal) {
                crystal.putOnTable();                       // put the crystal back on the table
                this.microscope.setVisible(false);          // make microscope invisible
            }
            else {
                const nextCrystal = this.allCrystals.find(crystal => crystal.location === CrystalLocation.TABLE);
                if (nextCrystal) {
                    this.events.emit(Clicks.CRYSTAL, nextCrystal);        // emit the click event for the next crystal
                }
            }
        });
        
        keyG.on('down', () => {
            this.putInBowl(CrystalLocation.BOWLLEFT);
        });
        
        keyH.on('down', () => {
            this.putInBowl(CrystalLocation.BOWLRIGHT);
        });

    }

    // Add click event listeners
    addClickEventListeners() {

        // Bowl clicks
        this.bowlLeft.on('pointerdown', () => {
            this.events.emit(Clicks.BOWLLEFT);          // emit event (used for tutorial)
            this.putInBowl(CrystalLocation.BOWLLEFT);
        });

        this.bowlRight.on('pointerdown', () => {
            this.events.emit(Clicks.BOWLRIGHT);          // emit event (used for tutorial)
            this.putInBowl(CrystalLocation.BOWLRIGHT);
        });

        // Microscope click
        this.microscope.on('pointerdown', () => {
            this.events.emit(Clicks.MICROSCOPE);
            this.putBackOnTable();
        });

        // Click of the crystal
        this.events.on(Clicks.CRYSTAL, (crystal: Crystal) => {
            this.putInMicroscope(crystal);
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

    // get crystals in bowl
    getCrystalInBowl(bowl: CrystalLocation): Crystal[] {
        return this.allCrystals.filter(crystal => crystal.location === bowl);
    }

    // calculate the %ee values in the bowls, set the texts and calculate the average %ee value
    calculateEEInBowls(): void {

        // get the crystals in the bowls
        const crystalsLeft = this.getCrystalInBowl(CrystalLocation.BOWLLEFT);
        const crystalsRight = this.getCrystalInBowl(CrystalLocation.BOWLRIGHT);

        // calculate the %ee and update the texts
        this.eeLeft = this.calculateEEValue(crystalsLeft);
        this.eeRight = this.calculateEEValue(crystalsRight);

        if (crystalsLeft.length > 0) {                  // only set the text to the value if there are crystals in the bowl
            this.eeLeftText.setText(this.eeLeft.toFixed());
        }
        else {
            this.eeLeftText.setText('-');
        }

        if (crystalsRight.length > 0) {                  // only set the text to the value if there are crystals in the bowl
            this.eeRightText.setText(this.eeRight.toFixed());
        }
        else {
            this.eeRightText.setText('-');
        }

        // calculate the average %ee value
        this.averageEE = this.calculateAverageEEValue(crystalsLeft, crystalsRight);

    }

    // calculate the %ee value from a group of crystals
    calculateEEValue(crystals: Crystal[]): number {

        // get enantiomers
        const enantiomersR = crystals.filter(crystal => crystal.enantiomer === CrystalEnantiomer.R);
        const enantiomersS = crystals.filter(crystal => crystal.enantiomer === CrystalEnantiomer.S);

        // get the total weights of enantiomers
        const weightR = enantiomersR.reduce((accumulator, crystal) => accumulator + crystal.weight, 0);
        const weightS = enantiomersS.reduce((accumulator, crystal) => accumulator + crystal.weight, 0);

        // calculate the %ee value based on the weights of the enantiomers
        const ee = Math.abs(weightR - weightS) / (weightR + weightS) * 100;

        if (isNaN(ee)) {
            return 0;
        }
        else {
            return ee;
        }

    }

    // calculate the weighted average %ee value of the crystals in the left and right bowl
    calculateAverageEEValue(crystalsLeft: Crystal[], crystalsRight: Crystal[]): number {

        // get the total weights of the crystals in the bowls
        const weightLeft = crystalsLeft.reduce((accumulator, crystal) => accumulator + crystal.weight, 0);
        const weightRight = crystalsRight.reduce((accumulator, crystal) => accumulator + crystal.weight, 0);

        // calculate the weighted average %ee value
        const averageEE = (this.eeLeft * weightLeft + this.eeRight * weightRight) / (weightLeft + weightRight);

        // set the averageEE value (set it to 0 if it is NaN, e.g. when no crystals are yet in the bowls)
        if (isNaN(averageEE)) {
            return 0;
        }
        else {
            return averageEE;
        }

    }

    // put crystal in a bowl
    putInBowl(location: CrystalLocation): void {

        const openCrystal = this.getOpenCrystal();

        if (openCrystal) {

            const previousAverageEE = this.averageEE;        // save the previous average %ee value

            openCrystal.putInBowl(location);        // put the crystal in the bowl
            this.calculateEEInBowls();              // calculate the %ee values in the bowls and the average %ee value

            // shake the camera in case the average EE got lower
            // --------------------------------------------------
            if (this.averageEE < previousAverageEE) {
                this.cameras.main.shake(gameOptions.shakeDuration, gameOptions.shakeIntensity);
            }

            // change the head based on the average ee and play a sound if the head is changed
            // --------------------------------------------------------------------------------

            // check if compared to the previous average EE a change in the face expression should happen (if the average got over a limit
            let change = false;

            if (this.averageEE >= gameOptions.happyFaceLimit && previousAverageEE < gameOptions.happyFaceLimit) {       // check if the average %ee is higher than the happy face limit and the previous average %ee was lower
                change = true;
            }
            else if (this.averageEE <= gameOptions.sadFaceLimit && previousAverageEE > gameOptions.sadFaceLimit) {      // check if the average %ee is lower than the sad face limit and the previous average %ee was higher
                change = true;
            }
            else if (this.averageEE < gameOptions.happyFaceLimit && this.averageEE > gameOptions.sadFaceLimit && (previousAverageEE >= gameOptions.happyFaceLimit || previousAverageEE <= gameOptions.sadFaceLimit)) {  // check if the average %ee is between the happy and sad face limit and the previous average %ee was either higher than the happy face limit or lower than the sad face limit
                change = true;
            }

            const crystalsInBowl = this.getCrystalInBowl(CrystalLocation.BOWLLEFT).length + this.getCrystalInBowl(CrystalLocation.BOWLRIGHT).length;

            if (crystalsInBowl >= 2) {                                                                          // only change the face when there are two or more crystals in the bowls
                if (this.averageEE >= gameOptions.happyFaceLimit && (change || crystalsInBowl === 2)) {       // check if the average %ee is higher than the happy face limit and the face should be changed (or if there are only two crystals in the bowls)
                    this.head.setFrame(2);            // change the head to the happy face
                    this.sound.playAudioSprite('pasteurVoice', 'happy');     // play the sound
                }
                else if (this.averageEE <= gameOptions.sadFaceLimit && (change || crystalsInBowl === 2)) {      // check if the average %ee is lower than the sad face limit and the face should be changed (or if there are only two crystals in the bowls)
                    this.head.setFrame(1);            // change the head to the sad face
                    this.sound.playAudioSprite('pasteurVoice', 'sad');     // play the sound
                }
                else if (this.averageEE < gameOptions.happyFaceLimit && change) {                               // check if the average %ee is between the happy and sad face limit and the face should be changed, here the face should not be changed if there are two crystals in the bow, as the face always starts neutral
                    this.head.setFrame(0);            // change the head to the neutral face
                    this.sound.playAudioSprite('pasteurVoice', 'neutral');     // play the sound
                }
            }

            // sound effects
            let pan = 0;
            if (location === CrystalLocation.BOWLLEFT) {        // pan the sound either to the left or right depending on the bowl to which it is put in
                pan = -0.7;
            }
            else {
                pan = 0.7;
            }

            this.sound.playAudioSprite('crystalToBowl', Phaser.Math.RND.pick(['0', '1', '2']), {pan: pan});     // play the sound

        }

        this.microscope.setVisible(false);        // make microscope invisible

    }

    putBackOnTable() {

        // put all crystals (should only be one, as not more than one crystal can be put into the microscope) back on the table
        this.allCrystals.forEach(crystal => {
            if (crystal.location === CrystalLocation.MICROSCOPE) {
                crystal.putOnTable();
            }
        });

        this.microscope.setVisible(false);        // make microscope invisible

        this.sound.playAudioSprite('crystalToTable', Phaser.Math.RND.pick(['0', '1', '2']));     // play the sound

    }

    putInMicroscope(crystal: Crystal) {

        // put the crystal in the microscope
        if (!this.getOpenCrystal()) {        // check if one crystal is in the microscope ("undefined" is false in javascript, which means that if there is no crystal in the microscope, the condition is true)
            crystal.putInMicroscope();
            this.microscope.setVisible(true);        // make microscope visible

            this.sound.playAudioSprite('crystalFromTable', Phaser.Math.RND.pick(['0', '1', '2']));     // play the sound
        }

    }

    // Create a formated output of the time in the format mm:ss
    formatTime(time: number): string {

        // Calculate total minutes and seconds
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);

        // Format minutes and seconds to always have two digits
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        // Return the formatted time string
        return `${formattedMinutes}:${formattedSeconds}`;

    }

    // Calculate the Score
    calculateScore(): number {

        return this.averageEE * (gameOptions.parTime / (this.elapsedTime / 1000)) * gameOptions.scoreMultiplier;

    }

    // start the music
    startMusic() {

        this.soundtrack = this.sound.get(this.soundtrackKey) as Phaser.Sound.WebAudioSound;

        if (this.soundtrack == null) {              // add it to the sound manager if it isn't yet available
            this.soundtrack = this.sound.add(this.soundtrackKey) as Phaser.Sound.WebAudioSound;
        }

        this.soundtrack.play({
            loop: true,
            volume: 0
        });

        // fade in the music
        this.tweens.add({
            targets: this.soundtrack,
            volume: [0, gameOptions.soundtrackVolume],
            duration: gameOptions.fadeInOutTime
        })

    }

    // check if all crystals are sorted
    allCrystalsSorted(): boolean {

        return this.allCrystals.every(crystal => crystal.location === CrystalLocation.BOWLLEFT || crystal.location === CrystalLocation.BOWLRIGHT);

    }

    // Basic cleanup of the scene, before you change to another scene
    cleanupScene() {

        // turn off event listeners
        this.events.off(Clicks.CRYSTAL);
        this.events.off('flipped');

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

    }

}