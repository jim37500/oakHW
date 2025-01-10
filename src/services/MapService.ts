import axios from 'axios';

export default class MapService {
  static async GetUrbanAreas() {
    const o = await axios.get('https://enterprise.oakmega.ai/api/v1/server/xinbei/geolocation-json?directory=tucheng.json');
    return o.data;
  }

  static async GetSurroundingStops(lng: number, lat: number) {
    const response = await axios.post('https://enterprise.oakmega.ai/api/v1/server/xinbei/calc-distance', { lat, lng });
    return response.data;
  }
}
