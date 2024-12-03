FROM alpine:latest AS builder

RUN apk add --no-cache \
    build-base \
    linux-headers \
    openssl-dev \
    cmake \
    git

WORKDIR /app

COPY . .

RUN g++ -std=c++17 -I./inc/cpp-httplib -I./inc/json/include -o wg_api src/main.cpp

FROM alpine:latest

RUN apk add --no-cache \
    wireguard-tools \
    iproute2 \
    curl \
    bash \
    libstdc++ \
    libgcc

RUN mkdir -p /etc/wireguard /app

COPY --from=builder /app/wg_api /app/wg_api

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
