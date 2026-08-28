Closers Website
=====

Development Setup
=====

        git clone git@github.com:enmasse-entertainment/closers-website.git
        cd closers-website

Very First Build:

		docker-compose build  (associates the website, database and redis)

Launch your local environment:

        docker-compose up

        Ctrl-c to shut down

        if it doesn't quit itself successfully:
        docker-compose down

Run Generate or other Rails/Rake tasks:

		docker exec -it closerswebsite_web_1 /bin/bash
		
		* will open a shell to work with Rails as you would normally
		* the website has to be running for this command to work


Deployment Build
=====

To deploy, you must build an image, push the image to the repo and then update the service with your image
You may either build the image manually or with a script.


Manual Deployment:  

1) docker-compose build web || docker build .  (Either one works)  

2) docker tag build_ref docker_registry:port/image_name(:tag)  
Ex:
docker tag 2a7b7df877fd docker.enmasse.com:5000/closers:staging0215170

3) docker push docker_registry:port/image_name(:tag)  
Ex:
docker push docker.enmasse.com:5000/closers:staging0215170

4) ssh to QA swarm manager, sudo su -  

5) docker service update service_name --image docker_registry:port/image_name(:tag)   
Ex:
docker service update test-closers --image docker.enmasse.com:5000/closers:staging0215170


Script Deployment:  

In a terminal window, cd to the project directory where the dockerfile is located and run this script

		sitename=closers && dregistry=docker.enmasse.com:5000 && date=`date +%s` && docker build -t=$dregistry/$sitename:$date . && docker push $dregistry/$sitename:$date && printf "\n$dregistry/$sitename:$date\n"docker service update closers --image

This script will build an image, tag the image and push that image to the repo. It will also return the final tag to you for further use. You must still ssh into the desired server and update the desired service with the final image tag.

After you have updated the service with your new image, you may check on it's deployment with the following script

'docker service inspect closers --pretty' to watch it work. Skip the pretty to dump it in JSON. Can also tail syslogs.



Docker Manager   

Live/Production  
====  
ch3-dkrsm-p04.chi1.enmasse.com (10.63.47.32)  
ch3-dkrsm-p05.chi1.enmasse.com (10.63.47.33)  

docker service update closers --image  name_of_image



QA/Edge Server  
====  
CH3-dkrsm-t01.chi1.enmasse.com (10.63.46.20)  

docker service update test-closers --image  name_of_image

Clear Cache
====

Visit https://closers.enmasse.com/cache/clear


Helpful Docker Info
=====

https://wiki.enmasse.com/index.php/Docker  

http://chrisstump.online/2016/02/20/docker-existing-rails-application/

https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes
