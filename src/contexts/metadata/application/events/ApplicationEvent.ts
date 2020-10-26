import { SourceFileUpdated } from './SourceFileUpdated'
import { TestMetdataParsed } from './TestMetadataParsed'

export type ApplicationEvent = TestMetdataParsed | SourceFileUpdated
