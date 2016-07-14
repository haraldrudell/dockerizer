<h1 align=center>
  Skeleton Node.js ECMAScript 2016/stage-0 Deploy
</h1>
Written by <a href=http://haraldrudell.com >Harald Rudell</a>

><dl>
  <dt>One-liner install, run and open a browser on Linux, press two control+c to exit:</dt>
  <dd>git clone --depth 1 https://github.com/haraldrudell/dockerizer.git && cd dockerizer && npm install && npm start</dd>
  <dt>then Dockerize:</dt>
  <dd>npm run dockerize</dd>
</dl>

<h2>Benefits</h2>
- **ECMAScript 2016/stage-0** show how to deploy latest ECMAScript
- **Production ready** using babel-cli deploying to Node.js 5+
- **Dockerize** command and you’re in <a href=https://www.docker.com>Docker</a>
- **Docker Image Deploy**
  deploy your code to <a href=https://aws.amazon.com/ecs>Amazon EC2 Container Service ECS</a>,
  Google <a href=https://cloud.google.com/container-engine>Container Engine GKE</a>, or
  <a href=http://kubernetes.io>Kubernetes</a>
- **Lambdarize** command and you’re in server-less <a href=https://aws.amazon.com/lambda/Lambdarize>AWS Lambda</a>

<h2>Requirements</h2>
- npm start
  - Node.js 5+
- npm run dockerize
  - logged in user is member of group docker
    - sudo usermod --append --groups docker *username*
    - logout/login
  - docker running
    - sudo systemctl start docker

© 2016 <a href=http://haraldrudell.com >Harald Rudell</a> ISC [License](LICENSE)
