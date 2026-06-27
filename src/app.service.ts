import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import { SendSmsCommand } from "@libs/common/notifications/sms.command";
import { EventEmitter2 } from "@nestjs/event-emitter";
import * as dayjs from "dayjs";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AppService {
  private apiKey = process.env.GOOGLE_DISTANCE_API;
  apiUrl = process.env.AFRO_BASE_URL;
  constructor(
    private eventEmitter: EventEmitter2,
    @Inject("EMAIL_CREDENTIAL_SERVICE")
    private notificationClient: ClientProxy
  ) {}
  async sendNotification(
    tokens: string,
    notificationData: any,
    sender?: any,
    type?: any
  ) {
    const command = { tokens, notificationData, sender, type };
    try {
      const sendNotification = await firstValueFrom(
        this.notificationClient.send("send-notification", command)
      );
      return sendNotification;
    } catch (error) {
      throw new BadRequestException("Failed to send notification");
    }
  }
  async sendSms(command: SendSmsCommand) {
    try {
      const sendSms = await firstValueFrom(
        this.notificationClient.send("send-sms", command)
      );
      return sendSms;
    } catch (error) {
      throw new BadRequestException("Failed to send SMS");
    }
  }
  async sendGeezSMS(command: SendSmsCommand) {
    try {
      const sendSms = await firstValueFrom(
        this.notificationClient.send("send-geez-sms", command)
      );
      return sendSms;
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw error;
    }
  }
  async sendSmsHahu(command: SendSmsCommand) {
    try {
      // const sendSms = await firstValueFrom(
      //   this.notificationClient.send("send-sms", command)
      // );
      const apiUrl = `https://hahu.io/api/send/sms?secret=${
        process.env.HAHU_CLOUD_API
      }&mode=devices&phone=${command.phone}&message=${encodeURIComponent(
        command.message
      )}&device=${process.env.HAHU_CLOUD_DEVICE_API}&sim=2`;

      const response = await axios.post(apiUrl);
      return true;
    } catch (error) {
      throw new BadRequestException("Failed to send SMS");
    }
  }
  async sendVerificationCode(phone: string): Promise<any> {
    const command = { phone };
    try {
      const sendCode = await firstValueFrom(
        this.notificationClient.send("send-verification-code", command)
      );
      return sendCode;
    } catch (error) {
      throw new BadRequestException("Failed to send code");
    }
  }
  async verifyOtp(code: string, phone: string, type: string): Promise<any> {
    const command = { code, phone };
    try {
      const verifyCode = await firstValueFrom(
        this.notificationClient.send("verify-code", command)
      );
      return verifyCode;
    } catch (error) {
      throw new BadRequestException("Failed to verify code");
    }
  }
  async getDistance(origin: string, destination: string): Promise<number> {
    const apiKey = this.apiKey;
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      const distance = response.data.rows[0].elements[0].distance.value;
      return distance;
    } catch (error) {
      return 1;
      // throw new Error("Failed to get distance from API");
    }
  }
  isDateToday(date: Date) {
    const dateToCheck = dayjs(date);
    const check = dateToCheck.isSame(dayjs(), "day");
    return check;
  }
  isDatePast(date: Date): boolean {
    const today = dayjs().startOf("day");
    const inputDate = dayjs(date); // `date` is a JavaScript Date object

    return inputDate.isBefore(today);
  }
  isSameDate(a: Date | string, b: Date | string): boolean {
    return dayjs(a).isSame(dayjs(b), "day");
  }
  isMonthPast(date: Date): boolean {
    const today = dayjs();
    const inputDate = dayjs(date);

    return inputDate.month() < today.month(); // Check if input month is before current month
  }
  getEndOfCurrentMonth(): Date {
    const now = new Date(); // Get current date
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Set to the last day of the current month
    return endOfMonth;
  }
  getEndOfNextMonth(): Date {
    const now = new Date(); // Get current date
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0); // Set to the last day of the current month

    return endOfMonth;
  }
  getEndOfMonth(date: Date): Date {
    const now = new Date(date); // Get current date
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Set to the last day of the current month

    return endOfMonth;
  }
  getStartOfCurrentMonth(): Date {
    const now = new Date(); // Get the current date
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Set to the first day of the current month

    return startOfMonth;
  }
  getWorkingDays(from: Date, to: Date): number {
    const workingDays = [1, 2, 3, 4, 5]; // 1 = Monday, ...
    const holidayDays = ["*-12-25", "*-01-01", "2013-12-23"]; // Variable and fixed holidays

    let fromDate = new Date(from);
    let toDate = new Date(to);
    toDate.setDate(toDate.getDate() + 1); // Include the end date in the iteration

    let days = 0;

    for (let date = fromDate; date < toDate; date.setDate(date.getDate() + 1)) {
      const weekDay = date.getDay() || 7; // Adjust Sunday from 0 to 7
      if (!workingDays.includes(weekDay)) continue;

      const formattedDate = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const formattedMonthDay = `*-${formattedDate.slice(5)}`; // '*-MM-DD'

      if (
        holidayDays.includes(formattedDate) ||
        holidayDays.includes(formattedMonthDay)
      )
        continue;

      days++;
    }

    // Reset the date to avoid side effects
    fromDate.setDate(fromDate.getDate() - days);

    return days > 23 ? 23 : days;
  }
  async getCoordinates(address: string): Promise<{
    lat: number;
    lng: number;
    country: string;
    city: string;
    zip: string;
    state: string;
  }> {
    // if (!address || address === "") {
    //   throw new Error("Please provide a valid address");
    // }
    const baseUrl = process.env.GEO_LOCATOR_BASE_URL;
    const googleMapsApiKey = process.env.GOOGLE_DISTANCE_API;
    const url = `${baseUrl}?address=${encodeURIComponent(
      address
    )}&key=${googleMapsApiKey}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;

        const addressComponents = data.results[0].address_components;
        let country = "";
        let city = "";
        let zip = "";
        let state = "";

        addressComponents.forEach((component) => {
          if (component.types.includes("country")) {
            country = component.long_name;
          }
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            zip = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
        });
        return {
          lat: location.lat,
          lng: location.lng,
          country: country,
          city: city,
          zip: zip,
          state: state,
        };
      } else {
        throw new Error(`Geocoding failed: ${data.status}`);
      }
    } catch (error) {
      console.error(error);
      return null;
      // throw new Error("An error occurred while fetching the coordinates.");
    }
  }
  convertTo24HourFormat(time: string): string {
    // Use a regular expression to parse the time string
    const timeRegex = /^(\d{1,2}):(\d{2}):(\d{2})\s?(AM|PM)$/i;
    const match = time.match(timeRegex);

    if (!match) {
      throw new Error("Invalid time format");
    }

    let [_, hoursStr, minutesStr, secondsStr, period] = match;
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);

    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(
      seconds
    )}`;
  }
  padZero(num: number): string {
    return num.toString().padStart(2, "0");
  }
  parseDateString(dateString: string): Date {
    const [month, day, year] = dateString
      .split("-")
      .map((part) => parseInt(part, 10));
    const fullYear = year < 100 ? 2000 + year : year;

    // Create a date object and explicitly set the hours to avoid time zone issues
    const date = new Date(Date.UTC(fullYear, month - 1, day));
    return date;
  }
  convertTo12HourFormat(time24: string): string {
    // Split the time into hours and minutes
    const [hourString, minute] = time24.split(":");
    let hour = parseInt(hourString);
    const ampm = hour >= 12 ? "PM" : "AM";

    // Convert hour from 24-hour to 12-hour format
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'

    // Return the formatted time
    return `${hour}:${minute} ${ampm}`;
  }
  // Helper function to check if a date is today
  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }
  convertTimeFormat(time: string): string {
    // Check if the input time is in 12-hour format
    const is12HourFormat = /[APM]/i.test(time);

    if (is12HourFormat) {
      // Convert 12-hour format to 24-hour format
      const [timePart, period] = time.split(" ");
      let [hour, minute] = timePart.split(":").map(Number);

      if (period.toUpperCase() === "PM" && hour !== 12) {
        hour += 12;
      }
      if (period.toUpperCase() === "AM" && hour === 12) {
        hour = 0;
      }

      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    } else {
      // Convert 24-hour format to 12-hour format
      const [hourString, minute] = time.split(":");
      let hour = parseInt(hourString);
      const ampm = hour >= 12 ? "PM" : "AM";

      // Convert hour from 24-hour to 12-hour format
      hour = hour % 12;
      hour = hour ? hour : 12; // the hour '0' should be '12'

      // Return the formatted time
      return `${hour}:${minute} ${ampm}`;
    }
  }
  getDayOfWeek() {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    // const days = "All, Tue, Wed, Thu, Sat";
    // const daysOfBusStop = days.split(",").map((day) => day.trim());
    return daysOfWeek[today.getDay()];
  }
  addDaysToDate(date: string | Date, days: number): Date {
    // Parse the input date and add the specified number of days
    const newDate = dayjs(date).add(days, "day");
    return newDate.toDate(); // Format the output date as needed
  }
  addMonthsToDate(date: string | Date, months: number): Date {
    // Parse the input date and add the specified number of months
    const newDate = dayjs(date).add(months, "month");
    return newDate.toDate(); // Return the result as a JavaScript Date object
  }

  subtractDaysFromDate(date: string | Date, days: number): Date {
    // Parse the input date and subtract the specified number of days
    const newDate = dayjs(date).subtract(days, "day");
    return newDate.toDate(); // Convert to JavaScript Date object
  }

  generateRandomText(text: string, startDate?: Date): string {
    // const date = dayjs().format("YYYY-MM-DD");
    const date = startDate
      ? dayjs(startDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
    return `${text} ${date}`;
  }
  formatNumbers(number: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(number);
  }
}
