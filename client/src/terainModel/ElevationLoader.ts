function rgbToHeight(r: number, g: number, b: number): number {
    return -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1);
}

export class ElevationLoader {

    public static async load(url: string): Promise<{ size: number; heights: number[] }> {
        const pixels = await ElevationLoader.getPixels(url);
        const planeSize = Math.sqrt(pixels.length / 4);

        const heights: number[] = [];
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const val = rgbToHeight(r, g, b);
            heights.push(val);
        }
        return {
            size: planeSize,
            heights: heights,
        };
    }

    public static getPixels(url: string): Promise<Uint8ClampedArray> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;

            img.onload = () => {
                if (context) {
                    canvas.width = img.width;
                    canvas.height = img.height;

                    context.drawImage(img, 0, 0, img.width, img.height);

                    const imgData = context.getImageData(0, 0, img.width, img.height);

                    resolve(imgData.data);
                } else {
                    reject(new Error("Canvas context not available"));
                }
            };

            img.onerror = (e) => {
                reject(e);
            };
        });
    }
}
