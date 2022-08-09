// NFTs

export type NFTData = {
    imageSrc: string;
    name: string;
    description: string;
    tokenId?: number;
    totalSupply: number;
    address?: string;
};

export type Validator = Promise<true | { error: string }>