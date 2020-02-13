# Deploy compiled frontend to web server and puppet repo
#

all : deploy
.PHONY : all deploy production

deploy : local
#	rsync -r --delete dist/aws/ portal.wattsworth.net:/opt/angular
	rsync -r --delete dist/local/ portal.wattsworth.net:/opt/standalone
	rsync -r --delete dist/local/ cloud2.wattsworth.net:/var/www/frontend
	ssh portal.wattsworth.net ./update_lumen_tarball.sh

olddeploy: 
	rsync -r -v -e 'ssh -p 2222' --delete dist/local/ beta.wattsworth.net:/home/jdonnal/puppet/modules/static_sites/files/lumen && \
	ssh -A -p2222 beta.wattsworth.net /home/jdonnal/rebuild_angular.sh

production:
	ng build --configuration aws  --output-path dist/aws --prod 
local:
	ng build --configuration production --output-path dist/local --prod

