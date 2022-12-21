import {isUTools} from '@/util/common'
import {EmptyScript} from '@/script/common'
import {MacOsScript} from '@/script/macos'
import {WindowsScript} from '@/script/windows'

export default (() => {
  if (!isUTools()) return new EmptyScript()
  if (utools.isWindows()) return new WindowsScript()
  return new MacOsScript()
})()
