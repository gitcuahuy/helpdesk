import * as moment from "moment";

export default class CommonUtils {
  static optimalObjectParams = (object?: any | any[]): any | any[] => {
    if (object) {
      if (object instanceof FormData) {
        const formData = new FormData();
        // for (let [key, value] of object) {
        //     if (value !== undefined && value !== null && value !== '') {
        //         if (typeof value === 'string') {
        //             value = value.trim();
        //             if (value === '') {
        //                 continue;
        //             }
        //         }
        //         formData.append(key, value);
        //     }
        // }
        return formData;
      } else if (Array.isArray(object)) {
        // object.forEach(item => CommonUtils.optimalObjectParams(item));
        return object.filter((item) => item !== undefined && item !== null && item !== '').map(item => CommonUtils.optimalObjectParams(item));
      } else if (typeof object === 'string') {
        object = object.replace(/ + /g, ' ').trim();
      } else if (object instanceof Date) {
        return CommonUtils.dateToLocaleDate(object);
      } else if (object instanceof moment) {
        return CommonUtils.dateToLocaleDate((object as any)?.toDate());
      } else if (typeof object === 'object') {
        Object.keys(object).forEach((k) => {
          if (
            object[k] === null ||
            object[k] === undefined ||
            object[k] === ''
          ) {
            delete object[k];
          } else if (
            typeof object[k] === 'object' ||
            Array.isArray(object[k])
          ) {
            object[k] = CommonUtils.optimalObjectParams(object[k]);
          } else if (typeof object[k] === 'string') {
            object[k] = object[k].trim();
            if (object[k] === '') {
              delete object[k];
            }
          }
        });
      }
    }
    return object;
  };


  static dateToLocaleDate(date?: Date | string | number): string | undefined {
    if (typeof date === 'string') {
      return date;
    }
    if (typeof date === 'number') {
      date = new Date(date);
    }
    if (!date) {
      return undefined;
    }
    return date.toLocaleDateString('fr-CA');
  }
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file?.type?.includes('image')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      } else {
        resolve(file.name);
      }
    });
  }
  public static getRandom(size: number): string {
    return `${Math.round(Math.random() * parseInt(`1${(1e15 + '').slice(-size)}`, 10))}`;
  }
  public static randomUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static removeAccents(str: string): string {
    if (!str) {
      return '';
    }
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  static isKeyCodePrintable(keycode: number): boolean {
    // [\]' (in order)
    return (keycode > 47 && keycode < 58) || // number keys
      keycode === 32 || keycode === 13 || // spacebar & return key(s) (if you want to allow carriage returns)
      (keycode > 64 && keycode < 91) || // letter keys
      (keycode > 95 && keycode < 112) || // numpad keys
      (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
      (keycode > 218 && keycode < 223) || [8, 46, 231].includes(keycode);
  }

}
