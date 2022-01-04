
import type { HexColor } from '../types'
import RXB from './RXB'
import type { RXBArray } from './RXB'

import { Note } from '@tonaljs/tonal'
import type { Scale } from '@tonaljs/scale'

import tinycolor from 'tinycolor2'

export default class Palette {
  divisions: number
  rainbow: RXBArray[]
  constructor(divisions: number = 12) {
    this.divisions = divisions
    this.rainbow = RXB.rainbow(divisions)
  }

  primary(index: number): HexColor {
    index = index % this.rainbow.length
    return toHex(this.rainbow[index])
  }

  complementary(index: number, value: number): HexColor {
    index = index % this.rainbow.length
    const p = this.rainbow[index]
    return toHex(RXB.complementary(p, value))
  }

  neutrals(index: number, value: number, count?: number): HexColor[] {
    index = index % this.rainbow.length
    const p = this.rainbow[index]
    return RXB.neutrals(p, value, count).map(toHex)
  }

  colorForNoteName(noteName: string, scale: Scale|undefined = undefined): HexColor | undefined {
    const note = Note.get(noteName)
    if (!note || note.chroma == null) {
      return undefined
    }
    let muted = false
    let color = this.primary(note.chroma)
    if (scale) {
      muted = true
      for (const sn of scale.notes) {
        if (Note.get(sn).chroma === note.chroma) {
          muted = false
          break
        }
      }
    }
    if (muted) {
      const hsla = tinycolor(color).toHsl()
      hsla.s *= 0.7
      hsla.l *= 0.2
      const c = tinycolor(hsla).toHexString()
      return c
    }
    return this.primary(note.chroma)
  }
}

function toHex(color: RXBArray | string): HexColor {
  if (typeof color === 'string') {
    if (!color.startsWith('#')) {
      return '#' + color
    }
    return color
  }
  return '#' + RXB.rxb2hex(RXB.ryb2rgb(color))
}