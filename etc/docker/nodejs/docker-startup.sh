pm2 start /app/server.js -i 3 -n contracts --merge-logs -e /logs/contracts-err.log -o /logs/contracts-out.log --watch
pm2 web

/usr/sbin/sshd -D
