FROM ruby:2.3.3

MAINTAINER EME Platform <platform@enmasse.com>


ENV APP_ROOT /app

RUN mkdir $APP_ROOT
WORKDIR $APP_ROOT
ADD Gemfile Gemfile.lock ./

RUN sed -i '/jessie-updates/d' /etc/apt/sources.list

RUN apt-get update && \
    apt-get install -y \
    mysql-client  \
    imagemagick \
    nodejs \
    sqlite3 \
    libsqlite3-dev \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    gem install bundler && \
    cd $APP_ROOT && \
    bundle install

ADD . $APP_ROOT
EXPOSE 3000

ENTRYPOINT [ "sh", "-c", "bundle install; bundle exec rake assets:precompile && bundle exec puma -C config/puma.rb" ]