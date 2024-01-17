export enum CrystalLocation {
    TABLE,
    MICROSCOPE,
    BOWL
}

export enum CrystalEnantiomer {
    R,
    S
}

export interface MinMax {
    min: number,
    max: number
}

export interface CoordinateMinMax {
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
}

export interface CrystalData {
    coordinatesNodes: number[][],
    faceNodes: number[][]
}