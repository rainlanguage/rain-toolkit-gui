import { isAddress } from "ethers/lib/utils";
const re = new RegExp('^[a-zA-Z0-9 ]*$');

export const addressValidate = async (value): Promise<true | { error: string }> => {
  if (value == "") {
    return { error: "Can't be blank" };
  }
  if (!isAddress(value)) {
    return { error: "Not a valid Ethereum address" };
  }
  return true;
};

export const required = async (value): Promise<true | { error: string }> => {
  if (typeof value == 'string' && value == "") {
    return { error: "Can't be blank" };
  }
  if (typeof value == 'string' && !re.test(value)) {
    return { error: "Enter valid string" };
  }
  if (typeof value == 'number' && (value == undefined || value == null)) {
    return { error: "Can't be blank" };
  }
  if (value == undefined || value == null) {
    return { error: "Can't be blank" };
  }
  return true;
};

export const defaultValidator = () => {
  return true;
};