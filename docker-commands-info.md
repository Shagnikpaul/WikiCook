backend port : 8080
db : 5432
auth : 8001

health for auth : localhost:8001/health


run the docker compose command

```
docker compose up
```


see logs for particular container
```
docker logs -f wikicook-auth
```