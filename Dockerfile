FROM node:22-bullseye

# Install Python 3 and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Set working directory
WORKDIR /app

# Copy server and client folders, plus requirements
COPY ./server ./server
COPY ./client ./client
COPY ./server/books.csv ./server/books.csv


# Install Python dependencies
RUN pip3 install pandas numpy scikit-learn


# Install Node dependencies for backend
RUN npm install --prefix server

# Install Node dependencies for frontend
RUN npm install --prefix client

# Build React frontend
RUN npm run build --prefix client

# Expose backend port
EXPOSE 5000

# Start the Node server
CMD ["node", "server/server.js"]

