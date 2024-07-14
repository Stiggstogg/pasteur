import gameOptions from '../helper/gameOptions';
import {Clicks, CrystalData, CrystalDataTriangulated, CrystalEnantiomer, CrystalLocation} from "../helper/types";
import * as THREE from 'three';

// Crystal class
export default class Crystal {

    private x: number;                                  // relative x position of the crystal on the screen
    private y: number;                                  // relative y position of the crystal on the screen
    private x3d: number;                                // x position in the 3D world
    private y3d: number;                                // y position in the 3D world
    private rotX: number;                               // rotation of the crystal around the x axis in radians
    private rotY: number;                               // rotation of the crystal around the y axis in radians
    private mesh: THREE.Mesh;                           // mesh (includes the geometry and material)
    private edgeLines: THREE.LineSegments;              // lines on the edges of the crystal
    private weight: number;                             // weight of the crystal (and basically also size)
    private enantiomer: CrystalEnantiomer               // crystal enantiomer (R or S)
    public location: CrystalLocation;                  // where is the crystal currently (table, microscope or in a bowl)
    private xAxis: THREE.Vector3;                       // x-axis to rotate the crystal around
    private yAxis: THREE.Vector3;                       // y-axis to rotate the crystal around
    private threeScene: THREE.Scene;                    // the three scene
    private camera: THREE.PerspectiveCamera;            // the camera of the scene
    private clickZone: Phaser.GameObjects.Zone;         // click zone for the crystal

    // Constructor
    constructor(threeScene: THREE.Scene, phaserScene: Phaser.Scene, camera: THREE.PerspectiveCamera, x: number, y: number) {

        // initialize parameters
        this.x = x;
        this.y = y;
        this.x3d = 0;
        this.y3d = 0;
        this.threeScene = threeScene;
        this.camera = camera;

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
            new THREE.EdgesGeometry(geometry, 1),
            new THREE.LineBasicMaterial({color: gameOptions.lineColor}));

        // add the 3D crystal mesh and the edge lines to the THREE scene
        this.threeScene.add(this.mesh);
        this.threeScene.add(this.edgeLines);

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

        this.position();
        this.putOnTable();

        // add click zone
        this.createClickZone(phaserScene);

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

        // Scale crystal // TODO: Make it better!
        const crystalScaled: number[] = [];

        for (let i = 0; i < crystalData.vertices.length; i++) {
            crystalScaled.push(crystalData.vertices[i] * 5);
        }

        return {
            vertices: crystalScaled,
            faceIndices: faceIndicesTriangulated
        }

    }

    // position the crystal in the three scene (on the table) based on screen coordinates
    private position() {


        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();

        // Convert screen position to NDC (noramlized device coordinates, in NDC, the x and y coordinates range from -1 to 1, where (-1, -1) is the bottom left and (1, 1) is the top right of the screen.)
        const ndcX = this.x * 2 - 1;
        const ndcY = -this.y * 2 + 1;

        // Calculate the z ndc based on the z world coordinate of the crystal on the table (project the 3D position of the crystal on the table to NDC)
        const ndcZ = new THREE.Vector3(0, 0, gameOptions.zCrystalTable).project(this.camera).z;

        // Create a Vector3 in NDC
        const vector = new THREE.Vector3(ndcX, ndcY, ndcZ);

        // Unproject to convert from NDC to world space
        vector.unproject(this.camera);

        this.x3d = vector.x;
        this.y3d = vector.y;

    }

    // Put the crystal in the microscope
    public putInMicroscope() {
        this.location = CrystalLocation.MICROSCOPE;

        // position it in the center of the screen
        this.mesh.position.set(0, 0, gameOptions.zCrystalMicroscope);
        this.edgeLines.position.set(0, 0, gameOptions.zCrystalMicroscope);

    }

    // Put the crystal on the table
    public putOnTable() {
        this.location = CrystalLocation.TABLE;

        this.mesh.position.set(this.x3d, this.y3d, gameOptions.zCrystalTable);
        this.edgeLines.position.set(this.x3d, this.y3d, gameOptions.zCrystalTable);

    }

    // create the click zone for the crystal
    private createClickZone(phaserScene: Phaser.Scene) {

        this.clickZone = phaserScene.add.zone(this.x * gameOptions.gameWidth, this.y * gameOptions.gameHeight,
            gameOptions.crystalClickAreaSize * gameOptions.gameWidth, gameOptions.crystalClickAreaSize * gameOptions.gameWidth)
            .setOrigin(0.5).setInteractive();

        // emit the click event (on the scene) when the click zone is clicked
        this.clickZone.on('pointerdown', () => {
            this.clickZone.scene.events.emit(Clicks.CRYSTAL, this);
        });

    }

}

