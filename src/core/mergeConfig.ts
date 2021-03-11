import { PaConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/utils'

export interface Strategy {
  keys: string[]
  fn: (val1: any, val2: any) => any
}

const strategies = Object.create(null)

const defaultStrategy: Strategy = {
  keys: [],
  fn: (val1, val2) => {
    return typeof val2 !== 'undefined' ? val2 : val1
  }
}

const fromVal2Strategy: Strategy = {
  keys: [],
  fn: (val1, val2) => {
    if (typeof val2 !== 'undefined') {
      return val2
    }
  }
}

const deepMergeStrategy: Strategy = {
  keys: [],
  fn: (val1, val2) => {
    if (isPlainObject(val2)) {
      return deepMerge(val1, val2)
    } else if (typeof val2 !== 'undefined') {
      return val2
    } else if (isPlainObject(val1)) {
      return deepMerge(val1)
    } else {
      return val1
    }
  }
}

fromVal2Strategy.keys.forEach(key => {
  strategies[key] = fromVal2Strategy.fn
})

deepMergeStrategy.keys.forEach(key => {
  strategies[key] = deepMergeStrategy.fn
})

export default function mergeConfig(c1: PaConfig, c2?: PaConfig): PaConfig {
  const config = Object.create(null)

  if (c2 != null) {
    Object.keys(c2).forEach(key => {
      mergeField(key)
    })
  }

  Object.keys(c1).forEach(key => {
    if (c2 != null && (c2 as any)[key] != null) {
      mergeField(key)
    }
  })

  function mergeField(key: string): void {
    const strategy = strategies[key] != null ? strategies[key] : defaultStrategy
    config[key] = strategy((c1 as any)[key], (c2 as any)[key])
  }

  return config
}
