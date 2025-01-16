import { describe, vi, it, expect } from 'vitest';
import axios from 'axios';
import MapService from '../MapService';

describe('MapService', () => {
  it('當 取得都市更新地圖時 會 取得都市更新地圖', async () => {
    axios.get = vi.fn().mockResolvedValue({ data: 'fake data' });

    const result = await MapService.GetUrbanUpdatePolygon();

    expect(result).toBe('fake data');
  });

  it('當 取得附近站牌時 會 取得附近站牌', async () => {
    axios.post = vi.fn().mockResolvedValue({ data: 'fake data' });

    const result = await MapService.GetSurroundingStops(0, 0);

    expect(result).toBe('fake data');
  });
});
