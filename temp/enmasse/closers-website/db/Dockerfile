FROM percona:5.6

ENV MYSQL_ALLOW_EMPTY_PASSWORD=yes
ENV MYSQL_USER=dev_user
ENV MYSQL_PASSWORD=dev_pass
ENV MYSQL_DATABASE=site_development

COPY init.sql.gz /docker-entrypoint-initdb.d/10-init.sql.gz
