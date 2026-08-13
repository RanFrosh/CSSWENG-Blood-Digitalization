$cmdPath = (Resolve-Path (Join-Path $PSScriptRoot "..\cron\event_update.cmd")).Path
schtasks /Create /TN "RedBank Proj" /SC HOURLY /MO 1 /TR "$cmdPath" /F
