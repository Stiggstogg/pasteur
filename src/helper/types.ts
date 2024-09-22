export enum CrystalLocation {
    TABLE,
    MICROSCOPE,
    BOWLLEFT,
    BOWLRIGHT
}

export enum Clicks {
    CRYSTAL = 'CrystalClick',
    BOWLLEFT = 'BowlLeftClick',
    BOWLRIGHT = 'BowlRightClick',
    MICROSCOPE = 'MicroscopeClick'
}

export enum CrystalEnantiomer {
    R,
    S
}

export interface MinMax {
    min: number,
    max: number
}

export interface CrystalData {
    vertices: number[],
    faceIndices: number[][]
}

export interface CrystalDataTriangulated {
    vertices: number[],
    faceIndices: number[]
}

export interface WinSceneData {
    leftBowlEE: number,
    rightBowlEE: number,
    time: string,
    score: number
}

export interface BitmapTextStyle {
    size: number,
    color: number
}