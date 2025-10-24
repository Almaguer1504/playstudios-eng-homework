!!Important. NodeJs Needed!
!!Important. SamCli Needed!
!!Important. You will need to have docker installed and runing to start

 For Frontend: `cd frontend`
- Recommended: `Node.js v20.x`
- **Install:** `npm i` or `yarn install`
- **Start:** `npm run dev` or `yarn dev`
- **Build:** `npm run build` or `yarn build`
- Open browser: `http://127.0.0.1:8000/`


For Backend: `cd backend`
- **Setting Local MongoDB:** `docker pull mongodb/mongodb-community-server`
- **For Data Persistance:** `docker volume create mongodb_data`
- **Run Services:** `docker run --name mongodb -d -p 27017:27017 -v mongodb_data:/data/db mongodb/mongodb-community-server`
- **Build:** `sam build --template api.yaml`
- **Start:** `sam local start-api`
- Api should be running on: `http://127.0.0.1:3000/`


!!Important. You need to set up the following environment variables in the api.yaml file. Avoid committing them to git.

Globals:
  Function:
    Timeout: 10
    MemorySize: 512
    Environment:
      Variables:
        JWT_SECRET: # the JWT secret to be use. DEFAULT: "this is my custom Secret key for authentication"
        TOKEN_ISSUER: # your JWT token issuer. DEFAULT: "abe"
        TOKEN_AUDIENCE: # your JWT token audience. DEFAULT: "dev"
        MONGODB_URI: # your mongodb+srv:// database uri. DEFAULT: "mongodb://172.17.0.1:27017/"
        MONGODB_DATABASE: # the name of mongo db to use. DEFAULT: "prizesapp"
        

!!Important. For Admin First Access
Create your new database MongoDB. (**Use the same name configured on environment variables**)
Create a new "prizes" collection to MongoDB on your configured database
Create a new "users" collection to MongoDB on your configured database
Add default-admin-user.json to "users" collection

Default Credentials:
- **Email:** playstudios@admin.com
- **Password:** PlaystudiosAdmin123
