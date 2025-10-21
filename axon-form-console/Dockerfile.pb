FROM alpine:latest

ARG PB_VERSION=0.30.2

RUN apk add --no-cache \
    unzip \
    ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

COPY ./pocketbase/pb_migrations /pb/pb_migrations
COPY ./pocketbase/pb_hooks /pb/pb_hooks

EXPOSE 8080

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]
