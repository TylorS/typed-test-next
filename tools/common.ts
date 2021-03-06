import { readdirSync, statSync } from 'fs'
import { dirname, join } from 'path'

export const ROOT_DIR = dirname(__dirname)
export const SOURCE_DIR = join(ROOT_DIR, 'src')

export const ROOT_FILES = ['index']

export function compiledFiles(name: string): readonly string[] {
  name = name.replace(/.tsx?$/, '')

  return [`/${name}.ts`, `/${name}.d.ts`, `/${name}.d.ts.map`, `/${name}.js`, `/${name}.js.map`]
}

export const MODULES: ReadonlyArray<string> = readdirSync(SOURCE_DIR).filter((path) =>
  statSync(join(SOURCE_DIR, path)).isDirectory(),
)
