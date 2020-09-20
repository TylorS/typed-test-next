import { join } from 'path'
import * as rimraf from 'rimraf'

import { compiledFiles, MODULES, ROOT_DIR, ROOT_FILES } from './common'

ROOT_FILES.forEach((file) => compiledFiles(file).forEach((f) => rimraf.sync(f.replace('/', ''))))
MODULES.map((m) => join(ROOT_DIR, m)).forEach((d) => rimraf.sync(d))
