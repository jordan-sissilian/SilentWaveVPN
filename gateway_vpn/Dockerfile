FROM devopsfaith/krakend AS krakend

RUN apk add --no-cache jq bash

WORKDIR /etc/krakend

COPY krakend/krakend.json .
COPY scripts/*.sh scripts/
COPY data/*.json data/

RUN chmod +x scripts/*.sh

EXPOSE 8080

CMD ["./scripts/run.sh"]
