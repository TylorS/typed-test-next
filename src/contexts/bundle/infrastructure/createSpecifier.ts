import { extname } from 'path'

export function createSpecifier(specifier: string) {
  const extension = extname(specifier)
  const replaceExtension = extension.startsWith('.ts')

  return replaceExtension ? specifier.replace(extension, '') : specifier
}
