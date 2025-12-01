FROM ubuntu:22.04

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=/usr/local/bin sh -s 1.3.1
RUN arduino-cli config init
RUN arduino-cli core update-index && arduino-cli core install arduino:avr

CMD ["tail", "-f", "/dev/null"]
