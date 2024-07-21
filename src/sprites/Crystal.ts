import gameOptions from '../helper/gameOptions';
import {Clicks, CrystalData, CrystalDataTriangulated, CrystalEnantiomer, CrystalLocation} from "../helper/types";
import * as THREE from 'three';

// Crystal class
export default class Crystal {

    private readonly x : number;                                // relative x position of the crystal on the screen
    private readonly y: number;                                 // relative y position of the crystal on the screen
    private x3d: number;                                        // x position in the 3D world
    private y3d: number;                                        // y position in the 3D world
    private readonly mesh: THREE.Mesh;                          // mesh (includes the geometry and material)
    private readonly edgeLines: THREE.LineSegments;             // lines on the edges of the crystal
    public readonly weight: number;                            // weight of the crystal (and basically also size)
    public readonly enantiomer: CrystalEnantiomer;             // crystal enantiomer (R or S)
    public location: CrystalLocation;                           // where is the crystal currently (table, microscope or in a bowl)
    private readonly xAxis: THREE.Vector3;                      // x-axis to rotate the crystal around
    private readonly yAxis: THREE.Vector3;                      // y-axis to rotate the crystal around
    private threeScene: THREE.Scene;                            // the three scene
    private readonly camera: THREE.PerspectiveCamera;           // the camera of the scene
    private clickZone!: Phaser.GameObjects.Zone;                // click zone for the crystal
    private readonly material: THREE.MeshBasicMaterial;                  // material of the crystal
    private readonly lineMaterial: THREE.LineBasicMaterial;              // material of the edge lines

    // Constructor
    constructor(threeScene: THREE.Scene, phaserScene: Phaser.Scene, camera: THREE.PerspectiveCamera, x: number, y: number) {

        // initialize parameters
        this.x = x;
        this.y = y;
        this.x3d = 0;
        this.y3d = 0;
        this.threeScene = threeScene;
        this.camera = camera;

        // get the initial values for the crystal (random)
        this.weight = Phaser.Math.RND.realInRange(gameOptions.weightRange.min, gameOptions.weightRange.max);
        this.enantiomer = Phaser.Math.RND.pick([CrystalEnantiomer.R, CrystalEnantiomer.S]);

        // setup the material for the crystal
        this.material = new THREE.MeshBasicMaterial({
            color: gameOptions.faceColor,
            opacity: gameOptions.faceAlpha,
            transparent: true
        });

        this.lineMaterial = new THREE.LineBasicMaterial({color: gameOptions.lineColor});

        // get the crystal data
        const crystalData: CrystalData = phaserScene.cache.json.get('crystalData');

        // setup the geometry for the crystal
        const geometry = this.setupGeometry(crystalData);

        // create the 3D crystal mesh
        this.mesh = new THREE.Mesh(geometry, this.material);

        // create the edge lines
        this.edgeLines = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry, 2),                       // threshold angle needs to be set to 2, as one plane is not perfectly planar and this will create a line on the plane
            this.lineMaterial);

        // add the 3D crystal mesh and the edge lines to the THREE scene
        this.threeScene.add(this.mesh);
        this.threeScene.add(this.edgeLines);

        // setup x- and y-axis for the rotation
        this.xAxis = new THREE.Vector3(1, 0, 0);
        this.yAxis = new THREE.Vector3(0, 1, 0);

        // set the random rotation for the crystal
        this.rotate(Phaser.Math.RND.realInRange(0, Math.PI), Phaser.Math.RND.realInRange(0, Math.PI));

        // place the crystal on the table
        this.location = CrystalLocation.TABLE;
        const vector3D = this.calculate3dPosition(this.x, this.y, gameOptions.zCrystalTable);
        this.x3d = vector3D.x;
        this.y3d = vector3D.y;
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

    // setup the geometry (incl. mirroring if S enantiomer and scaling)
    private setupGeometry(crystalData: CrystalData): THREE.BufferGeometry {

        // clone crystal data object in a new one (otherwise every instance of a crystal will be scaled again)
        const newCrystalData: CrystalData = JSON.parse(JSON.stringify(crystalData));

        // Mirror the crystal if it is an S enantiomer
        if (this.enantiomer === CrystalEnantiomer.S) {

            // mirror the vertices (by negating the x-coordinate -> mirroring at the yz-plane)
            for (let i = 0; i < crystalData.vertices.length; i += 3) {
                newCrystalData.vertices[i] = -crystalData.vertices[i];
            }

            // mirror the faces (by reversing the order of the vertices, to ensure the faces look in the right direction)
            for (let f = 0; f < crystalData.faceIndices.length; f++) {
                newCrystalData.faceIndices[f].reverse();
            }

        }

        // scale the crystal (multiply all vertices by the scaling factor) and also apply the scaling based on the weight
        for (let i = 0; i < crystalData.vertices.length; i++) {
            newCrystalData.vertices[i] *= gameOptions.crystalScaling * this.weight;        // multiplied by the weight, but works only if the weight is close to 1
        }

        // triangulate the crystal data
        const crystalDataTriangulated: CrystalDataTriangulated = this.triangulate(newCrystalData);

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

    // calculate position of object in 3D world based on relative screen coordinates
    public calculate3dPosition(x: number, y: number, z3d: number): THREE.Vector3 {

        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();

        // Convert screen position to NDC (noramlized device coordinates, in NDC, the x and y coordinates range from -1 to 1, where (-1, -1) is the bottom left and (1, 1) is the top right of the screen.)
        const ndcX = x * 2 - 1;
        const ndcY = -y * 2 + 1;

        // Calculate the z ndc based on the z world coordinate of the crystal on the table (project the 3D position of the crystal on the table to NDC)
        const ndcZ = new THREE.Vector3(0, 0, z3d).project(this.camera).z;

        // Create a Vector3 in NDC
        const vector = new THREE.Vector3(ndcX, ndcY, ndcZ);

        // Unproject to convert from NDC to world space
        vector.unproject(this.camera);

        return vector;

    }

    // Put the crystal in the microscope
    public putInMicroscope() {
        this.location = CrystalLocation.MICROSCOPE;

        // position it in the center of the table
        this.mesh.position.set(0, 1.3, gameOptions.zCrystalMicroscope);
        this.edgeLines.position.set(0, 1.3, gameOptions.zCrystalMicroscope);

    }

    // Put the crystal on the table
    public putOnTable() {
        this.location = CrystalLocation.TABLE;

        this.mesh.position.set(this.x3d, this.y3d, gameOptions.zCrystalTable);
        this.edgeLines.position.set(this.x3d, this.y3d, gameOptions.zCrystalTable);

    }

    public putInBowl(BowlLocation: CrystalLocation) {

        // change location to the bowl
        this.location = BowlLocation;

        // deactivate the click zone
        this.clickZone.destroy();

        let position3d: THREE.Vector3;

        // calculate the spread of the crystal in the bowl (random distance from the bowl center)
        const spreadX = Phaser.Math.RND.realInRange(-gameOptions.bowlCrystalSpread, gameOptions.bowlCrystalSpread);
        const spreadY = Phaser.Math.RND.realInRange(-gameOptions.bowlCrystalSpread, gameOptions.bowlCrystalSpread);

        // move the crystal to the bowl
        if (BowlLocation === CrystalLocation.BOWLLEFT) {        // calculate the 3D position of the crystal in the bowl
            position3d = this.calculate3dPosition(gameOptions.bowlLeftPosition.x + spreadX, gameOptions.bowlLeftPosition.y + spreadY, gameOptions.zCrystalBowl);
        } else {
            position3d = this.calculate3dPosition(gameOptions.bowlRightPosition.x + spreadX, gameOptions.bowlRightPosition.y + spreadY, gameOptions.zCrystalBowl);
        }

        this.mesh.position.set(position3d.x, position3d.y, gameOptions.zCrystalBowl);       // place the crystal in the bowl
        this.edgeLines.position.set(position3d.x, position3d.y, gameOptions.zCrystalBowl);



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

    // dispose the crystal (remove it from the three scene)
    public dispose() {

        // based on this: https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects

        // dispose the geometry
        this.edgeLines.geometry.dispose();
        this.mesh.geometry.dispose();

        this.material.dispose();
        this.lineMaterial.dispose();

        // remove the mesh and edge lines from the scene
        this.threeScene.remove(this.mesh);
        this.threeScene.remove(this.edgeLines);

    }

}

