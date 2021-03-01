import { sum } from 'fp-ts-std/Array';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Tree';

export const isLeaf = <A,>(tree: T.Tree<A>): boolean => tree.forest.length === 0

export const numLeaves = T.fold((_, bs: Array<number>) => (bs.length === 0 ? 1 : sum(bs)))

const forestGridByLevelInternal = <A,>(
  forest: Array<T.Tree<A> | undefined>
): Array<Array<{ numLeaves: number; value: O.Option<A> }>> => pipe(
  forest,
  A.chain((col): Array<T.Tree<A> | undefined> => col ? col.forest : [undefined]),
  O.fromPredicate(A.some(column => column ? !isLeaf(column) : false)),
  O.fold(() => A.empty, forestGridByLevelInternal),
  A.cons(pipe(
    forest,
    A.map(node => ({
      value: pipe(node, O.fromPredicate((c): c is T.Tree<A> => (!!c && !isLeaf(c))), O.map(c => c.value)),
      numLeaves: node && !isLeaf(node) ? numLeaves(node) : 1
    }))
  ))
)

/**
 * Turns a Forest into a grid (2D array), organized by level & excluding leaves.
 * 
 * 
 * The total 'numLeaves' of each level should all be equivalent.
 * Elements w/ empty values are used to achieve this.
 * 
 * @example
 * 
 * const forest: T.Forest<string> = [
 *   {
 *     value: 'P1',
 *     forest: [
 *       {
 *         value: 'S1',
 *         forest: [
 *           { value: 'Leaf 1', forest: [] },
 *           { value: 'Leaf 2', forest: [] }
 *         ]
 *       }
 *     ]
 *   },
 *   {
 *     value: 'P2',
 *     forest: [
 *       { value: 'Leaf 3', forest: [] },
 *       { value: 'Leaf 4', forest: [] }
 *     ]
 *   }
 * ]
 * 
 * const grid: { numLeaves: number; value: O.Option<string> }[][] = [
 *   [ { numLeaves: 2, value: O.some('P1') },  { numLeaves: 2, value: O.some('P2') } ],
 *   [ { numLeaves: 2, value: O.some('S1') }, { numLeaves: 2, value: O.none } ],
 * ]
 * 
 * assert.deepStrictEqual(forestGridByLevel(forest), grid)
 */
export const forestGridByLevel = <A,>(forest: T.Forest<A>) => forestGridByLevelInternal(forest)

/**
 * Turns a Forest into an Array of it's leaves.
 * 
 * @example
 * 
 * const forest: T.Forest<string> = [
 *   {
 *     value: 'P1',
 *     forest: [
 *       {
 *         value: 'S1',
 *         forest: [
 *           { value: 'Leaf 1', forest: [] },
 *           { value: 'Leaf 2', forest: [] }
 *         ]
 *       }
 *     ]
 *   },
 *   {
 *     value: 'P2',
 *     forest: [
 *       { value: 'Leaf 3', forest: [] },
 *       { value: 'Leaf 4', forest: [] }
 *     ]
 *   }
 * ]
 * 
 * const leaves: string[] = [
 *   'Leaf 1', 'Leaf 2', 'Leaf 3', 'Leaf 4'
 * ]
 * 
 * assert.deepStrictEqual(forestLeaves(forest), leaves)
 */
export const forestLeaves = <A,>(forest: T.Forest<A>): Array<A> => pipe(
  forest,
  A.chain(
    col => isLeaf(col)
      ? [col.value]
      : forestLeaves(col.forest)
  )
)
