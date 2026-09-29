import Phaser from 'phaser';

export function createTextureFromCanvas(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void
): void {
  if (scene.textures.exists(key)) return;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  draw(ctx);
  scene.textures.addCanvas(key, canvas);
}
