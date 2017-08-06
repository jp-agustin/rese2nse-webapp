# Instructions (Developer)

So far, editing and running the RESE2NSE web application only works in Linux devices.

### Pre-requisites

* Before using the web application, make sure to have Node.js installed on your devices:

Instructions for the node.js installation can be found on its website: [Node.js](https://nodejs.org/en/download/package-manager/)

* After installing Node.js, proceed to the installation of the needed Node.js web application framework (Express and bodyParser)

```
        npm install express
        npm install body-parser
```

* Extract gdp.tar.gz inside your working folder. Install and set-up the GDP.

* After the GDP installation, make sure to change the system path on both the gdp_node1.py and gdp_node2.py.

* You can now run the application using either of the following commands:

```
        node server
        nodemon server.js
```

` NOTE: Run the web application only on the updated web browser versions for proper viewing of the web elements: At least version 57 of Google Chrome or at least version 52 of the Mozilla Firefox `