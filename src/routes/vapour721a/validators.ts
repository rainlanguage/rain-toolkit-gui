export const validateRoyalty = async (value): Promise<true | { error: string }> => {
    console.log(value)
    if (value == "") {
        return { error: "Can't be blank" };
    }
    if (value > 100) {
        return { error: "Royalty can't be more than 100%" }
    }
    return true;
};
