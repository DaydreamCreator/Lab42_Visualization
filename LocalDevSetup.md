
## Prerequisites
```
node --version
java --version
mvn --version
python --version
mongo --version
```

## Database Configuration
1. Move the AI service directory
```bash
cd aiservice
```
2. Create the virtual environment
``` bash
python -m venv venv
```
install the dependencies
```bash
pip install -r requirements.txt
```

3. Activate the virutal environment
```
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```
```bash
mongod-local

```
4. Setup OpenAI key
```bash
export OPENAI_API_KEY=the_key
```
5. Run
``` bash
flask run
```

## Backend Configuration
```bash
cd backend

# install dependencies
mvn clean install

# run the application
mvn spring-boot:run
```
The backend service can be accessed via http://localhost:8080.


## AI Service Configuration
```bash
. env/bin/activate
```
## Frontend Configuration

1. Install dependencies:
```bash
npm install
```
2. Start development server:
```bash
npm run dev
```
3. Build for production:
```bash
npm run build
```
