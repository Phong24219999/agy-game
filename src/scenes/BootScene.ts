import Phaser from 'phaser';
import { registerHeroTextures } from '../textures/HeroTextures';
import { registerMonsterTextures } from '../textures/MonsterTextures';
import { registerItemTextures } from '../textures/ItemTextures';
import { registerEnvironmentTextures } from '../textures/EnvironmentTextures';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    // Generate/register all procedural pixel-art assets across specialized domains
    registerHeroTextures(this);
    registerMonsterTextures(this);
    registerItemTextures(this);
    registerEnvironmentTextures(this);

    // Transition to MainMenuScene
    this.scene.start('MainMenuScene');
  }
}
