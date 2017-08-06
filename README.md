# Instructions (Developer)

So far, editing and running the RESE2NSE web application only works on Linux devices.

### Pre-requisites

Before using the web application, make sure to have Node.js installed on your devices. Instructions for installing node.js can be found on its website: [Node.js](https://nodejs.org/en/download/package-manager/)

When you already have Node.js on your device, proceed to the installation of the required Node.js web application frameworks:

```
        npm install express
        npm install body-parser
```

For proper viewing, update your preferred web browsers to at least the following versions: Google Chrome v.57 or Mozilla Firefox v.52

### Installation

Extract gdp.tar.gz inside your working folder. Install and set-up the GDP.

After installing the GDP, make sure to change the system path on both the gdp_node1.py and gdp_node2.py.

You can now run the application using either of the following commands:

```
        node server
        nodemon server.js
```