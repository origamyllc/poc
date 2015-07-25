
cat << EOF > /opt/log-courier/logcourier.conf.json
{

  "network": {
    "servers": [ "$logstash_server:5043" ],
    "transport": "tcp",
    "timeout": 15
  },

  "files": [

    {
      "paths": [
        "/logs/web/error.log"
      ],
      "fields": { "type": "nginx_errors" },
      "codec": {
        "name": "multiline",
        "pattern": "^[0-9]{4}/[0-9]{2}/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2} ",
        "negate": true,
        "what": "previous",
        "previous timeout": "3s"
      }
    },
    {
      "paths": [
        "/logs/app/contracts/*-err.log"
      ],
      "fields": { "type": "contracts_errors" },
      "codec": {
        "name": "multiline",
        "pattern": "^[0-9]{4}/[0-9]{2}/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2} ",
        "negate": true,
        "what": "previous",
        "previous timeout": "3s"
      }
    },
    {
      "paths": [
        "/logs/app/scheduling/*-err.log"
      ],
      "fields": { "type": "scheduling_errors" },
      "codec": {
        "name": "multiline",
        "pattern": "^[0-9]{4}/[0-9]{2}/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2} ",
        "negate": true,
        "what": "previous",
        "previous timeout": "3s"
      }
    }
  ]
}
EOF

./bin/log-courier -config /opt/log-courier/logcourier.conf.json
