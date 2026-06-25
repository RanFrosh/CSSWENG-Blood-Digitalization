const sorterBase = ['up', 'down'] as const;

export type Sorter = typeof sorterBase[number];