import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {CrystalData, CrystalEnantiomer, CrystalLocation} from "../helper/types";

// Crystal class
export default class Crystal extends Phaser.GameObjects.Container {

    private weight: number;                             // weight of the crystal (and basically also size)
    private enantiomer: CrystalEnantiomer               // crystal enantiomer (R or S)
    private location: CrystalLocation;                  // where is the crystal currently (table, microscope or in a bowl)
    private rotX: number;                               // rotation of the crystal around the x axis in radians
    private rotY: number;                               // rotation of the crystal around the y axis in radians
    private nodesAndFaces: CrystalData;                 // data of the basic crystal with all nodes and faces

    // Constructor
    constructor(scene: Phaser.Scene) {

        super(scene);

        // get the initial values for the crystal (random)
        this.weight = Phaser.Math.RND.realInRange(gameOptions.weightRange.min, gameOptions.weightRange.max);
        this.enantiomer = Phaser.Math.RND.pick([CrystalEnantiomer.R, CrystalEnantiomer.S]);
        this.x = Phaser.Math.RND.realInRange(gameOptions.tableRange.minX * gameOptions.gameWidth, gameOptions.tableRange.maxX * gameOptions.gameWidth);
        this.y = Phaser.Math.RND.realInRange(gameOptions.tableRange.minY * gameOptions.gameHeight, gameOptions.tableRange.maxY * gameOptions.gameHeight);
        this.rotX = Phaser.Math.RND.rotation();
        this.rotY = Phaser.Math.RND.rotation();

        // get the basic crystal data
        this.nodesAndFaces = scene.cache.json.get('nodesAndFaces');

        // place the crystal on the table
        this.location = CrystalLocation.TABLE;

        // initial setup of the faces
        this.initialFacesSetup();       // initial setup
        this.updateFaces();             // update them

        // Create crystal (one graphics object for each face of the crystal)

    }

    // create one face of the crystal and add it to the container
    updateFaces() {

        for (let i = 0; i < this.nodesAndFaces.faceNodes.length; i++) {

            let face = this.getAt(i) as Phaser.GameObjects.Graphics;    // get current face graphics (needs to be done like that otherwise you get some Typescript errors
            let faceNodes = this.nodesAndFaces.faceNodes[i];        // get all phase nodes of this face

            face.beginPath();

            for (let j = 0; j < faceNodes.length; j++) {

                let coordinateX = this.nodesAndFaces.coordinatesNodes[faceNodes[j]][0] * gameOptions.tableCrystalSize;  // get x coordinate of node
                let coordinateY = this.nodesAndFaces.coordinatesNodes[faceNodes[j]][1] * gameOptions.tableCrystalSize;  // get y coordinate of node

                if (j == 0) {
                    face.moveTo(coordinateX, coordinateY);  // first node
                }
                else {
                    face.lineTo(coordinateX, coordinateY);  // all other nodes
                }

            }

            face.closePath();
            face.strokePath();
            face.fillPath();

        }

    }

    // initial setup of the faces (create empty graphics objects with options and add them to the container)
    initialFacesSetup() {

        for (let i = 0; i < this.nodesAndFaces.faceNodes.length; i++) {

            const face = this.scene.add.graphics();

            // set the style of the graphic object
            face.lineStyle(gameOptions.lineWidth, gameOptions.lineColor, gameOptions.lineAlpha);
            face.fillStyle(gameOptions.faceColor, gameOptions.faceAlpha);

            this.add(face);     // add the graphics to the container

        }

    }

}

