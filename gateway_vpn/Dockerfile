FROM devopsfaith/krakend AS krakend

WORKDIR /etc/krakend
COPY krakend/krakend.json /etc/krakend/

EXPOSE 8080

CMD ["krakend", "run", "-c", "/etc/krakend/krakend.json"]
