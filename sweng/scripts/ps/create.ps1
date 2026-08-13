schtasks /Create /TN "RedBank Proj" /SC HOURLY /MO 1 /TR "E:\CSSWENG\Blood\sweng\scripts\cron\event_update.cmd" /F /RU "$env:USERDOMAIN\$env:USERNAME" /NP
