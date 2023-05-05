# This is J&J Cellars website

## Development
Need a DB. Download from MS website.
Run `docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=Whatever' -p 1433:1433 --name azuresqledge -d mcr.microsoft.com/azure-sql-edge`.
Replace password with your local db password when you setup the azure sql edge.

This only need to be run once. After that, to start the container run:
`docker start {container ID}`
Example:
`docker start 13ee894d9768118350419cd2210add969cdf18fdd29f7f5ffb07ede4530c4b14`
