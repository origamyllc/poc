ELK Dockerfile
================

The [ELK](http://www.elasticsearch.org/overview/elkdownloads/) Docker container is used by Scarmod for consolidating all logs (app, nginx, syslogs) across all environments (dev, qa, uat) into one centralized store.  [ELK](http://www.elasticsearch.org/overview/elkdownloads/) is comprised of three (3) components:  [ElasticSearch](http://www.elasticsearch.org/), [LogStash](http://logstash.net/) and [Kibana](http://www.elasticsearch.org/overview/kibana/).

- [Kibana Website](#markdown-header-kibana-website)
- [App Logging](#markdown-header-app-logging)
    - [1. Access log via request or response object](#markdown-header-1-access-log-via-request-or-response-object)
    - [2. Require the logging module](#markdown-header-2-require-the-logging-module)
- [Controlling Logging Output](#markdown-header-controlling-logging-output)
- [Log Configuration](#markdown-header-log-configuration)
- [Log Shipping](#markdown-header-log-shipping)
- [Components Explained](#markdown-header-components-explained)

### Kibana Website
The default ScarMod [Kibana](http://www.elasticsearch.org/overview/kibana/) site is located [here](http://utilp1ea10.turner.com).  *Note:*  This url may change.

### App Logging
The Contracts app of ScarMod now uses [Bunyan](https://github.com/trentm/node-bunyan) for all logging.  There are two ways to gain access to a logger in [express](http://expressjs.com/):

#### 1. Access log via request or response object
```javascript
exports.index = function(req, res) {
  
  req.log.info('use request object');
  //or 
  res.log.info('use response object as well');
  
  return res.json({ message: 'Hello World'});
}
```

#### 2. Require the logging module
```javascript
var logger = require('./logger');

logger.info('logging now');
```

### Controlling Logging Output

By default, [Bunyan](https://github.com/trentm/node-bunyan) outputs all log messages in [JSON](http://json.org/) format (see below):

    {"name":"contracts-dev","hostname":"Someone's-MacBook-Air.local",
    "pid":68534,"level":30,"msg":"127.0.0.1 <-- GET / HTTP/1.1 200 6950
    - Chrome 36.0 Mac OS X 10.9.4 52 ms","time":"2014-07-30T02:55:06.115Z","v":0}

Admittedly, this isn't very human readable.  Fortunately, there's a module for [that](https://www.npmjs.org/package/bunyan-prettystream).  By piping any output of bunyan through the [bunyan-prettystream](https://www.npmjs.org/package/bunyan-prettystream) module we lose the verbosity of JSON output of bunyan.  We can configure a logger using prettystream as follows:

```javascript
 var bunyan = require('bunyan');
  var PrettyStream = require('bunyan-prettystream');

  var prettyStdOut = new PrettyStream();
  prettyStdOut.pipe(process.stdout);

  var logger = bunyan.createLogger({
   name: 'foo',
   streams: [{
   level: 'debug',
   type: 'raw',
   stream: prettyStdOut
  }]
});
```

Which will result in the following output:

    2014-07-30T03:04:22.799Z]  INFO: contracts-dev/70191 on Someone's-MacBook-Air.local:
    127.0.0.1 <-- GET / HTTP/1.1 304 - - Chrome 36.0 Mac OS X 10.9.4 65 ms

### Log Configuration

Log configuration occurs in environment specific files.  For example, the preview config has the following snippet for configurating the logger:

```javascript
logging: {
    name: 'contracts-preview',
    streams: [
      {
         stream: process.stdout,
         level: 'info'
      },
      {
         type: "raw",
         level: "info",
         stream: require('bunyan-logstash').createStream({
           host: "utilp1ea10",
           port: 5545
         })
      }
    ]
}
```

### Log Shipping

Consolidation works by shipping logs to LogStash via some transport mechanism.  Most logging frameworks support this functionality out of the box, for example, [Bunyan](https://github.com/trentm/node-bunyan) and [Winston](https://github.com/flatiron/winston).  Below is an example of configuring [Bunyan](https://github.com/trentm/node-bunyan) to ship all logs marked as INFO or higher to LogStash over UDP port 5545:

```javascript
var logger = require('bunyan').createLogger({
  name: 'contracts-dev',
  streams: [{
     type: "raw",
     level: "info",
     stream: require('bunyan-logstash').createStream({
       host: "utilp1ea10.turner.com",
       port: 5545
     })
  }]
});
```

For components that we don't have control over it's internal logging (i.e., [nginx](http://nginx.org/en/) or [apache2](http://httpd.apache.org/docs/current/)), we can utilize something like [log forwarder](https://github.com/elasticsearch/logstash-forwarder).

### Components Explained

The following table explains all the components of this container and how to access each:

|Component         | description              |  port   |
|--------------------|--------------------------|----------|
| ElasticSearch | Provides search capabilities of logs | 9200
| LogStash | Takes input via TCP or UDP and outputs the results to ElasticSearch | 5546/TCP, 5545/UDP
| Kibana | LogStash Dashboard that communicates directly with ElasticSearch | 80
| Lighttpd | Lightweight webserver to host Kibana | 80
