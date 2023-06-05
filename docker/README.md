# Setup development environment and run first time

## Install docker & docker-compose

### Install docker Community edition

On Ubuntu use following commands (https://docs.docker.com/install/linux/docker-ce/ubuntu/):


```
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

```

On Debian use following commands (https://docs.docker.com/install/linux/docker-ce/debian/):


```
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

```

In Linux you must add your user to group "docker":

```
sudo usermod -a -G docker `whoami`
```

And then restart your computer


### Install docker-compose

Installation instruction https://docs.docker.com/compose/install/

For Linux you can use following commands:
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
```

## Create folder for wordpress, download and unpack wordpress

For Linux, you can use following commands:

```
mkdir html
cd html
wget https://wordpress.org/wordpress-5.3.1.tar.gz
tar -xvf wordpress*.tar.gz
mv wordpress/* .
rmdir wordpress
rm wordpress*.tar.gz
cd ..
```

## Startup docker

For getting up all docker containers, please run

```
docker/up-dev
```

After successfull build and start you can leave this command running and go to next step. 
While starting, containers will create symlinks in html/wp-content/themes and html/wp-content/plugins folders, that will point to other checkouted repositories.

## Installing wordpress

Open http://localhost:8080 in browser and install wordpress. For database
Use following credentials:

```
Host: db
database: wordpress
login: username
password: password
```

Now you can login to admin panel and activate theme, plugins, and install
other required plugins

# Working

if docker is started, wordpress is accessible by url http://localhost:8080

# Stopping development environment

Simply press Ctrl+C in console, where docker/up-dev is running