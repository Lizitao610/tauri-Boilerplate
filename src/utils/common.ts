import { z } from "zod";

export const getKeyComboDisplayValue = (keyCombo: string) => {
  return keyCombo.replace("Command", "⌘");
};

export const isValidUrl = (url: string) => {
  try {
    z.string().url().parse(url);
    return true;
  } catch (e) {
    return false;
  }
};
