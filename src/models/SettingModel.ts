import {Status} from "@/constant";
import {CoordinateModel} from "./CoordinateModel";

export class SettingModel {
  status: Status
  toLightTime: string
  toDarkTime: string
  forceSwitch: boolean
  coordinate: CoordinateModel

  constructor(status: Status, toLightTime: string, toDarkTime: string, forceSwitch: boolean, coordinate: CoordinateModel) {
    this.status = status
    this.toLightTime = toLightTime
    this.toDarkTime = toDarkTime
    this.forceSwitch = forceSwitch
    this.coordinate = coordinate
  }

  public static readonly DEFAULT = new SettingModel(
      Status.DISABLE,
      '07:00',
      '18:00',
      false,
      CoordinateModel.DEFAULT
  )
}
