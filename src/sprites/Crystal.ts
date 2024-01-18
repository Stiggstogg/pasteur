import Phaser from 'phaser';
import gameOptions from '../helper/gameOptions';
import {CrystalData, CrystalEnantiomer, CrystalLocation} from "../helper/types";
import {mat4, vec3} from 'gl-matrix';           // library for coordinate transformations (in this case rotations)

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

    }

    update() {

        super.update();

        this.updateFaces();

    }

    // create one face of the crystal and add it to the container
    private updateFaces() {

        // rotate all nodes
        const coordinatesNodesRotated = this.rotateCoordinates(this.nodesAndFaces.coordinatesNodes, this.rotX, this.rotY, 0);      // get the nodes and rotate the coordinates

        for (let i = 0; i < this.nodesAndFaces.faceNodes.length; i++) {

            let face = this.getAt(i) as Phaser.GameObjects.Graphics;    // get current face graphics (needs to be done like that otherwise you get some Typescript errors
            let faceNodes = this.nodesAndFaces.faceNodes[i];        // get all phase nodes of this face and rotate them

            face.clear();           // clear the graphics object (face)

            // set the style of the line and fill
            face.lineStyle(gameOptions.lineWidth, gameOptions.lineColor, gameOptions.lineAlpha);
            face.fillStyle(gameOptions.faceColor, gameOptions.faceAlpha);

            // begin a path
            face.beginPath();

            // draw a line from one node to the other (in order) for all nodes involved in this face
            for (let j = 0; j < faceNodes.length; j++) {

                let coordinateX = coordinatesNodesRotated[faceNodes[j]][0] * gameOptions.tableCrystalSize;  // get x coordinate of node
                let coordinateY = coordinatesNodesRotated[faceNodes[j]][1] * gameOptions.tableCrystalSize;  // get y coordinate of node

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

    // rotate the crystal
    public rotate(deltaX: number, deltaY: number) {

        this.rotX += deltaX;
        this.rotY += deltaY;

    }

    // initial setup of the faces (create empty graphics objects and add them to the container)
    private initialFacesSetup() {

        for (let i = 0; i < this.nodesAndFaces.faceNodes.length; i++) {

            const face = this.scene.add.graphics();

            this.add(face);     // add the graphics to the container

        }

    }

    // Mathematical function to rotate all nodes coordinates around x, y and z axis
    private rotateCoordinates(coordinates: number[][], angleX: number, angleY: number, angleZ: number): number[][] {

        // gl-matrix library is used for this!

        const rotationMatrix = mat4.create();                               // create an identity matrix, eventhough a 3x3 matrix would be enough we use here a 4x4 (mat4) as this is commonly used for transformations. This would basically also allow for translational
        mat4.rotate(rotationMatrix, rotationMatrix, angleX, [1, 0, 0]);         // rotate the identity matrix around the x-axis (input and output is the same)
        mat4.rotate(rotationMatrix, rotationMatrix, angleY, [0, 1, 0]);         // rotate the previously rotated matrix around the y-axis
        mat4.rotate(rotationMatrix, rotationMatrix, angleZ, [0, 0, 1]);         // rotate the previously rotated matrix around the z-axis

        return coordinates.map((node: number[]) => {                    // "map" creates a new array with the result of calling a function to every element (in this case the x, y and z coordinates of a node) in the array
                const vector = vec3.fromValues(node[0], node[1], node[2]);                          // create a temporary vec3 (vector) element out of the coordinates
                vec3.transformMat4(vector, vector, rotationMatrix);                                         // transform the vector using the rotation matrix
                return [vector[0], vector[1], vector[2]];
            }
        );

    }

}

