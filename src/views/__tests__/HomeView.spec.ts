import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import HomeView from '@/views/HomeView.vue';
import MapService from '@/services/MapService';
import type { Stop } from '@/types';
import MyGlobal from '../../__tests__/_Globals.spec';

window.scrollTo = vi.fn();

const fakeUrbanUpdatePolygon = {
  result: {
    features: [
      {
        geometry: {
          coordinates: [
            [
              [121.443, 24.988, -1.8],
              [121.543, 24.188, 2],
            ],
          ],
        },
      },
    ],
  },
};

const fakeSurroundingStops = {
  result: [
    { stop_name: 'fakeStopName', latitude: 24.988, longitude: 121.443, distance: 0.2 },
    { stop_name: 'fakeStopName', latitude: 24.988, longitude: 121.443, distance: 0.1 },
    { stop_name: 'fakeStopName1', latitude: 24.988, longitude: 121.443, distance: 0.1 },
  ],
};

vi.mock('@/services/MapService');
MapService.GetUrbanUpdatePolygon = vi.fn().mockResolvedValue(fakeUrbanUpdatePolygon);
MapService.GetSurroundingStops = vi.fn().mockResolvedValue(fakeSurroundingStops);

vi.mock('@vue-leaflet/vue-leaflet', () => ({
  LMap: {
    template: '<div class="mock-lmap"><slot /></div>',
  },
  LTileLayer: {
    template: '<div class="mock-ltilelayer"></div>',
  },
  LPolygon: {
    template: '<div class="mock-lpolygon"></div>',
  },
  LMarker: {
    template: '<div class="mock-lmarker"><slot /></div>',
  },
  LPopup: {
    template: '<div class="mock-lpopup"><slot /></div>',
  },
  LIcon: {
    template: '<div class="mock-licon"></div>',
  },
  LTooltip: {
    template: '<div class="mock-ltooltip"><slot /></div>',
  },
}));

describe('HomeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('當 讀取時 會 取得都更地圖與其附近站點', async () => {
    const wrapper = mount(HomeView, { global: MyGlobal });
    window.innerWidth = 500;

    await flushPromises();

    expect((wrapper.vm as unknown as { PolygonCoordinates: unknown[] }).PolygonCoordinates).toStrictEqual([
      [
        [24.988, 121.443],
        [24.188, 121.543],
      ],
    ]);
    expect((wrapper.vm as unknown as { Stops: unknown[] }).Stops).toStrictEqual([
      {
        Distance: 0.1,
        IsFocus: false,
        Latitude: 24.988,
        Longitude: 121.443,
        Name: 'fakeStopName',
      },
      {
        Distance: 0.1,
        IsFocus: false,
        Latitude: 24.988,
        Longitude: 121.443,
        Name: 'fakeStopName1',
      },
    ]);
  });

  it('當 點擊站點時站點為空 會 略過不做', async () => {
    const wrapper = mount(HomeView, { global: MyGlobal });
    (wrapper.vm as unknown as { Center: { lat: number; lng: number } }).Center = {
      lat: 24.988,
      lng: 121.443,
    };

    (
      wrapper.vm as unknown as {
        ClickStop: (stop: Stop) => void;
      }
    ).ClickStop({
      Distance: 0.1,
      IsFocus: false,
      IsEmpty: true,
      Latitude: 25,
      Longitude: 122,
      Name: 'fakeStopName',
    });

    expect((wrapper.vm as unknown as { Center: { lat: number; lng: number } }).Center).toEqual({
      lat: 24.988,
      lng: 121.443,
    });
  });

  it('當 點擊站點時 會 聚焦該站點', async () => {
    const wrapper = mount(HomeView, { global: MyGlobal });
    await flushPromises();
    (wrapper.vm as unknown as { Center: { lat: number; lng: number } }).Center = {
      lat: 24.988,
      lng: 121.443,
    };
    (wrapper.vm as unknown as { FocusStop: Stop }).FocusStop = {
      Distance: 0.1,
      IsFocus: true,
      Latitude: 25,
      Longitude: 123,
      Name: 'fakeStopName',
    };

    (
      wrapper.vm as unknown as {
        ClickStop: (stop: Stop) => void;
      }
    ).ClickStop({
      Distance: 0.1,
      IsFocus: false,
      Latitude: 25,
      Longitude: 123,
      Name: 'fakeStopName1',
    });

    expect((wrapper.vm as unknown as { Center: { lat: number; lng: number } }).Center).toEqual({
      lat: 25,
      lng: 123,
    });
  });

  it('當 換頁時 會 更新顯示站點', async () => {
    const wrapper = mount(HomeView, { global: MyGlobal });
    await flushPromises();
    window.innerWidth = 1300;

    (
      wrapper.vm as unknown as {
        ChangeDisplayStops: ({}) => void;
      }
    ).ChangeDisplayStops({
      first: 0,
    });

    expect((wrapper.vm as unknown as { DisplayStops: unknown[] }).DisplayStops).toStrictEqual([
      {
        Distance: 0.1,
        IsFocus: false,
        Latitude: 24.988,
        Longitude: 121.443,
        Name: 'fakeStopName',
      },
      {
        Distance: 0.1,
        IsFocus: false,
        Latitude: 24.988,
        Longitude: 121.443,
        Name: 'fakeStopName1',
      },
      {
        Distance: 0,
        IsEmpty: true,
        IsFocus: false,
        Latitude: 0,
        Longitude: 0,
        Name: 'Empty',
      },
      {
        Distance: 0,
        IsEmpty: true,
        IsFocus: false,
        Latitude: 0,
        Longitude: 0,
        Name: 'Empty',
      },
      {
        Distance: 0,
        IsEmpty: true,
        IsFocus: false,
        Latitude: 0,
        Longitude: 0,
        Name: 'Empty',
      },
      {
        Distance: 0,
        IsEmpty: true,
        IsFocus: false,
        Latitude: 0,
        Longitude: 0,
        Name: 'Empty',
      },
      {
        Distance: 0,
        IsEmpty: true,
        IsFocus: false,
        Latitude: 0,
        Longitude: 0,
        Name: 'Empty',
      },
      {
        Distance: 0,
        IsEmpty: true,
        IsFocus: false,
        Latitude: 0,
        Longitude: 0,
        Name: 'Empty',
      },
    ]);
  });

  it('當 點擊地圖時 會 改變人目前位置', async () => {
    const wrapper = mount(HomeView, { global: MyGlobal });
    await flushPromises();
    (wrapper.vm as unknown as { MyLocation: { lat: number; lng: number } }).MyLocation = {
      lat: 24.988,
      lng: 121.443,
    };

    (
      wrapper.vm as unknown as {
        ClickMap: (coordinates: { latlng: { lat: number; lng: number } }) => void;
      }
    ).ClickMap({ latlng: { lat: 24, lng: 123 } });

    expect((wrapper.vm as unknown as { MyLocation: { lat: number; lng: number } }).MyLocation).toEqual({
      lat: 24,
      lng: 123,
    });
  });

  it('當 搜尋站點沒有關鍵字時 會 直接回傳不做', async () => {
    const wrapper = mount(HomeView, { global: MyGlobal });
    await flushPromises();
    (wrapper.vm as unknown as { Keyword: string }).Keyword = '';

    (
      wrapper.vm as unknown as {
        SearchStops: () => void;
      }
    ).SearchStops();

    expect((wrapper.vm as unknown as { DisplayStops: Stop[] }).DisplayStops.length).toEqual(2);
  });

  it('當 搜尋站點時 會 過濾站點', async () => {
    const wrapper = mount(HomeView, { global: MyGlobal });
    await flushPromises();
    window.innerWidth = 600;
    (wrapper.vm as unknown as { Keyword: string }).Keyword = 'fakeStopName1';

    (
      wrapper.vm as unknown as {
        SearchStops: () => void;
      }
    ).SearchStops();

    expect((wrapper.vm as unknown as { DisplayStops: Stop[] }).DisplayStops.length).toEqual(1);
  });

  it('當 清空關鍵字時 會 搜尋過後的站點會變未篩選', async () => {
    const wrapper = mount(HomeView, { global: MyGlobal });
    window.innerWidth = 600;
    (wrapper.vm as unknown as { Keyword: string }).Keyword = 'fakeStopName1';
    await flushPromises();

    (wrapper.vm as unknown as { Keyword: string }).Keyword = '';
    await flushPromises();

    expect((wrapper.vm as unknown as { FilteredStops: Stop[] }).FilteredStops.length).toEqual(2);
  });
});
