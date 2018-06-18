# build environment
FROM node:8 as builder

RUN mkdir /code
WORKDIR /code

# ENV PATH /code/node_modules/.bin:$PATH
COPY . /code
RUN yarn install
RUN yarn build


# final container
FROM nginx:1.13-alpine

COPY --from=builder /code/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5000

CMD ["nginx", "-g", "daemon off;"]
