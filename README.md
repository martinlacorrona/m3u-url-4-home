# M3U URL 4 HOME
I created this project to run on my raspberry's home to avoid change every time M3U URL in all TVs.
Now, instead of change in all my TVs and smart devices, I need to change URL on my TVs ONETIME to http://pi.hole:3000 and then, I only need to update ".env" file in raspberry every time I change M3U playlist, but not in every device. :)

## How to use
Create a "config.json" file in root folder and set like this:
```sh
{
    "URL": "http://iptv.getlist.com:8880/get.php?username=user&password=pass&type=m3u_plus&output=mpegts",
    "REGEX_PATTERN": "#.*group-title=\"ES.*",
    "PORT": 3000
}
```
You can rename "configExample.json" file to "config.json".

Then, run:
```sh
npm start
```
This should install all dependencies.
This tool was created with NodeJS v14, but this should works with v10+.

### How to edit config via REST
- GET ```http://localhost:3000/config ```
```sh
{
    "regexPattern": "#.*group-title=\"ES.*",
    "url": "http://iptv.getlist.com:8880/get.php?username=user&password=pass&type=m3u_plus&output=mpegts",
    "port": "3000"
}
```
- POST ```http://localhost:3000/config?port=3000&regexPattern=%23.*group-title="ES.*&url=http://iptv.getlist.com:8880/get.php?username=user%26password=pass%26type=m3u_plus%26output=mpegts ```
```sh
{
    "regexPattern": "#.*group-title=\"ES.*",
    "url": "http://iptv.getlist.com:8880/get.php?username=user&password=pass&type=m3u_plus&output=mpegts",
    "port": "3000"
}
```