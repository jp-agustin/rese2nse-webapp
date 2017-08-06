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

#Create GCL Command format
def command_gcl(nodeName, comm):    
    if comm == "sleep" or comm == "start" or comm == "stop":
        command = comm + " " + nodeName
    else:
        command = "set sensor -id " + nodeName + " " + comm

    return command

def main():
    #Initialization of GDP Connection
    gdp.gdp_init() 

    gcl_cmdup = "test.ph.edu.upd.eee.resense.app.13.cmd.up"
    gcl_cmddown = "test.ph.edu.upd.eee.resense.app.13.cmd.down"

    #Assignment of gcl write and read port
    gcl_handle_down = gdptools.open_gcl_write(gcl_cmddown)
    time.sleep(1)
    gcl_handle_read = gdptools.open_gcl_read(gcl_cmdup)
    
    lines = read_in()
    param = lines.split(",")
    
    #Parse input - determine mode of operation
    mode = param[0].translate(None, '[').translate(None, '"')
    nodeName = param[1].translate(None, '"').translate(None, ']')

    #Parse data to be written
    if mode == "write":
        time.sleep(5)
        count = 2
        command_no = 0
        read_no = 0

        #Sending of commands to GDP
        while count < len(param):
            dataString = param[count].translate(None, ']').translate(None, '"').translate(None, '[')
            command = command_gcl(nodeName, dataString)
            gcl_handle_down.append(gdptools.pack_datum(command))
            count += 1
            command_no += 1

        time.sleep(1)

        start = -1
        dataDone = gcl_handle_read.read(start)
        recno = dataDone['recno']
        dataOK = ""

        #Acknowledgements received from the GDP
        while recno>=1:
            try:
                dataDone = gcl_handle_read.read(recno)['data']
                data = dataDone.split(" ")
                last_Command = data[1] + " " + data[2] + " " + data[3]

                if last_Command == ("OK " + dataString):
                    read_no += 1
                    dataOK = dataOK + '\n' + dataDone
                    if read_no == command_no:
                        break
                else:
                    start = -1
                    dataDone = gcl_handle_read.read(start)
                    recno = dataDone['recno']

            except:
                print "error"
                break

        print dataOK

    #Sending of read commands and reception of data replies from the GDP
    if mode == "read":
        start = -1

        dataRead = nodeName
        command = "get node -id " + nodeName + " status"
        gcl_handle_down.append(gdptools.pack_datum(command))
        time.sleep(1)

        datum = gcl_handle_read.read(start)
        recno = datum['recno']

        #Reads all data asked by the web application
        while recno>=1:
            try:
                datum = gcl_handle_read.read(recno)['data']
                data = datum.split()
            
                if data[0] == "node" and data[2] == "end":
                    while len(data)<4:
                        recno -= 1
                        datum = gcl_handle_read.read(recno)['data']
                        data = datum.split()

                        if data[0] == "PL":
                            power = data[1]
                            dataRead = dataRead + ', ' + power
                        if data[0] == "RR":
                            uni = data[1]
                            dataRead = dataRead + ', ' + uni
                        if data[0] == "MT":
                            broad = data[1]
                            dataRead = dataRead + ', ' + broad
                        if data[0] == "MR":
                            mesh = data[1]
                            dataRead = dataRead + ', ' + mesh
                        if data[0] == "SP":
                            sleep = data[1]
                            dataRead = dataRead + ', ' + sleep
                        if data[0] == "WT":
                            wake = data[1]
                            dataRead = dataRead + ', ' + wake
                    
                    break
            
                else:
                    start = -1
                    datum = gcl_handle_read.read(start)
                    recno = datum['recno']
            
            except:
                print "error"
                break

        #Sends read data to the web application
        print dataRead

if __name__ == '__main__':
    main()
