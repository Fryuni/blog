export enum Ordering {
  LEFT = -1,
  EQUAL = 0,
  RIGHT = 1,
}

type Comparison<T> = (a: T, b: T) => Ordering;

export class Heap<T> {
  private readonly heap: T[] = [];

  // eslint-disable-next-line no-useless-constructor -- private constructor
  private constructor(private readonly comparison: Comparison<T>) {
    // NOP
  }

  public get size(): number {
    return this.heap.length;
  }

  public static min(): Heap<number> {
    return new Heap(
      (a, b) => {
        if (a < b) return Ordering.LEFT;

        if (a > b) return Ordering.RIGHT;

        return Ordering.EQUAL;
      },
    );
  }

  public static max(): Heap<number> {
    return new Heap(
      (a, b) => {
        if (a < b) return Ordering.RIGHT;

        if (a > b) return Ordering.LEFT;

        return Ordering.EQUAL;
      },
    );
  }

  public static of<T>(comparison: Comparison<T>): Heap<T> {
    return new Heap(comparison);
  }

  public insert(value: T): void {
    this.heap.push(value);
    this.bubbleUp();
  }

  public peek(): T | undefined {
    return this.heap[0];
  }

  public pop(): T | undefined {
    const value = this.heap[0];
    const last = this.heap.pop();

    if (this.size > 0 && last !== undefined) {
      this.heap[0] = last;
      this.bubbleDown();
    }

    return value;
  }

  private bubbleUp(): void {
    let index = this.heap.length - 1;

    while (index > 0) {
      const parentIndex = parent(index);

      const item = this.heap[index]!;
      const parentItem = this.heap[parentIndex]!;

      if (this.comparison(item, parentItem) === Ordering.LEFT) {
        this.heap[parentIndex] = item;
        this.heap[index] = parentItem;
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private bubbleDown(): void {
    let index = 0;

    while (index < this.heap.length) {
      const item = this.heap[index]!;

      let childIndex: number;
      let child: T;

      {
        const leftIndex = left(index);
        const rightIndex = right(index);

        const leftItem = this.heap[leftIndex];
        const rightItem = this.heap[rightIndex];

        if (leftItem === undefined) {
          // No children
          return;
        }

        if (rightItem === undefined) {
          // Only left child
          childIndex = leftIndex;
          child = leftItem;
        } else if (this.comparison(leftItem, rightItem) !== Ordering.RIGHT) {
          // Left child comes first
          childIndex = leftIndex;
          child = leftItem;
        } else {
          // Right child comes first
          childIndex = rightIndex;
          child = rightItem;
        }
      }

      if (this.comparison(item, child) === Ordering.RIGHT) {
        this.heap[childIndex] = item;
        this.heap[index] = child;
        index = childIndex;
      }
    }
  }
}

function parent(index: number): number {
  return Math.floor((index - 1) / 2);
}

function left(index: number): number {
  return 2 * index + 1;
}

function right(index: number): number {
  return 2 * index + 2;
}
