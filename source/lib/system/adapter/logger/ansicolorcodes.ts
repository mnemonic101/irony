export class ColorHelper {
  public containsColorCode(text: string): boolean {
    throw new Error("Not implemented yet!");
  }
  public ensureResetColorCode(text: string): string {
    throw new Error("Not implemented yet!");
  }
}

export class TextAttributes {
  public static reset: string = "\x1b[0m"; // All attributes off(color at startup)
  public static boldOn: string = "\x1b[1m"; // Bold on(enable foreground intensity)
  public static underlineOn: string = "\x1b[4m"; // Underline on
  public static blinkOn: string = "\x1b[5m"; // Blink on(enable background intensity)
  public static boldOff: string = "\x1b[21m"; // Bold off(disable foreground intensity)
  public static underlineOff: string = "\x1b[24m"; // Underline off
  public static disableBg: string = "\x1b[25m"; // Blink off(disable background intensity)
};

export class Foreground {
  public static black: string = "\x1b[30m"; // Black
  public static red: string = "\x1b[31m"; // Red
  public static green: string = "\x1b[32m"; // Green
  public static yellow: string = "\x1b[33m"; // Yellow
  public static blue: string = "\x1b[34m"; // Blue
  public static magenta: string = "\x1b[35m"; // Magenta
  public static cyan: string = "\x1b[36m"; // Cyan
  public static white: string = "\x1b[37m"; // White
  public static default: string = "\x1b[39m"; // Default(foreground color at startup)
  public static lightGray: string = "\x1b[90m"; // Light Gray
  public static lightRed: string = "\x1b[91m"; // Light Red
  public static lightGreen: string = "\x1b[92m"; // Light Green
  public static lightYellow: string = "\x1b[93m"; // Light Yellow
  public static lightBlue: string = "\x1b[94m"; // Light Blue
  public static lightMagenta: string = "\x1b[95m"; // Light Magenta
  public static lightCyan: string = "\x1b[96m"; // Light Cyan
  public static lightWhite: string = "\x1b[97m"; // Light White
};

export class Background {
  public static black: string = "\x1b[40m"; // Black
  public static red: string = "\x1b[41m"; // Red
  public static green: string = "\x1b[42m"; // Green
  public static yellow: string = "\x1b[43m"; // Yellow
  public static blue: string = "\x1b[44m"; // Blue
  public static magenta: string = "\x1b[45m"; // Magenta
  public static cyan: string = "\x1b[46m"; // Cyan
  public static white: string = "\x1b[47m"; // White
  public static default: string = "\x1b[49m"; // Default(background color at startup)
  public static lightGray: string = "\x1b[100m"; // Light Gray
  public static lightRed: string = "\x1b[101m"; // Light Red
  public static lightGreen: string = "\x1b[102m"; // Light Green
  public static lightYellow: string = "\x1b[103m"; // Light Yellow
  public static lightBlue: string = "\x1b[104m"; // Light Blue
  public static lightMagenta: string = "\x1b[105m"; // Light Magenta
  public static lightCyan: string = "\x1b[106m"; // Light Cyan
  public static lightWhite: string = "\x1b[107m"; // Light White  
}
