FILE_NAME=DB_`date +"%Y%m%d%H%M%S"`
SRC=/home/ubuntu/cindy/DBBackup

DB_USER=dba_rella
DB_PASSWD=DbPassw0rd!@#$
DB_NAME=cindy

/usr/bin/mysqldump -u${DB_USER} -p${DB_PASSWD} ${DB_NAME} > ${SRC}/${FILE_NAME}.sql

tar -cvzf ${SRC}/${FILE_NAME}.tar.gz ${SRC}/${FILE_NAME}.sql

rm -rf ${SRC}/${FILE_NAME}.sql
