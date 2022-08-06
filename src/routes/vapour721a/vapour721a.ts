export const arrayAdd = (array: any[], add: any) => {
    return array = [
        ...array,
        add
    ];
};

export const arrayRemove = (array: any[], i: number) => {
    return array = [
        ...array.slice(0, i),
        ...array.slice(i + 1),
    ];
};