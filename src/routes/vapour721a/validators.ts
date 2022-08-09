import type { Validator } from "$src/types";

export const validateRoyalty = async (value): Validator => {
    if (value == "" || !value) {
        return { error: "Can't be blank" };
    }
    if (value > 100) {
        return { error: "Royalty can't be more than 100%" }
    }
    return true;
};
