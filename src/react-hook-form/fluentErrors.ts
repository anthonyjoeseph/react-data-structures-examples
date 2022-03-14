import { pipe } from 'fp-ts/function';
import * as D from 'io-ts/src/Decoder2';
import { parseFloat, minLength } from './io-ts-types';
import * as DE from 'io-ts/src/DecodeError2'

type UnionToIntersection<T> = 
  (T extends any ? (x: T) => any : never) extends 
  (x: infer R) => any ? R : never

export type FluentErrors<E> = UnionToIntersection<_FluentErrors<E>>
  
type _FluentErrors<E> = 
  E extends DE.RequiredKeyE<infer A, infer B>
    ? { [K in Extract<A, string | number | symbol>]?: B }
    : E extends DE.CompoundE<infer A>
    ? _FluentErrors<A>
    : E extends DE.PrevE<infer A>
    ? _FluentErrors<A>
    : E extends DE.NextE<infer A>
    ? _FluentErrors<A>
    : never









type TestErrors = D.ErrorOf<typeof decoder>
type TestFluent = FluentErrors<TestErrors>
  
export declare const fluentErrors: <E>(e: E) => FluentErrors<E> 

declare const test: TestFluent
test.age?.error.actual

interface IFormInputs {
  firstName: string
  age: number
}

const decoder = pipe(
  D.id<Record<keyof IFormInputs, string>>(),
  D.compose(D.fromStruct({
    firstName: minLength(2),
    age: parseFloat,
  }))
)