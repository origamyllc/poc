# Pull base image.
FROM dockerfile/java

MAINTAINER Scarmod Contracts Team "ScarModContracts@Turner.com"

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update --fix-missing
RUN apt-get install -y curl software-properties-common wget git ruby ruby-dev

# Install GO
RUN cd /opt && \
  wget http://golang.org/dl/go1.3.linux-amd64.tar.gz && \
  tar -C . -zxvf go1.3.linux-amd64.tar.gz && \
  tar -C /usr/local -xzf go1.3.linux-amd64.tar.gz && \
  ln go/bin/* /usr/local/bin && \
  rm -f go1.3.linux-amd64.tar.gz


# Get Logstash-courier bits
RUN cd /opt && \
  git clone https://github.com/driskell/log-courier && \
  cd log-courier && \
  make

ADD logcourier-start.sh /opt/log-courier/logcourier-start.sh

WORKDIR /opt/log-courier

CMD . /opt/log-courier/logcourier-start.sh
