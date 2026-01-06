

## Conda Commands 

To create environment in the current directory ...


```
conda create --prefix ./wikihow-backend-env python=3.10
```

then activate it 

```
conda activate ./wikihow-backend-env/
```





## Development Process

Use local env for normal development and testing and after done test the changes in the docker using the provided docker file.


To build the image
```
docker build -t wikicook-backend-image .
```
Here
- `-t` to specify a tag for the image here is it `wikicook-backend-image`. Add `:` after the name to specify version like `wikicook-backend-image:v1`

- `.` at the end of the command specifies the directory where the image is built from (which has the docker-file and the code files)


To create a container

```
docker run -d --name wikicook-backend -p 8001:8000 wikicook-backend-image
```

> `-p 8001:8000` where 8001 is the host port and 8000 is the container port


> Add `--rm` flag to delete the container after its stopped.


for interactive and auto-delete post stop
```
docker run -it --rm --name wikicook-backend -p 8001:8000 wikicook-backend-image
```


## Database Commands


Docker command to spin up a postgresql db

```
docker run --name postgres-db \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_DB=mydatabase \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  -d postgres
```

> Volume mount flag `-v <source> : <destination>`


To get continuos logs of a container

```
docker logs -f <container_name>
```