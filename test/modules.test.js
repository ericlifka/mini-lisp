import { resetModules, run } from './test-run-helper'

describe('module systems', () => {
    afterEach(() => {
        resetModules()
    })

    test('can create and access a simple module', () => {
        expect(
            run(`
        (let ()
          (module mod
            (function get-five () 5))

          (import mod)
          (mod/get-five))`)
        ).toBe('5')
    })

    test('can rename modules', () => {
        expect(
            run(`
        (let ()
          (module mod
            (function get-five () 5))

          (import (mod :as m))
          (m/get-five))`)
        ).toBe('5')
    })

    test('modules have a lexical scope', () => {
        expect(
            run(`
        (let (x 2)
          (module mod
            (function get-x () x))
          
          (import mod)
          (mod/get-x))`)
        ).toBe('2')
    })

    test('module lookup symbols can only be one deep', () => {
        expect(() => run(`(module/thing/other-stuff 5)`)).toThrow(
            `Symantic error: can only have one module lookup in a symbol`
        )
    })

    test('error if module not imported', () => {
        expect(() =>
            run(`
        (let () 
          (module mod
            (function get-3 () 3))

          (mod/get-3)
        )`)
        ).toThrow(`Lexical error: mod not imported in this scope`)
    })

    test('module import can be found up scope chain', () => {
        expect(
            run(`
        (let ()
          (module mod
            (function get-3 () 3))
          
          (import mod)
          (let ()
            (let ()
              (mod/get-3))))
        `)
        ).toBe('3')
    })

    test('can import more than one module at once', () => {
        expect(
            run(`
        (let ()
          (module module-1
            (function get-3 () 3))
          (module module-2
            (function get-4 () 4))

          (import module-1
                 (module-2 :as m2))
          (+ (module-1/get-3) (m2/get-4)))
        `)
        ).toBe('7')
    })

    test('modules can import other modules', () => {
        expect(
            run(`
        (let ()
          (module mod
            (function add-3 (x) (+ 3 x)))

          (module other-module
            (import mod)
            (function add-6 (x)
              (mod/add-3 (mod/add-3 x))))

          (import other-module)
          (other-module/add-6 7))
        `)
        ).toBe('13')
    })
})
