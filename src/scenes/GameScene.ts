import Phaser from 'phaser';
import * as THREE from 'three';

import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";
import {CrystalData} from "../helper/types";

// "Game" scene: Scene for the main game
export default class GameScene extends Phaser.Scene {

    private head!: Phaser.GameObjects.Image;
    private bowlLeft!: Phaser.GameObjects.Image;
    private bowlRight!: Phaser.GameObjects.Image;
    private theCrystal!: Crystal;  // TODO: Remove later, just for testing
    private crystal3D!: THREE.Mesh;
    private crystal3Dlines!: THREE.LineSegments;

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
        //this.theCrystal = this.add.existing(new Crystal(this));

        // Create 3D crystal
        this.createCrystal();

        // Add keyboard inputs
        this.addKeys();

        this.scale.on('resize', () => {



        },this);

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        //this.theCrystal.update();

    }

    // Add keyboard input to the scene.
    addKeys(): void {

        const rotationAngle = Math.PI/8;

        const yAxis = new THREE.Vector3(0, 1, 0);
        const xAxis = new THREE.Vector3(1, 0, 0);

        // up and down keys (moving the selection of the entries)
        this.input.keyboard!.addKey('Left').on('down', function(this: GameScene) {

            this.crystal3D.rotateOnWorldAxis(yAxis, -rotationAngle);            // rotate around the world axis (if the object is directly rotated, the axis of the object will also be rotated)
            this.crystal3Dlines.rotateOnWorldAxis(yAxis, -rotationAngle);

        }, this);
        this.input.keyboard!.addKey('Right').on('down', function(this: GameScene) {

            this.crystal3D.rotateOnWorldAxis(yAxis, rotationAngle);
            this.crystal3Dlines.rotateOnWorldAxis(yAxis, rotationAngle);

        }, this);
        this.input.keyboard!.addKey('Up').on('down', function(this: GameScene) {

            this.crystal3D.rotateOnWorldAxis(xAxis, -rotationAngle);
            this.crystal3Dlines.rotateOnWorldAxis(xAxis, -rotationAngle);

        }, this);
        this.input.keyboard!.addKey('Down').on('down', function(this: GameScene) {

            this.crystal3D.rotateOnWorldAxis(xAxis, rotationAngle);
            this.crystal3Dlines.rotateOnWorldAxis(xAxis, rotationAngle);

        }, this);

    }

    // Create 3D crystal
    createCrystal() {

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

        this.resizeThreeCanvas('threeCanvas');  // resize it for the first time

        // update the style of the three canvas to always be on top of the phaser canvas (when phaser canvas is resized)
        this.scale.on('resize', () => {this.resizeThreeCanvas('threeCanvas')},this);

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

        const points = this.triangulate();

        const verticesOfCube = new Float32Array([
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  -1.0,
            1.0, -1.0,  -1.0,
            1.0,  1.0,  -1.0,
            -1.0,  1.0,  -1.0,
        ]);

        const indicesOfFaces = [
            0, 1, 2,        // front side
            0, 2, 3,
            4, 6, 5,        // back side
            4, 7, 6,
            0, 3, 7,        // left side
            0, 7, 4,
            1, 6, 2,        // right side
            1, 5, 6,
            3, 2, 6,        // top side
            3, 6, 7,
            0, 4, 5,        // bottom side
            0, 5, 1

        ];

        const geometry = new THREE.BufferGeometry();

        geometry.setIndex(indicesOfFaces);
        geometry.setAttribute('position', new THREE.BufferAttribute(verticesOfCube, 3));

        const material = new THREE.MeshBasicMaterial({
            color: 0x44aa88,
            opacity: 0.8,
            transparent: true,
            side: THREE.FrontSide
        });
        this.crystal3D = new THREE.Mesh(geometry, material);
        threeScene.add(this.crystal3D);

        // add edges
        const edges = new THREE.EdgesGeometry(geometry);
        this.crystal3Dlines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0xffffff}));
        threeScene.add(this.crystal3Dlines);

        //create an external game object, add it to the Phaser scene and ensure it is rendered together with the other objects in the game loop
        const view = this.add.extern();

        // @ts-expect-error
        view.render = () => {
             renderer.state.reset();
             renderer.render(threeScene, camera);
        }

    }

    // Resize three canvas
    resizeThreeCanvas(threeCanvasId:string) {

        // get the canvas
        const threeCanvas = document.getElementById(threeCanvasId) as HTMLCanvasElement;
        const phaserCanvas = this.sys.canvas;

        // resize the canvas to match the phaser canvas (be on top of it)
        threeCanvas.style.width = phaserCanvas.style.width;                  // adapt width
        threeCanvas.style.height = phaserCanvas.style.height;                // adapt height
        threeCanvas.style.marginLeft = phaserCanvas.style.marginLeft;        // adapt margin

    }

    // Triangulate crystal faces by fan triangulation (pre-condition: All faces are convex polygons!)
    triangulate() {

        const crystal: CrystalData = this.cache.json.get('simpleShape');

        const vertices: number[] = crystal.vertices.flat();
        const faceIndices: number[] = [];

        for (let f = 0; f < crystal.faceIndices.length; f++) {          // go through each face (index: f)

            for (let t = 0; t < crystal.faceIndices[f].length - 2; t++) {   // create triangles using fan triangulation (number of traingles = number of vertices - 2)

                faceIndices.push(
                    crystal.faceIndices[f][0],          // start point of the triangle is always the first vertex
                    crystal.faceIndices[f][t+1],
                    crystal.faceIndices[f][t+2]
                );

            }

        }

        return {
            vertices: vertices,
            faceIndices: faceIndices
        }

    }

}