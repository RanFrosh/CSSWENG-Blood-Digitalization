const directionBase = ['up', 'down'] as const;

type one_direction = typeof directionBase[number];

export type SorterShape<Skibidi> = {
    col: keyof Skibidi
    direction: one_direction
}

export type Sorter<Skibidi> = SorterShape<Skibidi>[];