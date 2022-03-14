import { pipe } from 'fp-ts/function';
import * as TH from 'fp-ts/These'
import * as D from 'io-ts/src/Decoder2';
import React, { useState } from "react";
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
  const [fields, setFields] = useState<Record<keyof IFormInputs, string>>({
    age: '',
    firstName: ''
  })
  const [errors, setErrors] = useState<FluentErrors<D.ErrorOf<typeof decoder>>>()

  const onSubmit = () => pipe(
    fields,
    decoder.decode,
    TH.mapLeft(fluentErrors),
    TH.fold(setErrors, console.log, setErrors)
  )
  const setField = (k: keyof IFormInputs) => (e: React.FormEvent<HTMLInputElement>) => 
    setFields(f => ({...f, [k]: e.currentTarget.value}))
  
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
      <input type="text" name="firstName" onChange={setField('firstName')} />
      <p>{errors?.firstName?.error.message}</p>

      <input type="text" name="age" onChange={setField('firstName')} />
      <p>{errors?.age?.error && 'not a valid number'}</p>

      <input type="submit" />
    </form>
  );
}
