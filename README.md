# Purpose

This project was developed in response to research results discussed in [The Role of SBOMs & Vex in Cyber Risk Mitigation](https://figshare.com/articles/thesis/Supply_Chain_Security_The_Role_of_SBOMs_and_VEX_in_Cyber_Risk_Mitigation_pdf/29804285/1?file=56847680).

This product seeks to simplify cybersecurity best practice by providing an easy to use interface for SBOM and VEX generation, while also providing tailored recommendations to users.

# How it Works

This website uses an Express server backed to recieve requests sent by the React frontend. In this implementation, the backend listens on port 3001 and the frontend sits on port 3000. 

When a user enters the website, they upload their code repository (in .zip file format) and then click the "Run Analysis" button to begin processing. This request is sent to the backend, which generates an SBOM document by entering the zip file into the open source tool Syft. This SBOM is then inputted into the open source tool Grype which generates a VEX document. Finally, the SBOM and VEX document are compiled into a prompt which is sent to a generative AI, the AI then returns security recommendations and timelines.

# AI Overview

Currently our tool uses an API key from Anthropic that runs the SBOM/VEX docs through the Claude 4.0 Sonnet Model. If you would like to get the full use out of our tool you need to go to https://console.anthropic.com - make an account and purchase api credits, at which point your key can be added to a .env file and kept securely as CLAUDE_API_KEY=[your key]. The implemetntation of Claude and your API Key is on line 89 of server.js if you are needing to change the setup to use another model (there is also a test on line 5 to make sure the key was loaded properly). Using a public model API was useful for our demo, but in practice can be expensive and inconsice. In the near future we would like to devolop our own model that is tailored to SBOM, VEX, and Cybersecurity data.  

# Run it Locally

In two seperate terminal windows:

First Terminal Window:
cd back
node server.js

Second Terminal Window:
cd front/react_app
npm run build
npm start

When first running this project, you will encounter dependency issues. Whenever you get this type of error, be sure to run:

npm install [name of missing package]

For example:
npm install react-router-dom
npm install express
npm install cors
npm install socket.io


This will likely need to be repeated multiple times in each terminal window to ensure all necessary packages and dependencies are installed. If using "npm install" doesn't solve the issue, it is likely the dependency is not an npm package, and in this case it is recommended to use your operating systems' package manager to install any necessary software. If you are unable to fix the issue, consult other sources or contact us.

