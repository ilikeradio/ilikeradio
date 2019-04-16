All channels data:
https://app.khz.se/api/v2/channel

All programs:
https://app.khz.se/api/v2/program
Current:
https://app.khz.se/api/v2/program/current | Requires GET data: channel_id=2 for instance
                z.channel_id = b, z.with = "host,buttons,images", jQuery.ajax({
                    url: mtg_config.apiUrl + "program/current",
                    dataType: "json",
                    method: "get",
                    data: z,

EXAMPLE: https://app.khz.se/api/v2/program/current?channel_id=2

All categories:
https://app.khz.se/api/v2/category

All hosts:
https://app.khz.se/api/v2/host

Channel id: 2
Name: Bandit ROCK
Specific JSON data:
https://app.khz.se/api/v2/channel/2/


CDN for images:
http://cdn.khz.se/images/

e.g BANDIT logo_:
http://cdn.khz.se/images/63808dd23f61e6193a9007a927189e13.png



Some keys
mtg_config = {
    defaultStationId: "3",
    podcastsChannelId: 57,
    apiUrl: "https://app.khz.se/api/v2/",
    apiKey: "303wDNMCUmopWLn1",
    apiSecret: "3daW44v2FJd01KE72AZGhD6zn3qlxYfRQVbbaKIrNDkr40mWyL",
    apiDomain: "app.khz.se",
    apiPath: "/api/v2/",
    cdnUrl: "https://cdn.khz.se/images/",
    baseUrl: "/wp-content/themes/ilikeradio/assets/",
    clientApiUrl: "https://app.khz.se/v1/",
    beatUrl: "https://beat.khz.se",
    ajax: {
        rootUrl: "https://" + window.location.hostname,
        containerID: "container"
    }
