# Pull base image.
FROM ubuntu:14.04

MAINTAINER Scarmod Contracts Team "ScarModContracts@Turner.com"

RUN apt-get update --fix-missing
RUN apt-get install -y curl software-properties-common

RUN echo "deb http://archive.ubuntu.com/ubuntu trusty main universe" > /etc/apt/sources.list
RUN apt-get update
RUN apt-get upgrade -y

# Install lighttpd & supervisor
RUN apt-get install -y lighttpd supervisor wget

# Install Java
RUN \
  echo debconf shared/accepted-oracle-license-v1-1 select true | debconf-set-selections && \
  echo debconf shared/accepted-oracle-license-v1-1 seen true | debconf-set-selections && \
  add-apt-repository -y ppa:webupd8team/java && \
  apt-get update && \
  apt-get install -y oracle-java7-installer

# Install ElasticSearch
RUN cd /opt && \
  wget --no-check-certificate https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.2.1.tar.gz && \
  tar -xvzf elasticsearch-1.2.1.tar.gz && \
  mv elasticsearch-1.2.1 elasticsearch && \
  cd /usr/local/bin && \
  ln -s /opt/elasticsearch/bin/* . && \
  rm -f /opt/elasticsearch-1.2.1.tar.gz


# Install LogStash
RUN cd /opt && \
  curl -O https://download.elasticsearch.org/logstash/logstash/logstash-1.4.2.tar.gz && \
  tar zxvf logstash-1.4.2.tar.gz && \
  mv logstash-1.4.2 logstash && \
  rm -f logstash-1.4.2.tar.gz


# Install Kibana
RUN cd /opt && \
  curl -O https://download.elasticsearch.org/kibana/kibana/kibana-3.1.0.tar.gz && \
  tar zxvf kibana-3.1.0.tar.gz && \
  cp -r kibana-3.1.0/* /var/www && \
  rm -f kibana-3.1.0.tar.gz

# Make Logstash Dashboard the default Dashboard
RUN mv /var/www/app/dashboards/logstash.json /var/www/app/dashboards/default.json

RUN mkdir -p /var/log/supervisor

ADD logstash.conf /etc/logstash/logstash.conf

COPY log-courier-0.12.gem /opt/logstash/log-courier-0.12.gem

# Build  & Install logstash gem via jRuby
RUN cd /opt/logstash && \
  export GEM_HOME=vendor/bundle/jruby/1.9 && \
  java -jar vendor/jar/jruby-complete-1.7.11.jar -S gem install /opt/logstash/log-courier-0.12.gem

# Copy logcourier-plugins to logstash distro
ADD courier-inputplugin.rb /opt/logstash/lib/logstash/inputs/courier.rb

ADD courier-outputplugin.rb /opt/logstash/lib/logstash/outputs/courier.rb

ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord"]

# Expose ports.
# 80   = lighttpd (webserver)
# 9200 = ElasticSearch
# 5545 = LogStash UDP Port
# 5546 = LogStash TCP Port
# 9292 = LogStash Web Port
# 5043 = LogStash Courier Port
EXPOSE 80 9200 5545 5546 9292 5043
