FROM gitpod/workspace-full

# create /nix
RUN sudo mkdir /nix && sudo chown `id -u`.`id -g` /nix 
# give up root privileges
RUN sudo -k                                            
# install Nix
RUN curl https://nixos.org/nix/install | bash  && . /home/gitpod/.nix-profile/etc/profile.d/nix.sh      

# Get F#
RUN  nix-env -iA nixpkgs.fsharp
USER gitpod

# Install custom tools, runtime, etc. using apt-get
# For example, the command below would install "bastet" - a command line tetris clone:
#
# RUN sudo apt-get -q update && \
#     sudo apt-get install -yq bastet && \
#     sudo rm -rf /var/lib/apt/lists/*
#
# More information: https://www.gitpod.io/docs/config-docker/
