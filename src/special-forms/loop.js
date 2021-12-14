/*
goals for this special form:

(loop :for ((i 1) (< i 20) (inc i))
  statement1
  statement2
  ...)

(loop :while (something-true)
  statement1
  statement2
  ...)

(loop :let i :in (some-collection)
  statement1
  statement2
  ...)

*/

import { specialFormType, tokenType } from '../types/types'

function loopSpecialForm(code) {}

export default [tokenType('loop'), specialFormType(`<loop special form>`, loopSpecialForm)]
