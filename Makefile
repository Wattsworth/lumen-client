# Deploy compiled frontend to web server and puppet repo
#

all : deploy
.PHONY : all deploy build

deploy : build
	rsync -r --delete dist/lumen/ cloud:/var/www/frontend
	ssh cloud ./update_lumen_tarball.sh
build:
	ng build --configuration production

