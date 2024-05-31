class ImageCompressor {
    private image: HTMLImageElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private k: number;
  
    constructor(image: HTMLImageElement, k: number) {
      this.image = image;
      this.k = k;
      this.canvas = document.createElement('canvas');
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
      this.ctx.drawImage(image, 0, 0, image.width, image.height);
    }
  
    private getPixelData(): Uint8ClampedArray {
      return this.ctx.getImageData(0, 0, this.image.width, this.image.height).data;
    }
  
    private getRandomCentroids(pixels: Uint8ClampedArray, k: number): number[][] {
      const centroids: number[][] = [];
      for (let i = 0; i < k; i++) {
        const offset = Math.floor(Math.random() * (pixels.length / 4)) * 4;
        centroids.push([pixels[offset], pixels[offset + 1], pixels[offset + 2]]);
      }
      return centroids;
    }
  
    private getDistance(color1: number[], color2: number[]): number {
      return Math.sqrt(
        (color1[0] - color2[0]) ** 2 +
        (color1[1] - color2[1]) ** 2 +
        (color1[2] - color2[2]) ** 2
      );
    }
  
    private assignClusters(pixels: Uint8ClampedArray, centroids: number[][]): number[] {
      const clusters = new Array(pixels.length / 4);
      for (let i = 0; i < pixels.length; i += 4) {
        const color = [pixels[i], pixels[i + 1], pixels[i + 2]];
        let minDistance = Infinity;
        let cluster = -1;
        for (let j = 0; j < centroids.length; j++) {
          const distance = this.getDistance(color, centroids[j]);
          if (distance < minDistance) {
            minDistance = distance;
            cluster = j;
          }
        }
        clusters[i / 4] = cluster;
      }
      return clusters;
    }
  
    private updateCentroids(pixels: Uint8ClampedArray, clusters: number[], k: number): number[][] {
      const centroids = new Array(k).fill(0).map(() => [0, 0, 0, 0]);
      for (let i = 0; i < pixels.length; i += 4) {
        const cluster = clusters[i / 4];
        centroids[cluster][0] += pixels[i];
        centroids[cluster][1] += pixels[i + 1];
        centroids[cluster][2] += pixels[i + 2];
        centroids[cluster][3] += 1;
      }
      for (let j = 0; j < centroids.length; j++) {
        if (centroids[j][3] > 0) {
          centroids[j][0] /= centroids[j][3];
          centroids[j][1] /= centroids[j][3];
          centroids[j][2] /= centroids[j][3];
        }
      }
      return centroids.map(c => c.slice(0, 3));
    }
  
    private hasConverged(oldCentroids: number[][], newCentroids: number[][]): boolean {
      for (let i = 0; i < oldCentroids.length; i++) {
        if (this.getDistance(oldCentroids[i], newCentroids[i]) > 1) {
          return false;
        }
      }
      return true;
    }
  
    public compress(): HTMLImageElement {
      let pixels = this.getPixelData();
      let centroids = this.getRandomCentroids(pixels, this.k);
      let clusters = this.assignClusters(pixels, centroids);
  
      while (true) {
        const newCentroids = this.updateCentroids(pixels, clusters, this.k);
        if (this.hasConverged(centroids, newCentroids)) break;
        centroids = newCentroids;
        clusters = this.assignClusters(pixels, centroids);
      }
  
      const newImageData = new ImageData(this.image.width, this.image.height);
      for (let i = 0; i < pixels.length; i += 4) {
        const cluster = clusters[i / 4];
        newImageData.data[i] = centroids[cluster][0];
        newImageData.data[i + 1] = centroids[cluster][1];
        newImageData.data[i + 2] = centroids[cluster][2];
        newImageData.data[i + 3] = 255;
      }
  
      this.ctx.putImageData(newImageData, 0, 0);
  
      const compressedImage = new Image();
      compressedImage.src = this.canvas.toDataURL();
      return compressedImage;
    }
  }
  