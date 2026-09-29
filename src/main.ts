import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { MapScene } from './scenes/MapScene';
import { BattleScene } from './scenes/BattleScene';
import { RewardScene } from './scenes/RewardScene';
import { ShopScene } from './scenes/ShopScene';
import { CampfireScene } from './scenes/CampfireScene';
import { GameOverScene } from './scenes/GameOverScene';
import { AudioSystem } from './systems/AudioSystem';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 600,
  backgroundColor: '#0b0a10',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  render: {
    pixelArt: true,
    roundPixels: true
  },
  scene: [
    BootScene,
    MainMenuScene,
    MapScene,
    BattleScene,
    RewardScene,
    ShopScene,
    CampfireScene,
    GameOverScene
  ]
};

// Initialize audio context on first user interaction to comply with browser policies
const initAudioOnInteraction = () => {
  AudioSystem.getInstance().init();
  window.removeEventListener('pointerdown', initAudioOnInteraction);
  window.removeEventListener('keydown', initAudioOnInteraction);
};

window.addEventListener('pointerdown', initAudioOnInteraction);
window.addEventListener('keydown', initAudioOnInteraction);

// Start game
new Phaser.Game(config);
