FROM gitpod/workspace-dotnet
USER gitpod
# Install .NET now
RUN wget -q https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
	&& sudo dpkg -i packages-microsoft-prod.deb \
	&& sudo apt-get update \
	&& sudo apt-get install -y \
		fsharp \
		apt-transport-https \
		dotnet-sdk-3.1 \
		aspnetcore-runtime-3.1 \
		dotnet-runtime-3.1 \
		mono-complete