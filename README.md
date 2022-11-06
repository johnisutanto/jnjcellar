# This is J&J Cellars website

## Development
Need a DB. Download from MS website.
Run `docker run --cap-add SYS_PTRACE -e 'ACCEPT_EULA=1' -e 'MSSQL_SA_PASSWORD=Whatever' -p 1433:1433 --name azuresqledge -d mcr.microsoft.com/azure-sql-edge`.

Replace password with your local db password when you setup the azure sql edge
