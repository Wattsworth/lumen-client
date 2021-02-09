# Deploy compiled frontend to web server and puppet repo
#

all : deploy
.PHONY : all deploy build

deploy : build
	rsync -r --delete dist/local/ cloud:/var/www/frontend
	ssh cloud ./update_lumen_tarball.sh
build:
	ng build --configuration production --output-path dist/local --prod

