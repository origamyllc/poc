docker run -d --name="scarmod-logcourier" -v /var/log/nginx:/logs/web  -v /var/log:/logs/app -e "logstash_server=utilp1ea10.turner.com"  scarmod/logcourier
