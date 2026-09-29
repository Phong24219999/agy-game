import { DungeonNode, NodeType } from '../types/game';
import { SeededRNG } from './SeededRNG';

export class DungeonGenerator {
  public static generateFloor(floorNumber: number, seed?: string): { nodes: DungeonNode[]; startNodeIds: string[] } {
    const floorSeed = seed ? `${seed}_F${floorNumber}` : SeededRNG.generateRandomSeedString();
    const rng = new SeededRNG(floorSeed);

    const rows = 6; // 0 to 5 (5 is the Boss)
    const nodes: DungeonNode[] = [];
    const rowNodes: DungeonNode[][] = [];

    for (let r = 0; r < rows; r++) {
      rowNodes[r] = [];
      let colCount = 3;
      if (r === 0) colCount = 2; // 2 start nodes
      else if (r === rows - 1) colCount = 1; // 1 boss node

      for (let c = 0; c < colCount; c++) {
        const id = `f${floorNumber}_r${r}_c${c}`;
        let type: NodeType = 'battle';

        if (r === 0) {
          type = 'battle';
        } else if (r === rows - 1) {
          type = 'boss';
        } else if (r === rows - 2) {
          // Pre-boss rest / shop
          type = c === 0 ? 'campfire' : 'shop';
        } else if (r === 2) {
          // Mid-floor elite or chest
          const types: NodeType[] = ['elite', 'chest', 'shop'];
          type = types[rng.nextInt(0, types.length - 1)];
        } else {
          // Row 1 & 3: Weighted pick between battle, elite, chest
          const pool: { item: NodeType; weight: number }[] = [
            { item: 'battle', weight: 50 },
            { item: 'elite', weight: 25 },
            { item: 'chest', weight: 25 }
          ];
          type = rng.weightedPick(pool);
        }

        const node: DungeonNode = {
          id,
          floor: floorNumber,
          row: r,
          col: c,
          type,
          completed: false,
          accessible: r === 0, // Row 0 is accessible immediately
          connectedTo: [],
          title: this.getNodeTitle(type, floorNumber),
          description: this.getNodeDescription(type)
        };

        nodes.push(node);
        rowNodes[r].push(node);
      }
    }

    // Connect nodes row by row
    for (let r = 0; r < rows - 1; r++) {
      const current = rowNodes[r];
      const next = rowNodes[r + 1];

      current.forEach((currNode, cIdx) => {
        if (next.length === 1) {
          // Connect to single boss
          currNode.connectedTo.push(next[0].id);
        } else if (next.length === current.length) {
          currNode.connectedTo.push(next[cIdx].id);
          if (cIdx + 1 < next.length) currNode.connectedTo.push(next[cIdx + 1].id);
        } else if (next.length > current.length) {
          currNode.connectedTo.push(next[cIdx].id);
          currNode.connectedTo.push(next[cIdx + 1].id);
        } else {
          // next.length < current.length
          const targetIdx = Math.min(cIdx, next.length - 1);
          currNode.connectedTo.push(next[targetIdx].id);
        }
      });
    }

    const startNodeIds = rowNodes[0].map((n) => n.id);
    return { nodes, startNodeIds };
  }

  private static getNodeTitle(type: NodeType, floor: number): string {
    switch (type) {
      case 'battle':
        return 'Ải Quái Vật';
      case 'elite':
        return 'Quái Tinh Anh';
      case 'chest':
        return 'Rương Kho Báu';
      case 'shop':
        return 'Thương Nhân Hư Vô';
      case 'campfire':
        return 'Lò Rèn Cổ / Lửa Trại';
      case 'boss':
        return `Thủ Lĩnh Tầng ${floor}`;
    }
  }

  private static getNodeDescription(type: NodeType): string {
    switch (type) {
      case 'battle':
        return 'Chiến đấu dọn dẹp bầy quái, nhận Vàng & Điểm Kinh Nghiệm.';
      case 'elite':
        return 'Kẻ thù nguy hiểm mang sức mạnh hắc ám. Phần thưởng trang bị quý hiếm!';
      case 'chest':
        return 'Mở rương bí ẩn nhận cổ vật hoặc linh hồn cổ đại.';
      case 'shop':
        return 'Dùng vàng mua trang bị, thần dược hồi phục và relic đặc biệt.';
      case 'campfire':
        return 'Nghỉ ngơi hồi 40% HP hoặc rèn tăng chỉ số trang bị hiện có.';
      case 'boss':
        return 'Đánh bại chúa tể hầm ngục để mở lối đi xuống tầng tiếp theo!';
    }
  }
}
