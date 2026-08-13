@echo off
curl.exe -s -o NUL -H "Authorization: Bearer lovesweng" http://localhost:3000/api/cron/update-event-statuses