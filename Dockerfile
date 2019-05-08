FROM node:11.15.0-alpine
WORKDIR /app
RUN apk update && apk add python g++ make && rm -rf /var/cache/apk/*
COPY . /app
RUN ["yarn", "install"]
RUN ["yarn", "build"]
# expose 2222
ENV NODE_ENV production
CMD ["yarn", "start"]
