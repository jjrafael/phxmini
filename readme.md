# Phoenix

## Mini selective version
This demo project will only show selected applications within the whole Phoenix project, this includes:
- Operator Manager
- Customer Chat
- Instant Actions

**NOTE: Folder structure may look scattered on this, since I removed other applications to showcase only selected applications I have worked on.

### Running in development mode
1. In terminal, run ```npm start```
2. The default env will be ```dev``` which points to dev server
3. To point to another proxy url, run ```npm start -- --env={env}```
4. For example, run ```npm start -- env=test``` to run against Test environment
5. There are 3 different environments: ```dev```, ```dev2```, and ```test```
6. ```dev2``` is pointed to dev2 server
7. ```test``` is pointed to test server
8. To point to a custom proxy url, run ```npm start -- --url={url}```
9. For example, run ```npm start -- --url=https://192.168.1.100:8080/```

## Stylesheets
### Adding new/custom icons using icomoon app
(https://icomoon.io/app/#/select)

**NOTE: Do this only in develop branch**

##Disclaimer
This demo project might not work at all for guests outside my team's network, since APIs and back-end integration might need to implement using VPN. This will only serves as sample to showcase my works within "Phoenix" project.

