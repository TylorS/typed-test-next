import { CompilerOptions } from 'ts-morph'

export type TsConfig = {
  readonly compilerOptions: CompilerOptions
  readonly configPath: string
  readonly extends?: string | string[]
  readonly files?: string[]
  readonly include?: string[]
  readonly exclude?: string[]
}
