import { pipe, flow } from 'fp-ts/function';
import * as R from 'fp-ts/ReadonlyRecord';
import * as t from 'io-ts';
import {failure} from 'io-ts/PathReporter'
import * as E from 'fp-ts/Either'
import { IntFromString } from 'io-ts-types/IntFromString';
import React, { useRef, useState } from "react";

const schema = t.type({
  firstName: t.string,
  age: IntFromString,
});
type IFormInputs = t.TypeOf<typeof schema>

const onSubmit = (setErrors: (e: t.Errors) => void) => flow(
  schema.decode,
  E.fold(
    setErrors,
    console.log,
  )
);

export default function App() {
  const fieldRefs = useRef<Record<keyof IFormInputs, HTMLInputElement | null>>({
    age: null,
    firstName: null
  })
  const [errors, setErrors] = useState<t.Errors>()

  return (
    <form onSubmit={() => pipe(
      fieldRefs.current,
      R.map(elem => elem?.value),
      onSubmit(setErrors)
    )}>
      <input type="text" name="firstName" ref={ref => fieldRefs.current.firstName = ref} />
      <p/>

      <input type="text" name="age" ref={ref => fieldRefs.current.age = ref} />
      <p>{errors ? failure(errors).join(', ') : ''}</p>
      
      <input type="submit" />
    </form>
  );
}