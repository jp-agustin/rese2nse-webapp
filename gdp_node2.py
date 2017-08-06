import os
import os.path
import sys
import gdp
import gdptools
import time
import json

#system path for the gdp library. Format: "/<current_location>/gdp/lang/python/"
sys.path.append("/<current_location>/gdp/lang/python/")

#Read data from server.js
def read_in():
  lines = sys.stdin.readlines()
  return lines[0]

def main():
  #Initialization of GDP Connection
  gdp.gdp_init()

  try:
    gdptools.create_gcl("test.ph.edu.upd.eee.resense.node2.120.app")
  except:
    print "Done"

  gcl_agg = "test.ph.edu.upd.eee.resense.node2.120.agg"
  gcl_app = "test.ph.edu.upd.eee.resense.node2.120.app"

  #Assignment of gcl write and read ports
  gcl_handle_down = gdptools.open_gcl_write(gcl_agg)  
  time.sleep(1)
  gcl_handle_read = gdptools.open_gcl_read(gcl_app)
  
  lines = read_in()
  param = lines.split(",")

  #Parse input - determine mode of operation
  mode = param[0].translate(None, '[').translate(None, '"')

  #Parse data to be written
  if mode == "write":
    count = 1
    command_no = 0
    read_no = 0

    #Indicates start of commands to be written in GDP
    gcl_handle_down.append(gdptools.pack_datum("start"))

    #Sending of commands to GDP
    while count < len(param):
      dataString = param[count].translate(None, ']').translate(None, '"').translate(None, '[')
      gcl_handle_down.append(gdptools.pack_datum(dataString))
      count += 1
      command_no += 1

    #Indicates end of commands
    gcl_handle_down.append(gdptools.pack_datum("end"))

    time.sleep(1)

  #Sending of read commands and reception of data replies from the GDP
  if mode == "read":
    count = 1
    command_no = 0
    dataRead = " "

    start = -1

    #Indicates start of read commands
    gcl_handle_down.append(gdptools.pack_datum("start"))

    #Sending of read commands to the GDP
    while count < len(param):
      dataString = param[count].translate(None, ']').translate(None, '"').translate(None, '[')
      gcl_handle_down.append(gdptools.pack_datum(dataString))
      count += 1
      command_no += 1

    #Indicates end fo read commands
    gcl_handle_down.append(gdptools.pack_datum("end"))

    time.sleep(1)

    #Reading replies from the GDP
    checker = gcl_handle_read.read(start)

    #Program checks whether GDP already received all the data needed 
    #from the coordinator node
    while checker['data'] != "end":
      checker = gcl_handle_read.read(start)
      if checker['recno'] < 1:
        break

    recno = checker['recno'] - 1

    while recno >= 1:
      try:
        #Get last log entry
        datum = gcl_handle_read.read(recno)['data']
        
        #Reads all data asked by the web application
        if datum == "start":
          break
        else:
          dataRead = dataRead + ', ' + datum
          recno -= 1

      except:
        print "error"
        break

    #Sends read data to the web application
    print dataRead

if __name__ == '__main__':
    main()
