import gameOptions from '../helper/gameOptions';
import {CrystalData, CrystalDataTriangulated, CrystalEnantiomer, CrystalLocation} from "../helper/types";
import * as THREE from 'three';

// Crystal class
export default class Crystal {

    private mesh: THREE.Mesh;                           // mesh (includes the geometry and material)
    private edgeLines: THREE.LineSegments;              // lines on the edges of the crystal
    private threeScene: THREE.Scene;                    // THREE scene on which the crystal is places
    private phaserScene: Phaser.Scene;                  // Phaser scene which is used
    private weight: number;                             // weight of the crystal (and basically also size)
    private enantiomer: CrystalEnantiomer               // crystal enantiomer (R or S)
    private location: CrystalLocation;                  // where is the crystal currently (table, microscope or in a bowl)
    private xAxis: THREE.Vector3;                       // x-axis to rotate the crystal around
    private yAxis: THREE.Vector3;                       // y-axis to rotate the crystal around
    private rotX: number;                               // rotation of the crystal around the x axis in radians
    private rotY: number;                               // rotation of the crystal around the y axis in radians

    // Constructor
    constructor(threeScene: THREE.Scene, phaserScene: Phaser.Scene) {

        // setup the material for the crystal
        const material = new THREE.MeshBasicMaterial({
            color: gameOptions.faceColor,
            opacity: gameOptions.faceAlpha,
            transparent: true
        });

        // get the crystal data
        const crystalData: CrystalData = phaserScene.cache.json.get('crystalData');

        // setup the geometry for the crystal
        const geometry = this.setupGeometry(crystalData);

        // create the 3D crystal mesh
        this.mesh = new THREE.Mesh(geometry, material);

        // create the edge lines
        this.edgeLines = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({color: gameOptions.lineColor}));

        // add the 3D crystal mesh and the edge lines to the THREE scene
        threeScene.add(this.mesh);
        threeScene.add(this.edgeLines);

        // setup x- and y-axis for the rotation
        this.xAxis = new THREE.Vector3(1, 0, 0);
        this.yAxis = new THREE.Vector3(0, 1, 0);

        // get the initial values for the crystal (random)
        this.weight = Phaser.Math.RND.realInRange(gameOptions.weightRange.min, gameOptions.weightRange.max);
        this.enantiomer = Phaser.Math.RND.pick([CrystalEnantiomer.R, CrystalEnantiomer.S]);
        //this.x = Phaser.Math.RND.realInRange(gameOptions.tableRange.minX * gameOptions.gameWidth, gameOptions.tableRange.maxX * gameOptions.gameWidth);
        //this.y = Phaser.Math.RND.realInRange(gameOptions.tableRange.minY * gameOptions.gameHeight, gameOptions.tableRange.maxY * gameOptions.gameHeight);
        this.rotX = Phaser.Math.RND.rotation();
        this.rotY = Phaser.Math.RND.rotation();

        // place the crystal on the table
        this.location = CrystalLocation.TABLE;

    }

    update() {


    }

    // rotate the crystal
    public rotate(deltaX: number, deltaY: number) {

        // rotate around the world axis (if the object is directly rotated, the axis of the object will also be rotated)
        this.mesh.rotateOnWorldAxis(this.yAxis, deltaY);
        this.mesh.rotateOnWorldAxis(this.xAxis, deltaX);        // TODO: Check! Not sure if this works properly, maybe the order matters (first x than y vs first y then x)
        this.edgeLines.rotateOnWorldAxis(this.yAxis, deltaY);
        this.edgeLines.rotateOnWorldAxis(this.xAxis, deltaX);

    }

    // setup the geometry
    private setupGeometry(crystalData: CrystalData): THREE.BufferGeometry {

        // triangulate the crystal data
        const crystalDataTriangulated: CrystalDataTriangulated = this.triangulate(crystalData);

        // create geometry object and add vertices and indices (based on the example "Code Example (Index)" from: https://threejs.org/docs/#api/en/core/BufferGeometry)
        const geometry = new THREE.BufferGeometry();

        geometry.setIndex(crystalDataTriangulated.faceIndices);
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(crystalDataTriangulated.vertices), 3));

        return geometry;

    }

    // triangulate faces by fan triangulation (pre-condition: All faces are convex polygons!)
    private triangulate(crystalData: CrystalData): CrystalDataTriangulated {

        const faceIndicesTriangulated: number[] = [];

        for (let f = 0; f < crystalData.faceIndices.length; f++) {          // go through each face (index: f)

            for (let t = 0; t < crystalData.faceIndices[f].length - 2; t++) {   // create triangles using fan triangulation (number of triangles = number of vertices - 2)

                faceIndicesTriangulated.push(
                    crystalData.faceIndices[f][0],          // start point of the triangle is always the first vertex
                    crystalData.faceIndices[f][t+1],
                    crystalData.faceIndices[f][t+2]
                );

            }

        }

        return {
            vertices: crystalData.vertices,
            faceIndices: faceIndicesTriangulated
        }

    }

}

