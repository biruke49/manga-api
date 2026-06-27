import * as bcrypt from "bcrypt";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import * as jwt from "jsonwebtoken";
export class Util {
  static hashPassword(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword, Number(process.env.BcryptHashRound));
  }
  static comparePassword(
    plainPassword: string,
    encryptedPassword: string
  ): boolean {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  }
  static generatePassword(length = 4): string {
    let password = "";
    const characters = "0123456789";
    // const characters =
    //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()-";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return password;
  }
  static getTimeDifference(endTime: Date, startTime: Date): string {
    const diff = endTime.getTime() - startTime.getTime();
    let msec = diff;
    const hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    const mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    const ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    let result = hh ? hh.toString() : "00";
    result += ":" + (mm.toString() ? mm.toString() : "00");
    result += ":" + (ss.toString() ? ss.toString() : "00");
    return result;
  }
  static getPasswordFromCurrentDate(): string {
    const currentDate = new Date();
    const month =
      currentDate.getMonth() > 9
        ? currentDate.getMonth().toString()
        : "0" + currentDate.getMonth().toString();
    const date =
      currentDate.getDate() > 9
        ? currentDate.getDate().toString()
        : "0" + currentDate.getDate().toString();
    return currentDate.getFullYear().toString() + month + date;
  }
  static getTheLastMonday(date: Date) {
    const previousMonday = new Date();
    previousMonday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return previousMonday;
  }
  static GenerateToken(user: UserInfo, expiresIn = "1d") {
    return jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });
  }
  static GenerateRefreshToken(user: UserInfo, expiresIn = "365d") {
    return jwt.sign(user, process.env.REFRESH_SECRET_TOKEN, {
      expiresIn: expiresIn,
    });
  }
  static compareDate(date1: Date, date2: Date) {
    return date1.getTime() - date2.getTime();
  }
}
