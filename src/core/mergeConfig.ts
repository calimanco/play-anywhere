import { PaConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/utils'

export interface Strategy {
  keys: Array<keyof PaConfig>
  fn: (val1: any, val2: any) => any
}

const strategies: {
  [key: string]: Strategy['fn']
} = Object.create(null)

const defaultStrategy: Strategy = {
  keys: [],
  fn: (val1, val2) => {
    return val2 == null ? val1 : val2
  }
}

const fromVal2Strategy: Strategy = {
  keys: [],
  fn: (val1, val2) => {
    if (val2 != null) {
      return val2
    }
  }
}

const deepMergeStrategy: Strategy = {
  keys: [],
  fn: (val1, val2) => {
    if (isPlainObject(val2)) {
      return deepMerge(val1, val2)
    } else if (val2 != null) {
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
  const config: PaConfig = {}

  if (c2 != null) {
    for (const key of Object.keys(c2) as Array<keyof PaConfig>) {
      mergeField(key)
    }
  }

  for (const key of Object.keys(c1) as Array<keyof PaConfig>) {
    if (c2?.[key] == null) {
      mergeField(key)
    }
  }

  function mergeField(key: keyof PaConfig): void {
    const strategy =
      strategies[key] != null ? strategies[key] : defaultStrategy.fn
    config[key] = strategy(c1[key], c2?.[key])
  }

  return config
}
