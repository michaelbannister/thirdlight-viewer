# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "forwarded_port", guest: 9000, host: 9000

  config.vm.synced_folder "images/", "/var/images", owner: "root", group: "root"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
  end

  config.vbguest.auto_update = false

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo apt-get install -y language-pack-en
    sudo apt-get install -y build-essential autoconf libtool libjpeg-dev libtiff-dev zlib1g-dev
    sudo apt-get install -y imagemagick

    wget https://github.com/ruven/iipsrv/archive/iipsrv-1.0.tar.gz
    tar -xf iipsrv-1.0.tar.gz
    pushd iipsrv-iipsrv-1.0
    ./autogen.sh > autogen.log && ./configure > configure.log && make > make.log || \
      { echo "failed to build iipsrv"; exit 1 }
    popd

    sudo apt-get install -y lighttpd
    sudo cp /vagrant/provision/20-iipsrv.conf /etc/lighttpd/conf-available/
    sudo ln -s --target-directory=/etc/lighttpd/conf-enabled ../conf-available/20-iipsrv.conf
    sudo /usr/sbin/lighty-enable-mod fastcgi
    sudo mkdir -p /var/www/fcgi-bin
    sudo cp iipsrv-iipsrv-1.0/src/iipsrv.fcgi /var/www/fcgi-bin
    sudo /etc/init.d/lighttpd force-reload

  SHELL
end
