# 0 为深色模式，1 为浅色模式
$out = reg.exe query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize /v SystemUsesLightTheme
$outStr = $out -as [string]
if ($outStr -match '(SystemUsesLightTheme.+0x)(\d)') {
    $mode = $Matches[2]
} else {
    $mode = 1
}

if ($mode -as [int] -eq 1) {
    $night = 0
} else {
    $night = 1
}

reg.exe add HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize /v AppsUseLightTheme /t REG_DWORD /d $night /f
reg.exe add HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize /v SystemUsesLightTheme /t REG_DWORD /d $night /f