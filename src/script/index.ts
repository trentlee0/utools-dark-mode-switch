import {isUTools} from '@/util/common'
import {Script, EmptyScriptImpl} from '@/script/base'
import {MacOsScript} from '@/script/macos'
import {WindowsScript} from '@/script/windows'

function getScript(): Script {
  if (!isUTools()) return new EmptyScriptImpl()
  return utools.isWindows() ? new WindowsScript() : new MacOsScript()
}

export default getScript()
