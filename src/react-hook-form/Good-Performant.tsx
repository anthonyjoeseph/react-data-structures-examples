import { pipe, flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option'
import * as TH from 'fp-ts/These'
import * as R from 'fp-ts/ReadonlyRecord';
import * as D from 'io-ts/src/Decoder2';
import React, { useRef, useState } from "react";
import { parseFloat, minLength } from './io-ts-types';
import { fluentErrors, FluentErrors } from './fluentErrors'

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

export default function App() {
  const fieldRefs = useRef<Record<keyof IFormInputs, HTMLInputElement | null>>({
    age: null,
    firstName: null
  })
  const [errors, setErrors] = useState<FluentErrors<D.ErrorOf<typeof decoder>>>()

  const onSubmit = () => {
    pipe(
      fieldRefs.current,
      R.map(elem => O.fromNullable(elem?.value)),
      R.sequence(O.Applicative),
      O.map(flow(
        decoder.decode,
        TH.mapLeft(fluentErrors),
        TH.fold(setErrors, console.log, setErrors)
      ))
    )
  }
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
      <input type="text" name="firstName" ref={ref => {
        if (!fieldRefs.current.firstName) {
          fieldRefs.current.firstName = ref
          ref?.addEventListener('input', onSubmit)
        }
      }} />
      {errors?.firstName?.error.message && (
        <p>{errors?.firstName?.error.message}</p>
      )}

      <input type="text" name="age" ref={ref => {
        if (!fieldRefs.current.age) {
          fieldRefs.current.age = ref
          ref?.addEventListener('input', onSubmit)
        }
      }} />
      {errors?.age?.error.actual && (
        <p>{errors?.firstName?.error.message}</p>
      )}

      <input type="submit" />
    </form>
  );
}
