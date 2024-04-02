export interface ITextureType {
    label: string
    url: (x: number, y: number, zoom: number) => string
    image: string
}