FROM devopsfaith/krakend AS krakend

RUN apk add --no-cache jq bash

WORKDIR /etc/krakend

COPY krakend/krakend.json .
COPY scripts/*.sh scripts/
COPY data/*.json data/

RUN chmod +x scripts/*.sh

RUN /bin/bash scripts/config_krakend.sh && \
    scripts/config_vpn_api.sh && \
    scripts/config_endpoint_vpn_api.sh

EXPOSE 8080

CMD ["krakend", "run", "-c", "krakend.json"]
