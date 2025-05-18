FROM node:20.2.0

#RUN mkdir -p /server

WORKDIR /app

COPY package.json package-lock.json ./

#RUN mkdir -p /app/server/client/build

#RUN ls -l /app/my-directory | grep "^d" | awk '{print $NF}' > /directories.txt

#COPY  /directories.txt /app/

#CMD cat /directories.txt

RUN npm install 

COPY . . 

<<<<<<< HEAD
EXPOSE 3001
=======
EXPOSE 1075
>>>>>>> ea8eb667949a243477d21813b05b8a0f73d4d1c0

CMD ["npm", "start"]


