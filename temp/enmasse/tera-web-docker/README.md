
TERA Docker Website
=====


Development Setup
=====

        git clone git@github.com:enmasse-entertainment/tera-web-docker.git
        cd tera-web-docker

Very First Build:

		docker build .        (builds the image)
		docker-compose build  (associates the website, database and redis)


Run Generate or other Rails/Rake tasks:

		docker exec -it terawebdocker_web_1 /bin/bash
		
		* will open a shell to work with Rails as you would normally
		* the website has to be running for this command to work



Launch your local environment:

        docker-compose up

        Ctrl-c to shut down

        if it doesn't quit itself successfully:
        docker-compose down


Deployment Build
=====

To deploy, you must build an image, push the image to the repo and then update the service with your image
You may either build the image manually or with a script.


Manual Deployment:  

1) docker-compose build web || docker build .  (Either one works)  

2) docker tag build_ref docker-registry:port/image_name(:tag)  
Ex:
docker tag 2a7b7df877fd docker.enmasse.com:5000/terawebdocker:staging0215170

3) docker push docker_registry:port/image_name(:tag)  
Ex:
docker push docker.enmasse.com:5000/terawebdocker:staging0215170

4) ssh to QA swarm manager, sudo su -  

5) docker service update service_name --image docker_registry:port/image_name(:tag)   
Ex: 
docker service update test-tera --image docker.enmasse.com:5000/terawebdocker:staging0215170


Script Deployment:  

In a terminal window, cd to the project directory where the dockerfile is located and run this script

		sitename=terawebdocker && dregistry=docker.enmasse.com:5000 && date=`date +%s` && docker build -t=$dregistry/$sitename:$date . && docker push $dregistry/$sitename:$date && printf "\n$dregistry/$sitename:$date\n"docker service update test-tera --image

This script will build an image, tag the image and push that image to the repo. It will also return the final tag to you for further use. You must still ssh into the desired server and update the desired service with the final image tag.

After you have updated the service with your new image, you may check on it's deployment with the following script

'docker service inspect test-tera --pretty' to watch it work. Skip the pretty to dump it in JSON. Can also tail syslogs.



Docker Manager  
====


the two service callouts are  

Live/Production  
====  
ch3-dkrsm-p04.chi1.enmasse.com (10.63.47.32)  
ch3-dkrsm-p05.chi1.enmasse.com (10.63.47.33)  

docker service update tera --image  name_of_image

QA/Edge Server  
====  
CH3-dkrsm-t01.chi1.enmasse.com (10.63.46.20)
  
docker service update test-tera --image  name_of_image



Check Logs
=====
ssh into server

then sudo su  
  become the root user

then docker ps -a  
  to find your name_of_image

then for log  
  docker exec -i -t name_of_image /bin/bash

or for rails console    
  docker exec -i -t name_of_image /bin/bash  
  rails c


Helpful Docker Info
=====

https://wiki.enmasse.com/index.php/Docker  

http://chrisstump.online/2016/02/20/docker-existing-rails-application/

https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes


