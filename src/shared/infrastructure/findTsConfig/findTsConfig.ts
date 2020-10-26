import { makeAbsolute } from '@build/common/makeAbsolute'
import { TsConfig } from '@build/shared/domain'
import * as fs from 'fs'
import { basename, dirname, join } from 'path'
import {
  convertCompilerOptionsFromJson,
  findConfigFile,
  FormatDiagnosticsHost,
  formatDiagnosticsWithColorAndContext,
  getDefaultCompilerOptions,
  parseConfigFileTextToJson,
  sys,
} from 'typescript'

export type FindTsConfigOptions = {
  readonly directory: string
  readonly configFileName?: string
}

export const DEFAULT_TSCONFIG_FILENAME = 'tsconfig.json'

export function findTsConfig({
  directory,
  configFileName = DEFAULT_TSCONFIG_FILENAME,
}: FindTsConfigOptions): TsConfig {
  const configPath = findConfigFile(directory, sys.fileExists, configFileName)

  if (!configPath) {
    throw new Error(
      `Unable to find TypeScript configuration @ ${makeAbsolute(directory, configFileName)}`,
    )
  }

  const formatHost: FormatDiagnosticsHost = {
    getCanonicalFileName: (path) => makeAbsolute(directory, path),
    getCurrentDirectory: () => directory,
    getNewLine: () => sys.newLine,
  }
  const baseConfig = parseConfigFile(directory, configPath, formatHost)

  if (baseConfig.extends) {
    const extensions = Array.isArray(baseConfig.extends) ? baseConfig.extends : [baseConfig.extends]
    const extendedConfigPaths = extensions.map((ext) => join(dirname(configPath), ext))
    const extendedConfigs = extendedConfigPaths.map((path) =>
      parseConfigFile(directory, path, formatHost),
    )

    return extendedConfigs.reduceRight(mergeConfigs, baseConfig)
  }

  return baseConfig
}

function mergeConfigs(base: TsConfig, extension: TsConfig): TsConfig {
  return {
    ...extension,
    ...base,
    compilerOptions: {
      ...extension.compilerOptions,
      ...base.compilerOptions,
    },
  }
}

// TODO: use environment to read file
function parseConfigFile(
  directory: string,
  filePath: string,
  host: FormatDiagnosticsHost,
): TsConfig {
  const fileName = basename(filePath)
  const contents = fs.readFileSync(filePath).toString()
  const { config } = parseConfigFileTextToJson(filePath, contents)
  const { options, errors } = convertCompilerOptionsFromJson(
    config.compilerOptions,
    directory,
    fileName,
  )

  if (errors && errors.length > 0) {
    throw new Error(formatDiagnosticsWithColorAndContext(errors, host))
  }

  return {
    ...config,
    compilerOptions: { ...getDefaultCompilerOptions(), ...options },
    configPath: filePath,
  }
}
