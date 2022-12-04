export class CoordinateModel {
  latitude: number
  longitude: number

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  public static readonly DEFAULT = new CoordinateModel(39.9, 116.3)
}
