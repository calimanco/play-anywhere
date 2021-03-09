import { PaConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/utils'

const strategies = Object.create(null)

function defaultStrategy(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strategy(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

function deepMergeStrategy(val1: any, val2: any): any {
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

const strategyKey1 = ['url', 'params', 'data']

strategyKey1.forEach(key => {
  strategies[key] = fromVal2Strategy
})

const strategyKey2 = ['headers', 'auth']

strategyKey2.forEach(key => {
  strategies[key] = deepMergeStrategy
})

export default function mergeConfig(c1: PaConfig, c2?: PaConfig): PaConfig {
  const config = Object.create(null)

  if (c2 != null) {
    for (const key in c2) {
      mergeField(key)
    }
  }

  for (const key in c1) {
    if ((c2 as any)[key] != null) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strategy = strategies[key] != null ? strategies[key] : defaultStrategy
    config[key] = strategy((c1 as any)[key], (c2 as any)[key])
  }

  return config
}
