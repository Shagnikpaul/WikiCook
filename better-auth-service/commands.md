## to build  just the auth-service seperately 


```
docker build -t better-auth-service .
```


if you want with logs


```
docker build --progress=plain -t better-auth-service .
```


run the container assuming the .env file is present in the same location as the `Dockerfile`


```
docker run \
  --env-file .env \
  -p 8001:8000 \
  better-auth-service
```


with temporary

```
docker run --rm\
  --env-file .env.docker \
  -p 8001:8000 \
  better-auth-service
```