import { pipe, flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option'
import * as TH from 'fp-ts/These'
import * as R from 'fp-ts/ReadonlyRecord';
import * as D from 'io-ts/src/Decoder2';
import * as DE from 'io-ts/src/DecodeError2';
import * as A from 'fp-ts/ReadonlyArray'
import React, { useRef, useState } from "react";
import { parseFloat, minLength } from './io-ts-types';

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

const submit = (inputs: IFormInputs): void => {
  console.log(inputs)
}

export default function App() {
  const fieldRefs = useRef<Record<keyof IFormInputs, HTMLInputElement | null>>({
    age: null,
    firstName: null
  })
  const [errors, setErrors] = useState<O.Option<D.ErrorOf<typeof decoder>>>(O.none)

  const onSubmit = () => {
    pipe(
      fieldRefs.current,
      R.map(elem => O.fromNullable(elem?.value)),
      R.sequence(O.Applicative),
      O.map(flow(
        decoder.decode, 
        TH.fold(flow(O.some, setErrors), submit, flow(O.some, setErrors))
      ))
    )
  }
  const firstNameError = pipe(
    errors,
    O.map(es => es.errors),
    O.map(A.map(a => pipe(
      a.error.errors,
      A.findFirst(
        (b): b is Extract<typeof b, DE.RequiredKeyE<'firstName', unknown>> => 
          b._tag === 'RequiredKeyE' && b.key === 'firstName'
      )
    ))),
    O.map(A.compact),
    O.chain(A.lookup(0)),
  )
  const ageError =  pipe(
    errors,
    O.map(es => es.errors),
    O.map(A.map(a => pipe(
      a.error.errors,
      A.findFirst(
        (b): b is Extract<typeof b, DE.RequiredKeyE<'age', unknown>> => 
          b._tag === 'RequiredKeyE' && b.key === 'age'
      )
    ))),
    O.map(A.compact),
    O.chain(A.lookup(0)),
  )
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
      <input type="text" name="firstName" ref={ref => {
        if (!fieldRefs.current.firstName) {
          fieldRefs.current.firstName = ref
          ref?.addEventListener('input', onSubmit)
        }
      }} />
      {pipe(
        firstNameError, 
        O.map(e => e.error.error.message), 
        O.fold(() => undefined, (m) => <p>{m}</p>)
      )}

      <input type="text" name="age" ref={ref => {
        if (!fieldRefs.current.age) {
          fieldRefs.current.age = ref
          ref?.addEventListener('input', onSubmit)
        }
      }} />
      {pipe(
        ageError, 
        O.map(e => e.error.error.actual), 
        O.fold(() => undefined, (m) => <p>{JSON.stringify(m)}</p>)
      )}

      <input type="submit" />
    </form>
  );
}
